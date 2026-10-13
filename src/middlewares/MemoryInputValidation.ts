import z from 'zod';
import { validate } from './validate';

const objectId = z.string({ message: "Give valid Memory ObjectID" }).regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid Memory ObjectID" });
const type = z.enum(["pdf", "tweet", "YoutubeLink", "link"], { message: "Invalid type" });
const link = z.string().url({ message: "Invalid URL" });
const title = z.string().trim().min(3, { message: "Title must be at least 3 characters long" }).max(50, { message: "Title must be at most 50 characters long" });
const desc = z.string().trim().min(10, { message: "Minimum Desc should be provided of 10 characters" }).max(300, { message: "Maximum desc should be provided upto 300 charcaters" });
const image = z.string().url({ message: "Invalid image URL" }).max(500);
const tags = z.array(z.string().trim().min(1).max(30)).max(10, { message: "Maximum 10 tags allowed" });

// the owner is taken from the token, never from the body
export const MemoryCreateSchema = z.object({ type, link, title, desc, image: image.optional(), tags: tags.default([]) });

export const MemoryUpdateSchema = z
    .object({ MemoryObjectId: objectId, type: type.optional(), link: link.optional(), title: title.optional(), desc: desc.optional(), image: image.optional(), tags: tags.optional() })
    .refine((v) => Object.keys(v).some((k) => k !== "MemoryObjectId" && v[k as keyof typeof v] !== undefined), { message: "Nothing to update" });

export const MemoryDeleteSchema = z.object({ MemoryObjectId: objectId });

export const MemoryInputValidationMiddleware = validate(MemoryCreateSchema);
export const MemoryInputUpdateValidationMiddleware = validate(MemoryUpdateSchema);
export const DeleteInputValidationMiddleware = validate(MemoryDeleteSchema);
