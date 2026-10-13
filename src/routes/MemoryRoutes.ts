import { Router } from "express";
export const MemoryRouter = Router();
import { DeleteInputValidationMiddleware, MemoryInputUpdateValidationMiddleware, MemoryInputValidationMiddleware } from "../middlewares/MemoryInputValidation";
import { GetDataForEmbeddings, MemoryHandler, GetMemoryHandler, updateMemoryHandler, DeleteMemoryHandler } from "../controllers/MemoryHandler";
import verifyJwtMiddleware from "../middlewares/JWTverify";
import { asyncHandler } from "../utilities/asyncHandler";

// every route authenticates first, then validates; the owner always comes from the token
MemoryRouter.post('/memory-post', verifyJwtMiddleware, MemoryInputValidationMiddleware, asyncHandler(MemoryHandler))
MemoryRouter.get('/memory-getData', verifyJwtMiddleware, asyncHandler(GetDataForEmbeddings))
MemoryRouter.get('/memory-get', verifyJwtMiddleware, asyncHandler(GetMemoryHandler))
MemoryRouter.post('/memory-update', verifyJwtMiddleware, MemoryInputUpdateValidationMiddleware, asyncHandler(updateMemoryHandler))
MemoryRouter.post('/memory-delete', verifyJwtMiddleware, DeleteInputValidationMiddleware, asyncHandler(DeleteMemoryHandler))
