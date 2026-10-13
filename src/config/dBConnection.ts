import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDb = async () => {
    await mongoose.connect(process.env.db_URL as string);
    console.log("Connected to the database");
};
