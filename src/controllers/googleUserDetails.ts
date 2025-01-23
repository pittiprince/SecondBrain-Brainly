import  { Request, Response } from "express";
import { GoogleAuthModel } from "../models/GoogleAuthModel";
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
export const googleUserDetails = async (req: Request, res: Response) => {
    try{
        let userTure =req.oidc.isAuthenticated();
        if(userTure){
            let user = req.oidc.user;
            if(user){
                let userExist = await GoogleAuthModel.findOne({email : user.email})
                if(userExist){
                    if(userExist.SecretKey){
                        res.status(200).json({message: "Verified existing user" , jwtKey : userExist.SecretKey});
                    }
                    else{
                        let JWT = jwt.sign({email: user.email},process.env.JWT_SECRET_KEY as string);
                        userExist.updateOne({SecretKey: JWT});
                    }
                }
                if(!userExist){
                    let JWT = jwt.sign({email: user.email},process.env.JWT_SECRET_KEY as string);
                    let newUser = new GoogleAuthModel({
                        name: user.name,
                        email: user.email,
                        email_verified: user.email_verified,
                        SecretKey: JWT
                    });
                    await newUser.save();
                    res.status(200).json({message: "New User Created", jwtKey: JWT});
                }

            }
        }

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}