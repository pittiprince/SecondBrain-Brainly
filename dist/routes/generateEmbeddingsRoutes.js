"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbeddings = void 0;
const express_1 = require("express");
const generateEmbeddingsHandler_1 = require("../controllers/generateEmbeddingsHandler");
const embeddingInputValidation_1 = require("../middlewares/embeddingInputValidation");
const SearchEmbeddingValidation_1 = require("../middlewares/SearchEmbeddingValidation");
const JWTverify_1 = __importDefault(require("../middlewares/JWTverify"));
exports.generateEmbeddings = (0, express_1.Router)();
exports.generateEmbeddings.post('/generate-embeddings', JWTverify_1.default, embeddingInputValidation_1.EmbeddingInputValidation, generateEmbeddingsHandler_1.generateEmbeddingsHuggingFace);
exports.generateEmbeddings.post('/generate-Search-embedding', JWTverify_1.default, SearchEmbeddingValidation_1.SearchEmbeddingValidation, generateEmbeddingsHandler_1.searchEmbeddingKeywordHandler);
