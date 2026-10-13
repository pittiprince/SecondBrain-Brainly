import { Schema ,Document, model } from "mongoose";
import { GoogleAuthInterface } from "../interface/GoogleAuthInterface";

//schema
const GoogleAuthSchema = new Schema<GoogleAuthInterface>({
    name: {type: String , required: true},
    email: {type: String , required: true , unique: true, lowercase: true, trim: true},
    email_verified: {type: Boolean , required: true},
    SecretKey: {type: String , required: false},
},
{
    timestamps: true
}
)

//model
export const GoogleAuthModel = model<GoogleAuthInterface>("GoogleAuth",GoogleAuthSchema);