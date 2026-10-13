import { Router } from "express";
import { UserSignupHandler } from "../controllers/UserSignupHandler";
import { SignupInputValidation } from "../middlewares/SignupInputValidation";
import { GoogleHandler } from "../utilities/GoogleHandler";
import { googleUserDetails } from "../controllers/googleUserDetails";
import { asyncHandler } from "../utilities/asyncHandler";
const UserSignupRouter = Router();

UserSignupRouter.post('/signup', SignupInputValidation, asyncHandler(UserSignupHandler));
UserSignupRouter.get('/google-signup', asyncHandler(GoogleHandler));
UserSignupRouter.get('/user-details', asyncHandler(googleUserDetails));

export default UserSignupRouter;
