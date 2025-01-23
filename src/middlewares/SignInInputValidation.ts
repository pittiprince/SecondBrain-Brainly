import z from 'zod';
import { Request, Response, NextFunction } from 'express';

const SignInInputValidation = z.object({
  email: z.string().email({"message":"Invalid email address"}),
  password: z.string().min(6,{"message":"Password must be at least 6 characters long"}).max(20,{"message":"Password must be at most 20 characters long"}),
  JWT: z.string().optional()
});

export const SignInInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = SignInInputValidation.safeParse(req.body);
        if(parsedData.success){
            next();
        }
        if(parsedData.error){
            res.status(400).json({ error: parsedData.error.issues[0].message });
        }
        
    } catch (error:any) {
        res.status(400).json({ error: error.errors });
    }
}