import mongoose, { Schema } from "mongoose";
import { EmbeddingsInterface } from "../interface/embeddings";

//schema
const VectorEmbeddingsSchema = new Schema<EmbeddingsInterface>({
    UserObjectId: {type: Schema.Types.ObjectId, required: true},
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
    embeddingsResponse: { type: [Number], required: true },
})

//model 
export const embeddingsModel = mongoose.model<EmbeddingsInterface>("Embedding",VectorEmbeddingsSchema)