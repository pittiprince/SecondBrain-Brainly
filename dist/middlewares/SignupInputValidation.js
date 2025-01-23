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
exports.SignupInputValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const SignupInputSchema = zod_1.default.object({
    email: zod_1.default.string().email({ 'message': "Enter a valid email address" }),
    password: zod_1.default.string().min(6, { "message": "minimum 6 characters are requried" }).max(100, { "message": "maximum 100 characters are allowed" }),
    name: zod_1.default.string().min(4, { "message": "minimum 4 characters" }).max(100, { "message": "maximum 100 characters are allowed" }),
});
const SignupInputValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = SignupInputSchema.safeParse(req.body);
        if (validatedData.success) {
            next();
        }
        if (validatedData.error) {
            res.status(400).json({ "error": validatedData.error.issues[0].message });
        }
    }
    catch (error) {
        res.status(400).json({ "error": error });
    }
});
exports.SignupInputValidation = SignupInputValidation;
