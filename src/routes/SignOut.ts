import { Router } from "express";
import { GoogleLogoutHandler } from "../utilities/GoogleLogoutHandler";
import { SignOut } from "../controllers/SignOut";
export const SignOutRouter = Router()

SignOutRouter.get('/google-logout',GoogleLogoutHandler)
SignOutRouter.post('/signout',SignOut)