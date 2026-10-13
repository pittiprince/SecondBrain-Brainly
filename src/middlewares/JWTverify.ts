import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Reads "Authorization: Bearer <token>", verifies it and exposes req.user = { id, email }.
const verifyJwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        res.status(500).json({ message: "Server is not configured" });
        return;
    }
    const header = req.headers.authorization;
    const token = header && header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }
    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        if (typeof decoded.id !== "string" || typeof decoded.email !== "string") {
            // tokens issued by the old version carried only the email: ask the user to sign in again
            res.status(401).json({ message: "Session expired, please sign in again" });
            return;
        }
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default verifyJwtMiddleware;
