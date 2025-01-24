import { Request, Response } from "express";
import { SignupUserInterface } from "../interface/SignupUserInterface";
import { SignupModel } from "../models/SignupModel";
import { passwordHashing } from "../utilities/passwordHasing";
import jwt from 'jsonwebtoken';

export const UserSignupHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        let userSignupDetails: SignupUserInterface = req.body;
        let isUserTrue = await SignupModel.findOne({email:userSignupDetails.email})
        if(isUserTrue){
            res.status(400).json({"message:":"User already exist with the same email"})
        }
        const hashedPassword = await passwordHashing(userSignupDetails.password);
        let dbwrite = await SignupModel.create({
            name: userSignupDetails.name,
            email: userSignupDetails.email,
            password: hashedPassword
        })
        let JWT = jwt.sign({ email: userSignupDetails.email }, process.env.JWT_SECRET_KEY as string);
        await dbwrite.updateOne({ SecretKey: JWT }); 
        dbwrite.save(); 
        res.status(200).json({ message: "User Signed Up Successfully" , jwtKey: JWT});

    } catch (error: any) {
        res.status(500).json({ message: error })
    }
}