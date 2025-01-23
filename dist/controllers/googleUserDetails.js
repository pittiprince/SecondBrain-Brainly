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
exports.googleUserDetails = void 0;
const GoogleAuthModel_1 = require("../models/GoogleAuthModel");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userTure = req.oidc.isAuthenticated();
        if (userTure) {
            let user = req.oidc.user;
            if (user) {
                let userExist = yield GoogleAuthModel_1.GoogleAuthModel.findOne({ email: user.email });
                if (userExist) {
                    if (userExist.SecretKey) {
                        res.status(200).json({ message: "Verified existing user", jwtKey: userExist.SecretKey });
                    }
                    else {
                        let JWT = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_SECRET_KEY);
                        userExist.updateOne({ SecretKey: JWT });
                    }
                }
                if (!userExist) {
                    let JWT = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_SECRET_KEY);
                    let newUser = new GoogleAuthModel_1.GoogleAuthModel({
                        name: user.name,
                        email: user.email,
                        email_verified: user.email_verified,
                        SecretKey: JWT
                    });
                    yield newUser.save();
                    res.status(200).json({ message: "New User Created", jwtKey: JWT });
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.googleUserDetails = googleUserDetails;
