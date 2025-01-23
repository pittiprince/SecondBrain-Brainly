import { Request,Response } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { uploadToCloudinary } from "../utilities/cloudinary";
import * as fs from 'fs';

export const FileUpload = async (req: Request, res: Response): Promise<void> => {
    try{
    upload.single('pdf')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        let uploadedUrl;
        if(req.file){
            uploadedUrl = await uploadToCloudinary(req.file);
            if (!uploadedUrl) {
                return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
            }
            if(uploadedUrl){
                res.status(200).json({"message":"File has been uploaded" , "uploadedURl" :uploadedUrl})
                fs.unlinkSync(req.file.path)
            }
        }
        console.log(req.file);
        
    });
        
    }catch(error: any){
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        res.status(500).json({message: error})
    }
}