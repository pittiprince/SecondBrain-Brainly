"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadRouter = void 0;
const express_1 = require("express");
const Fileuploader_1 = require("../controllers/Fileuploader");
const JWTverify_1 = __importDefault(require("../middlewares/JWTverify"));
exports.FileUploadRouter = (0, express_1.Router)();
exports.FileUploadRouter.post('/fileUpload', JWTverify_1.default, Fileuploader_1.FileUpload);
