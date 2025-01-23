import { Request, Response } from "express";

export const SignOut = (req: Request, res: Response) => {
    const tokenBlacklist = new Set<string>();
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (token) {
        tokenBlacklist.add(token);
    }
    res.status(200).json({ message: 'Signed out successfully' });
}