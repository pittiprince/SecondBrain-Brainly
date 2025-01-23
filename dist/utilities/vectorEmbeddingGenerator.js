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
exports.generateVectorEmbeddings = void 0;
const inference_1 = require("@huggingface/inference");
const Accesskey = process.env.HuggingFaceAccessKey;
const hf = new inference_1.HfInference(Accesskey);
const generateVectorEmbeddings = (input) => __awaiter(void 0, void 0, void 0, function* () {
    let Response = yield hf.featureExtraction({
        model: "sentence-transformers/distilbert-base-nli-mean-tokens",
        inputs: input
    });
    return Response;
});
exports.generateVectorEmbeddings = generateVectorEmbeddings;
