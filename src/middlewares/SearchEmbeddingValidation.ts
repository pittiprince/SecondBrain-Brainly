import { Request,Response,NextFunction } from "express";
import {z} from "zod"

//zod schmea
const SearchEmbeddingValidationSchema = z.object({
    UserObjectId:z.string(),
    keyword:z.string().min(3,{"message":"Minimum 3 characters"})
})

export const SearchEmbeddingValidation = async(req:Request,res:Response , next:NextFunction)=>{
    const isParsedTrue = SearchEmbeddingValidationSchema.safeParse(req.body)
    try{
        if(isParsedTrue.success){
            next()
        }
        if(isParsedTrue.error){
            res.status(400).json({"message":isParsedTrue.error.message})
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json({"error message" :err})
    }
}
