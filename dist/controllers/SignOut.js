"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignOut = void 0;
const SignOut = (req, res) => {
    const tokenBlacklist = new Set();
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (token) {
        tokenBlacklist.add(token);
    }
    res.status(200).json({ message: 'Signed out successfully' });
};
exports.SignOut = SignOut;
