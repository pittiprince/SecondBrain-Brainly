import { Request, Response } from "express";
import { GoogleAuthModel } from "../models/GoogleAuthModel";
import { signToken } from "../utilities/token";

// After the Auth0 login redirect: find or create the user and hand back a JWT.
export const googleUserDetails = async (req: Request, res: Response) => {
    if (!req.oidc || !req.oidc.isAuthenticated() || !req.oidc.user?.email) {
        res.status(401).json({ message: "Not signed in with Google" });
        return;
    }
    const profile = req.oidc.user;
    const email = String(profile.email).toLowerCase();

    let user = await GoogleAuthModel.findOne({ email });
    const isNew = !user;
    if (!user) {
        user = await GoogleAuthModel.create({ name: profile.name ?? email, email, email_verified: Boolean(profile.email_verified) });
    }
    const jwtKey = signToken({ id: String(user._id), email });
    res.status(200).json({ message: isNew ? "New User Created" : "Verified existing user", jwtKey, token: jwtKey });
};
