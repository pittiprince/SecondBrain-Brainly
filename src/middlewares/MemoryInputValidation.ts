import { Request, Response, NextFunction } from "express";
import z from 'zod';

const MemoryInputValidation = z.object({
    UserObjectId: z.string(),
    type: z.enum(["pdf", "tweet", "YoutubeLink", "link"], { message: "Invalid type" }),
    link: z.string().url({ message: "Invalid URL" }),
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }).max(50, { message: "Title must be at most 50 characters long" }),
    desc: z.string().min(10, { "message": "Minimum Desc should be provided of 10 characters" }).max(300, { "message": "Maximum desc should be provided upto 300 charcaters" }),
    tags: z.array(z.string()).max(10, { message: "Maximum 10 tags allowed" }),

});

export const MemoryInputValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const memoryBody = MemoryInputValidation.safeParse(req.body);
        if (memoryBody.success) {
            next();
        }
        if (memoryBody.error) {
            res.status(400).json({ message: memoryBody.error.issues.map(x => ({ path: x.path, message: x.message })) });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}


const MemoryupdateInputValidation = z.object({
    MemoryObjectId: z.string().optional(),
    type: z.enum(["document", "tweet", "YoutubeLink", "link"], { message: "Invalid type" }).optional(),
    link: z.string().url({ message: "Invalid URL" }).optional(),
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }).max(50, { message: "Title must be at most 50 characters long" }).optional(),
    desc: z.string().min(10, { "message": "Minimum Desc should be provided of 10 characters" }).max(300, { "message": "Maximum desc should be provided upto 300 charcaters" }).optional(),
    tags: z.array(z.string()).max(10, { message: "Maximum 10 tags allowed" }).optional(),
});

export const MemoryInputUpdateValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const memoryBody = MemoryupdateInputValidation.safeParse(req.body);
        if (memoryBody.success) {
            next();
        }
        if (memoryBody.error) {
            res.status(400).json({ message: memoryBody.error.errors[0].message });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}


const DeleteMemoryInputValidation = z.object({
    MemoryObjectId: z.string({ "message": "Give valid Memory ObjectID" })
})

export const DeleteInputValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let parsedData = DeleteMemoryInputValidation.safeParse(req.body)
        if (parsedData.success) {
            next()
        }
        if (parsedData.error) {
            res.status(400).json({ "Error": parsedData.error.message.toString() })
        }
    } catch (err) {
        console.log(err)
        res.send(500).json({ "Error Message": err })
    }
}