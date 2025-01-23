"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInInputValidationMiddleware = void 0;
const zod_1 = __importDefault(require("zod"));
const SignInInputValidation = zod_1.default.object({
    email: zod_1.default.string().email({ "message": "Invalid email address" }),
    password: zod_1.default.string().min(6, { "message": "Password must be at least 6 characters long" }).max(20, { "message": "Password must be at most 20 characters long" }),
    JWT: zod_1.default.string().optional()
});
const SignInInputValidationMiddleware = (req, res, next) => {
    try {
        const parsedData = SignInInputValidation.safeParse(req.body);
        if (parsedData.success) {
            next();
        }
        if (parsedData.error) {
            res.status(400).json({ error: parsedData.error.issues[0].message });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.errors });
    }
};
exports.SignInInputValidationMiddleware = SignInInputValidationMiddleware;
