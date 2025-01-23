import { Router } from "express";
import { UserSignupHandler } from "../controllers/UserSignupHandler";
import { SignupInputValidation } from "../middlewares/SignupInputValidation";
import { GoogleHandler } from "../utilities/GoogleHandler";
import { googleUserDetails } from "../controllers/googleUserDetails";
const UserSignupRouter = Router();

UserSignupRouter.post('/signup',SignupInputValidation,UserSignupHandler);
UserSignupRouter.get('/google-signup',GoogleHandler);
UserSignupRouter.get('/user-details' , googleUserDetails);


export default UserSignupRouter;