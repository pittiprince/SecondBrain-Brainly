import { z } from "zod";
import { validate } from "./validate";

// the user comes from the token; the old UserObjectId body field is ignored
const SearchEmbeddingValidationSchema = z.object({
    keyword: z.string().trim().min(3, { message: "Minimum 3 characters" }).max(100, { message: "Maximum 100 characters" }),
});

export const SearchEmbeddingValidation = validate(SearchEmbeddingValidationSchema);
