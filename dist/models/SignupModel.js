"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupModel = void 0;
const mongoose_1 = require("mongoose");
//schema
const Signup = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, maxlength: 100 },
    SecretKey: { type: String, required: false },
}, {
    timestamps: true
});
//model
exports.SignupModel = (0, mongoose_1.model)("Signup", Signup);
