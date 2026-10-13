import { Schema ,Document, model } from "mongoose";
import { SignupUserInterface } from "../interface/SignupUserInterface";

//schema
const Signup = new Schema<SignupUserInterface>({
    name: {type: String , required: true},
    email: {type: String , required: true , unique: true, lowercase: true, trim: true},
    password: {type: String , required: true} ,
    SecretKey: {type: String , required: false},
},
{
    timestamps: true
}
)


//model
export const SignupModel = model<SignupUserInterface>("Signup",Signup);
