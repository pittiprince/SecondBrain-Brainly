"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
//create a multer Storage
const tempStorage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, 'src/uploads');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + "--" + file.originalname);
    }
});
exports.upload = (0, multer_1.default)({ storage: tempStorage });
