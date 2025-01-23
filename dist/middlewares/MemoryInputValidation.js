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
exports.DeleteInputValidationMiddleware = exports.MemoryInputUpdateValidationMiddleware = exports.MemoryInputValidationMiddleware = void 0;
const zod_1 = __importDefault(require("zod"));
const MemoryInputValidation = zod_1.default.object({
    UserObjectId: zod_1.default.string(),
    type: zod_1.default.enum(["pdf", "tweet", "YoutubeLink", "link"], { message: "Invalid type" }),
    link: zod_1.default.string().url({ message: "Invalid URL" }),
    title: zod_1.default.string().min(3, { message: "Title must be at least 3 characters long" }).max(50, { message: "Title must be at most 50 characters long" }),
    desc: zod_1.default.string().min(10, { "message": "Minimum Desc should be provided of 10 characters" }).max(300, { "message": "Maximum desc should be provided upto 300 charcaters" }),
    tags: zod_1.default.array(zod_1.default.string()).max(10, { message: "Maximum 10 tags allowed" }),
});
const MemoryInputValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memoryBody = MemoryInputValidation.safeParse(req.body);
        if (memoryBody.success) {
            next();
        }
        if (memoryBody.error) {
            res.status(400).json({ message: memoryBody.error.issues.map(x => ({ path: x.path, message: x.message })) });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
});
exports.MemoryInputValidationMiddleware = MemoryInputValidationMiddleware;
const MemoryupdateInputValidation = zod_1.default.object({
    MemoryObjectId: zod_1.default.string().optional(),
    type: zod_1.default.enum(["document", "tweet", "YoutubeLink", "link"], { message: "Invalid type" }).optional(),
    link: zod_1.default.string().url({ message: "Invalid URL" }).optional(),
    title: zod_1.default.string().min(3, { message: "Title must be at least 3 characters long" }).max(50, { message: "Title must be at most 50 characters long" }).optional(),
    desc: zod_1.default.string().min(10, { "message": "Minimum Desc should be provided of 10 characters" }).max(300, { "message": "Maximum desc should be provided upto 300 charcaters" }).optional(),
    tags: zod_1.default.array(zod_1.default.string()).max(10, { message: "Maximum 10 tags allowed" }).optional(),
});
const MemoryInputUpdateValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memoryBody = MemoryupdateInputValidation.safeParse(req.body);
        if (memoryBody.success) {
            next();
        }
        if (memoryBody.error) {
            res.status(400).json({ message: memoryBody.error.errors[0].message });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
});
exports.MemoryInputUpdateValidationMiddleware = MemoryInputUpdateValidationMiddleware;
const DeleteMemoryInputValidation = zod_1.default.object({
    MemoryObjectId: zod_1.default.string({ "message": "Give valid Memory ObjectID" })
});
const DeleteInputValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let parsedData = DeleteMemoryInputValidation.safeParse(req.body);
        if (parsedData.success) {
            next();
        }
        if (parsedData.error) {
            res.status(400).json({ "Error": parsedData.error.message.toString() });
        }
    }
    catch (err) {
        console.log(err);
        res.send(500).json({ "Error Message": err });
    }
});
exports.DeleteInputValidationMiddleware = DeleteInputValidationMiddleware;
