import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

// Validates req.body, replaces it with the parsed data (unknown fields are stripped) and always returns after responding.
export const validate = (schema: ZodTypeAny): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body ?? {});
        if (!parsed.success) {
            res.status(400).json({
                message: parsed.error.issues[0].message,
                errors: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
            });
            return;
        }
        req.body = parsed.data;
        next();
    };
