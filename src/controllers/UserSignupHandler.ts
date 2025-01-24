import { Request, Response } from "express";
import { SignupUserInterface } from "../interface/SignupUserInterface";
import { SignupModel } from "../models/SignupModel";
import { passwordHashing } from "../utilities/passwordHasing";
import jwt from 'jsonwebtoken';

export const UserSignupHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userSignupDetails: SignupUserInterface = req.body;

        const existingUser = await SignupModel.findOne({ email: userSignupDetails.email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with the same email" });
            return;
        }

        const hashedPassword = await passwordHashing(userSignupDetails.password);
        const newUser = new SignupModel({
            name: userSignupDetails.name,
            email: userSignupDetails.email,
            password: hashedPassword
        });

        const jwtToken = jwt.sign({ email: userSignupDetails.email }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
        newUser.SecretKey = jwtToken;

        await newUser.save();

        res.status(201).json({ message: "User Signed Up Successfully", jwtKey: jwtToken });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}