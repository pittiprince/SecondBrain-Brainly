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
exports.UserSignupHandler = void 0;
const SignupModel_1 = require("../models/SignupModel");
const passwordHasing_1 = require("../utilities/passwordHasing");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSignupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSignupDetails = req.body;
        const existingUser = yield SignupModel_1.SignupModel.findOne({ email: userSignupDetails.email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with the same email" });
            return;
        }
        const hashedPassword = yield (0, passwordHasing_1.passwordHashing)(userSignupDetails.password);
        const newUser = new SignupModel_1.SignupModel({
            name: userSignupDetails.name,
            email: userSignupDetails.email,
            password: hashedPassword
        });
        const jwtToken = jsonwebtoken_1.default.sign({ email: userSignupDetails.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        newUser.SecretKey = jwtToken;
        yield newUser.save();
        res.status(201).json({ message: "User Signed Up Successfully", jwtKey: jwtToken });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});
exports.UserSignupHandler = UserSignupHandler;
