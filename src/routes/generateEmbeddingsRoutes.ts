import { Router } from "express";
import {  generateEmbeddingsHuggingFace, searchEmbeddingKeywordHandler } from "../controllers/generateEmbeddingsHandler";
import { EmbeddingInputValidation } from "../middlewares/embeddingInputValidation";
import { SearchEmbeddingValidation } from "../middlewares/SearchEmbeddingValidation";
import verifyJwtMiddleware from "../middlewares/JWTverify";

export const generateEmbeddings = Router();

generateEmbeddings.post('/generate-embeddings',verifyJwtMiddleware,EmbeddingInputValidation,generateEmbeddingsHuggingFace)
generateEmbeddings.post('/generate-Search-embedding',verifyJwtMiddleware,SearchEmbeddingValidation ,searchEmbeddingKeywordHandler )