"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthModel = void 0;
const mongoose_1 = require("mongoose");
//schema
const GoogleAuthSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, required: true },
    SecretKey: { type: String, required: true },
}, {
    timestamps: true
});
//model
exports.GoogleAuthModel = (0, mongoose_1.model)("GoogleAuth", GoogleAuthSchema);
