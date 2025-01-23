import cloudinary from "../config/CloudinaryConfig";

export const uploadToCloudinary = async (file: { path: string }) => {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    } catch (error: any) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
}
