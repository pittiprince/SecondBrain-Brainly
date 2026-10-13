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
    // with a configured web app, hand the token to it (in the URL fragment, which is never sent to a server or logged)
    if (process.env.FRONTEND_URL) {
        res.redirect(`${process.env.FRONTEND_URL.replace(/\/$/, "")}/google-auth#token=${encodeURIComponent(jwtKey)}`);
        return;
    }
    res.status(200).json({ message: isNew ? "New User Created" : "Verified existing user", jwtKey, token: jwtKey });
};
