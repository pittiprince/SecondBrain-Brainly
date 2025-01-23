import { Request, Response } from 'express';

export const GoogleHandler = async (req: Request, res: Response) => {
    try{
       res.oidc.login({
        //shud be redirected to main page after login
        returnTo:'/api/user-details',
        authorizationParams:{
            connection: 'google-oauth2',
        }
       })
    }catch(err){
        console.log(err);
    }
}


