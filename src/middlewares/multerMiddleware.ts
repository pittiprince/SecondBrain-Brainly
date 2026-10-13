import multer from "multer";
import os from "os";
import path from "path";

// temporary files go to the OS temp dir (always exists and is writable) and are removed after the Cloudinary upload
const tempStorage = multer.diskStorage({
    destination(_req, _file, callback) {
        callback(null, os.tmpdir());
    },
    filename(_req, file, callback) {
        callback(null, `${Date.now()}-${path.basename(file.originalname).replace(/[^\w.\-]/g, "_")}`);
    },
});

export const upload = multer({
    storage: tempStorage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter(_req, file, callback) {
        if (file.mimetype !== "application/pdf") {
            callback(new Error("Only PDF files are allowed"));
            return;
        }
        callback(null, true);
    },
});
