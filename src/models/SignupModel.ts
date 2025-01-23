import { Schema ,Document, model } from "mongoose";
import { SignupUserInterface } from "../interface/SignupUserInterface";

//schema
const Signup = new Schema<SignupUserInterface>({
    name: {type: String , required: true},
    email: {type: String , required: true , unique: true},
    password: {type: String , required: true , minlength: 8 , maxlength: 100} ,
    SecretKey: {type: String , required: false},
},
{
    timestamps: true
}
)


//model
export const SignupModel = model<SignupUserInterface>("Signup",Signup);
