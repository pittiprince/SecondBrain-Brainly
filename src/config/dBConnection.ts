import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

//connection
 export const connectDb = async () => {
    try{
        await mongoose.connect(process.env.db_URL as string);
        console.log("Connected to the database");
    }catch{
        console.log("Could not connect to the database");
    }
 }