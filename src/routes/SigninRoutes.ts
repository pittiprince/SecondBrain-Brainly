import { Router } from "express";
export const SignInRouter = Router();
import { SignInInputValidationMiddleware } from "../middlewares/SignInInputValidation";
import { SignINHandler } from "../controllers/SignINHandler";
import { GoogleHandler } from "../utilities/GoogleHandler";
import { asyncHandler } from "../utilities/asyncHandler";

SignInRouter.post('/signin', SignInInputValidationMiddleware, asyncHandler(SignINHandler))
SignInRouter.get('/google-signin', asyncHandler(GoogleHandler))
