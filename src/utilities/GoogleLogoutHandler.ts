import { Request, Response } from 'express';
export const GoogleLogoutHandler = async (_: Request, res: Response) => {
    try{
       res.oidc.logout({
        returnTo:'/login'
       })
    }catch(err){
        console.log(err);
    }
}


