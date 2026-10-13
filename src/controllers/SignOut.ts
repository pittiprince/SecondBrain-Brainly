import { Request, Response } from "express";

// Tokens are stateless JWTs: signing out means the client discards its token (they expire by themselves).
export const SignOut = (_req: Request, res: Response) => {
    res.status(200).json({ message: "Signed out successfully" });
};
