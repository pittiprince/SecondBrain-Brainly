import z from 'zod';
import { validate } from './validate';

export const SignupInputSchema = z.object({
    email: z.string().trim().toLowerCase().email({ message: "Enter a valid email address" }),
    password: z.string().min(8, { message: "minimum 8 characters are required" }).max(72, { message: "maximum 72 characters are allowed" }),
    name: z.string().trim().min(2, { message: "minimum 2 characters" }).max(100, { message: "maximum 100 characters are allowed" }),
});

export const SignupInputValidation = validate(SignupInputSchema);
