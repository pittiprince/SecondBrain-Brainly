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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingInputValidation = void 0;
const zod_1 = require("zod");
//zod schema
const EmbeddingSchema = zod_1.z.object({
    MemoryObjectId: zod_1.z.string(),
    title: zod_1.z.string().min(3, { message: "Title must be at least 3 characters long." }).max(50, { message: "Title must be at most 50 characters long." }),
    desc: zod_1.z.string().min(10, { message: "Description must be at least 10 characters long." }).max(300, { message: "Description must be at most 300 characters long." }),
    tags: zod_1.z.array(zod_1.z.string()).min(1, { message: "At least one tag is required." }).max(10, { message: "You can specify up to 10 tags." }),
});
const EmbeddingInputValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Isparsingtrue = EmbeddingSchema.safeParse(req.body);
    try {
        if (Isparsingtrue.success) {
            next();
        }
        if (Isparsingtrue.error) {
            res.status(400).json({ "error": Isparsingtrue.error.message });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ "Error Message": err });
    }
});
exports.EmbeddingInputValidation = EmbeddingInputValidation;
