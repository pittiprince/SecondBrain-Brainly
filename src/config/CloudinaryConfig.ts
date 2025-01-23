import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
    cloud_name: "dbuxtztlx", 
    api_key: '923938359964551', 
    api_secret: "nxQdoV3zy8K6rDOEoM3fyZal1kY" 
});

export default cloudinary;