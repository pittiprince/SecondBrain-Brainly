import { Request, Response } from "express";
import { SignupUserInterface } from "../interface/SignupUserInterface";
import { SignupModel } from "../models/SignupModel";
import { passwordHashing } from "../utilities/passwordHasing";
import { signToken } from "../utilities/token";

export const UserSignupHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password }: SignupUserInterface = req.body;

    if (await SignupModel.findOne({ email })) {
        res.status(409).json({ message: "User already exists with the same email" });
        return;
    }

    try {
        const user = await SignupModel.create({ name, email, password: await passwordHashing(password) });
        const jwtToken = signToken({ id: String(user._id), email });
        // "jwtKey" is the name the first version of the API used
        res.status(201).json({ message: "User Signed Up Successfully", jwtKey: jwtToken, token: jwtToken, user: { id: user._id, name, email } });
    } catch (error: any) {
        if (error?.code === 11000) {
            res.status(409).json({ message: "User already exists with the same email" });
            return;
        }
        throw error;
    }
};
