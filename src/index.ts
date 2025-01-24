import express, { Request, Response } from 'express';
import cors from 'cors';
const app: express.Application = express();
const PORT: number = 3000;
import UserSignupRouter from './routes/SignupRoutes';
import { connectDb } from './config/dBConnection';
import { auth } from 'express-openid-connect';
import { config } from './config/Auth0Config';
import { SignInRouter } from './routes/SigninRoutes';
import { MemoryRouter } from './routes/MemoryRoutes';
import { FileUploadRouter } from './routes/fileUpload';
import { generateEmbeddings } from './routes/generateEmbeddingsRoutes';
import { SignOutRouter } from './routes/SignOut';


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(config));
app.use(cors());
app.use('/api', UserSignupRouter);
app.use('/api', SignInRouter);
app.use('/api', MemoryRouter);
app.use('/api', FileUploadRouter);
app.use('/api', generateEmbeddings);
app.use('/api', SignOutRouter)



app.listen(PORT, async () => {
    await connectDb();
    console.log(`Server is running on PORT ${PORT}`);
})