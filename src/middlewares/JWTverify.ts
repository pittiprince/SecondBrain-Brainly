import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY

interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string; // Add user info to the request object if needed
}

const verifyJwtMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
        if (!token) {
            return res.redirect("/login");
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET_KEY is not defined");
        }
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next handler
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.redirect("/login");
    }
};

export default verifyJwtMiddleware;
