import { Request, Response } from "express";
import * as fs from "fs";
import { upload } from "../middlewares/multerMiddleware";
import { uploadToCloudinary } from "../utilities/cloudinary";

export const FileUpload = (req: Request, res: Response): void => {
    upload.single("pdf")(req, res, async (err: any) => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: "Send a PDF in the 'pdf' form field" });
            return;
        }
        try {
            const uploadedUrl = await uploadToCloudinary(req.file);
            res.status(200).json({ message: "File has been uploaded", uploadedURl: uploadedUrl, uploadedURL: uploadedUrl });
        } catch {
            res.status(500).json({ message: "Failed to upload file" });
        } finally {
            fs.unlink(req.file.path, () => undefined);
        }
    });
};
