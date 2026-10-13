import { Request, Response } from 'express';

export const GoogleHandler = async (req: Request, res: Response) => {
    if (!res.oidc) {
        res.status(503).json({ message: "Google sign-in is not configured" });
        return;
    }
    await res.oidc.login({
        returnTo: '/api/user-details',
        authorizationParams: { connection: 'google-oauth2' },
    });
};
