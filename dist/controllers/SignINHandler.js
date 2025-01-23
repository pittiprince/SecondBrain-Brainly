"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignINHandler = void 0;
const SignupModel_1 = require("../models/SignupModel");
const passwordHasing_1 = require("../utilities/passwordHasing");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SignINHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signinData = req.body;
        let data = yield SignupModel_1.SignupModel.findOne({ email: signinData.email });
        let isHashedTrue = (data === null || data === void 0 ? void 0 : data.password) ? yield (0, passwordHasing_1.passwordMatch)(signinData.password, data.password) : false;
        if (isHashedTrue) {
            if (signinData.JWT) {
                try {
                    let JWTVERIFY = jsonwebtoken_1.default.verify(signinData.JWT, process.env.JWT_SECRET_KEY);
                    if (JWTVERIFY) {
                        res.status(200).json({ message: "JWT verified, signed in successfully" });
                    }
                    else {
                        res.status(400).json({ error: "Invalid JWT" });
                    }
                }
                catch (err) {
                    res.status(400).json({ error: "JWT verification failed" });
                }
            }
            else {
                res.status(400).json({ error: "JWT not provided" });
            }
        }
        else {
            res.status(400).json({ error: "Invalid email or password" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
exports.SignINHandler = SignINHandler;
