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
exports.SearchEmbeddingValidation = void 0;
const zod_1 = require("zod");
//zod schmea
const SearchEmbeddingValidationSchema = zod_1.z.object({
    UserObjectId: zod_1.z.string(),
    keyword: zod_1.z.string().min(3, { "message": "Minimum 3 characters" })
});
const SearchEmbeddingValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isParsedTrue = SearchEmbeddingValidationSchema.safeParse(req.body);
    try {
        if (isParsedTrue.success) {
            next();
        }
        if (isParsedTrue.error) {
            res.status(400).json({ "message": isParsedTrue.error.message });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ "error message": err });
    }
});
exports.SearchEmbeddingValidation = SearchEmbeddingValidation;
