import { Request, Response } from 'express';

export const GoogleLogoutHandler = async (_: Request, res: Response) => {
    if (!res.oidc) {
        res.status(503).json({ message: "Google sign-in is not configured" });
        return;
    }
    await res.oidc.logout({ returnTo: process.env.FRONTEND_URL || '/' });
};
