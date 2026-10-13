import { z } from "zod";
import { validate } from "./validate";

// title/desc/tags are read from the stored memory, so only its id is needed (other fields sent by old clients are ignored)
const EmbeddingSchema = z.object({
    MemoryObjectId: z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid Memory ObjectID" }),
});

export const EmbeddingInputValidation = validate(EmbeddingSchema);
