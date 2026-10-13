import dotenv from 'dotenv';
dotenv.config();
import { createApp } from './createApp';
import { connectDb } from './config/dBConnection';

const missing = ['db_URL', 'JWT_SECRET_KEY'].filter((name) => !process.env[name]);
if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}
if (!process.env.HuggingFaceAccessKey) console.warn('HuggingFaceAccessKey is not set: embedding generation will not work');
if (!process.env.cloud_name) console.warn('Cloudinary variables are not set: PDF upload will not work');

// hosting platforms (Render, ...) provide the port through PORT
const PORT = Number(process.env.PORT) || 3000;

(async () => {
    try {
        await connectDb();
        createApp().listen(PORT, '0.0.0.0', () => console.log(`Server is running on PORT ${PORT}`));
    } catch (err: any) {
        console.error('Could not start the server:', err.message);
        process.exit(1);
    }
})();
