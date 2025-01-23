"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRouter = void 0;
const express_1 = require("express");
exports.MemoryRouter = (0, express_1.Router)();
const MemoryInputValidation_1 = require("../middlewares/MemoryInputValidation");
const MemoryHandler_1 = require("../controllers/MemoryHandler");
const JWTverify_1 = __importDefault(require("../middlewares/JWTverify"));
exports.MemoryRouter.post('/memory-post', MemoryInputValidation_1.MemoryInputValidationMiddleware, JWTverify_1.default, MemoryHandler_1.MemoryHandler); // To post [Create] a Memory.
exports.MemoryRouter.get('/memory-getData', JWTverify_1.default, MemoryHandler_1.GetDataForEmbeddings); // To Get Req data for embeddings - respective user
exports.MemoryRouter.get('/memory-get', JWTverify_1.default, MemoryHandler_1.GetMemoryHandler); // To get All the memory of the respected user
exports.MemoryRouter.post('/memory-update', JWTverify_1.default, MemoryInputValidation_1.MemoryInputUpdateValidationMiddleware, MemoryHandler_1.updateMemoryHandler); // updates the existing memory based on UserId and MemoryObjectId
exports.MemoryRouter.post('/memory-delete', JWTverify_1.default, MemoryInputValidation_1.DeleteInputValidationMiddleware, MemoryHandler_1.DeleteMemoryHandler); // // Delete the existing memory based on UserId and MemoryObjectId
