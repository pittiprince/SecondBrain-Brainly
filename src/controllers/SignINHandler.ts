import { Request, Response } from "express";
import { SignupModel } from "../models/SignupModel";
import { passwordMatch } from "../utilities/passwordHasing";
import { signToken } from "../utilities/token";
import { signInInterface } from "../interface/SignInInterface";

// compared against when the email is unknown so both failures take the same time
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.kXpQe4J3dXGJ5sXq6mZ9Qe8vJ1Yy";

export const SignINHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, password }: signInInterface = req.body;
    const user = await SignupModel.findOne({ email });
    const matches = await passwordMatch(password, user?.password ?? DUMMY_HASH);

    if (!user || !matches) {
        res.status(401).json({ error: "Invalid email or password", message: "Invalid email or password" });
        return;
    }
    const token = signToken({ id: String(user._id), email: user.email });
    res.status(200).json({ message: "Signed in successfully", token, user: { id: user._id, name: user.name, email: user.email } });
};
