import z from 'zod';
import { validate } from './validate';

export const SignInSchema = z.object({
    email: z.string().trim().toLowerCase().email({ message: "Invalid email address" }),
    // no minimum here: accounts created earlier may have shorter passwords
    password: z.string().min(1, { message: "Password is required" }).max(72, { message: "Password must be at most 72 characters long" }),
});

export const SignInInputValidationMiddleware = validate(SignInSchema);
