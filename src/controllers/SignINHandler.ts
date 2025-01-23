import { Request, Response } from "express";
import { SignupModel } from "../models/SignupModel";
import { passwordHashing, passwordMatch } from "../utilities/passwordHasing";
import jwt from 'jsonwebtoken';
import { signInInterface } from "../interface/SignInInterface";
export const SignINHandler = async (req: Request, res: Response) => {
    try {
        const signinData : signInInterface = req.body;
        let data = await SignupModel.findOne({ email: signinData.email });
        let isHashedTrue = data?.password ? await passwordMatch(signinData.password, data.password) : false;
        if (isHashedTrue) {
            if (signinData.JWT) {
                try {
                    let JWTVERIFY = jwt.verify(signinData.JWT, process.env.JWT_SECRET_KEY as string);
                    if (JWTVERIFY) {
                        res.status(200).json({ message: "JWT verified, signed in successfully" });
                    } else {
                        res.status(400).json({ error: "Invalid JWT" });
                    }
                } catch (err) {
                    res.status(400).json({ error: "JWT verification failed" });
                }
            } else {
                res.status(400).json({ error: "JWT not provided" });
            }
        } else {
            res.status(400).json({ error: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err});
    }
}