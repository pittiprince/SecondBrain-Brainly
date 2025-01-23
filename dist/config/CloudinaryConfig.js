"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: "dbuxtztlx",
    api_key: '923938359964551',
    api_secret: "nxQdoV3zy8K6rDOEoM3fyZal1kY"
});
exports.default = cloudinary_1.v2;
