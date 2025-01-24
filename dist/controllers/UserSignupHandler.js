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
        let userSignupDetails = req.body;
        let isUserTrue = yield SignupModel_1.SignupModel.findOne({ email: userSignupDetails.email });
        if (isUserTrue) {
            res.status(400).json({ "message:": "User already exist with the same email" });
        }
        const hashedPassword = yield (0, passwordHasing_1.passwordHashing)(userSignupDetails.password);
        let dbwrite = yield SignupModel_1.SignupModel.create({
            name: userSignupDetails.name,
            email: userSignupDetails.email,
            password: hashedPassword
        });
        let JWT = jsonwebtoken_1.default.sign({ email: userSignupDetails.email }, process.env.JWT_SECRET_KEY);
        yield dbwrite.updateOne({ SecretKey: JWT });
        dbwrite.save();
        res.status(200).json({ message: "User Signed Up Successfully", jwtKey: JWT });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.UserSignupHandler = UserSignupHandler;
