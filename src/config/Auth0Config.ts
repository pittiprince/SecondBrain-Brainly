import dotenv from 'dotenv';
dotenv.config();
import { googleConfig } from '../interface/googlesignupInterface';
export const config:googleConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.secret,
    baseURL: process.env.baseURL,
    clientID: process.env.clientID,
    issuerBaseURL: process.env.issuerBaseURL
  };
  