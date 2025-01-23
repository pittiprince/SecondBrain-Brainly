import { Router } from "express";
export const MemoryRouter = Router();
import { DeleteInputValidationMiddleware, MemoryInputUpdateValidationMiddleware, MemoryInputValidationMiddleware } from "../middlewares/MemoryInputValidation";
import { GetDataForEmbeddings, MemoryHandler, GetMemoryHandler, updateMemoryHandler, DeleteMemoryHandler } from "../controllers/MemoryHandler";
import verifyJwtMiddleware from "../middlewares/JWTverify";

MemoryRouter.post('/memory-post', MemoryInputValidationMiddleware, verifyJwtMiddleware, MemoryHandler)  // To post [Create] a Memory.
MemoryRouter.get('/memory-getData', verifyJwtMiddleware, GetDataForEmbeddings) // To Get Req data for embeddings - respective user
MemoryRouter.get('/memory-get', verifyJwtMiddleware, GetMemoryHandler) // To get All the memory of the respected user
MemoryRouter.post('/memory-update', verifyJwtMiddleware, MemoryInputUpdateValidationMiddleware, updateMemoryHandler) // updates the existing memory based on UserId and MemoryObjectId
MemoryRouter.post('/memory-delete', verifyJwtMiddleware, DeleteInputValidationMiddleware, DeleteMemoryHandler)// // Delete the existing memory based on UserId and MemoryObjectId
