import { Router } from "express";
import { GoogleLogoutHandler } from "../utilities/GoogleLogoutHandler";
import { SignOut } from "../controllers/SignOut";
import { asyncHandler } from "../utilities/asyncHandler";
export const SignOutRouter = Router()

SignOutRouter.get('/google-logout', asyncHandler(GoogleLogoutHandler))
SignOutRouter.post('/signout', SignOut)
