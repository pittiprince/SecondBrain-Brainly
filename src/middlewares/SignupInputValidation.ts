import z from 'zod';
import { Request, Response, NextFunction } from 'express';

const SignupInputSchema = z.object({
    email: z.string().email({'message':"Enter a valid email address"}),
    password: z.string().min(6 , {"message":"minimum 6 characters are requried"}).max(100 , {"message":"maximum 100 characters are allowed"}),
    name: z.string().min(4,{"message":"minimum 4 characters"}).max(100 , {"message":"maximum 100 characters are allowed"}),
});

export const SignupInputValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = SignupInputSchema.safeParse(req.body);
        if(validatedData.success){
            next();
        }
        if(validatedData.error){
            res.status(400).json({ "error" :validatedData.error.issues[0].message})
        }
    } catch (error:any){
        res.status(400).json({ "error" : error});
    }
};