"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const verifyJwtMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Bearer <token>
        if (!token) {
            return res.redirect("/login");
        }
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET_KEY is not defined");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next handler
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return res.redirect("/login");
    }
};
exports.default = verifyJwtMiddleware;
