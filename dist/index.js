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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
const SignupRoutes_1 = __importDefault(require("./routes/SignupRoutes"));
const dBConnection_1 = require("./config/dBConnection");
const express_openid_connect_1 = require("express-openid-connect");
const Auth0Config_1 = require("./config/Auth0Config");
const SigninRoutes_1 = require("./routes/SigninRoutes");
const MemoryRoutes_1 = require("./routes/MemoryRoutes");
const fileUpload_1 = require("./routes/fileUpload");
const generateEmbeddingsRoutes_1 = require("./routes/generateEmbeddingsRoutes");
const SignOut_1 = require("./routes/SignOut");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_openid_connect_1.auth)(Auth0Config_1.config));
app.use((0, cors_1.default)());
app.use('/api', SignupRoutes_1.default);
app.use('/api', SigninRoutes_1.SignInRouter);
app.use('/api', MemoryRoutes_1.MemoryRouter);
app.use('/api', fileUpload_1.FileUploadRouter);
app.use('/api', generateEmbeddingsRoutes_1.generateEmbeddings);
app.use('/api', SignOut_1.SignOutRouter);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dBConnection_1.connectDb)();
    console.log(`Server is running on PORT ${PORT}`);
}));
