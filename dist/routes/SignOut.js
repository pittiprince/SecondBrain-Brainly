"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignOutRouter = void 0;
const express_1 = require("express");
const GoogleLogoutHandler_1 = require("../utilities/GoogleLogoutHandler");
const SignOut_1 = require("../controllers/SignOut");
exports.SignOutRouter = (0, express_1.Router)();
exports.SignOutRouter.get('/google-logout', GoogleLogoutHandler_1.GoogleLogoutHandler);
exports.SignOutRouter.post('/signout', SignOut_1.SignOut);
