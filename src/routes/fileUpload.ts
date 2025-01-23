import { Router } from "express";
import { FileUpload } from "../controllers/Fileuploader";
import verifyJwtMiddleware from "../middlewares/JWTverify";

export const FileUploadRouter = Router();

FileUploadRouter.post('/fileUpload',verifyJwtMiddleware,FileUpload )