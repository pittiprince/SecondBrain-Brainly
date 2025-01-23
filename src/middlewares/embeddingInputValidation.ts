import e, { Request , Response , NextFunction} from "express";
import {z} from "zod"

//zod schema
const EmbeddingSchema = z.object({
    MemoryObjectId:z.string(),
    title: z.string().min(3, { message: "Title must be at least 3 characters long." }).max(50, { message: "Title must be at most 50 characters long." }),
    desc: z.string().min(10, { message: "Description must be at least 10 characters long." }).max(300, { message: "Description must be at most 300 characters long." }),
    tags: z.array(z.string()).min(1, { message: "At least one tag is required." }).max(10, { message: "You can specify up to 10 tags." }),
});



export const EmbeddingInputValidation = async (req:Request , res:Response , next :NextFunction)=>{
    const Isparsingtrue = EmbeddingSchema.safeParse(req.body)
    try{
        if(Isparsingtrue.success){
            next()
        }if(Isparsingtrue.error){
            res.status(400).json({"error":Isparsingtrue.error.message})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({"Error Message":err})
    }
}