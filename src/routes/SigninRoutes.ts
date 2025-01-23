import { Router } from "express";
export const SignInRouter = Router();
import { SignInInputValidationMiddleware } from "../middlewares/SignInInputValidation";
import { SignINHandler } from "../controllers/SignINHandler";
import { GoogleHandler } from "../utilities/GoogleHandler";

SignInRouter.post('/signin',SignInInputValidationMiddleware , SignINHandler)
SignInRouter.get('/google-signin',GoogleHandler )
