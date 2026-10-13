import {Schema , model, Types} from "mongoose";
import { ContentType, MemoryInterface } from "../interface/MemoryInterface";

// schema
const MemorySchema = new Schema<MemoryInterface>({
    UserObjectId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(ContentType), required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: false },
    tags: { type: [String], required: true },
    embedding_Vectors: { type: [Number], required: false },
},
{
    timestamps: true
}
)
 MemorySchema.index({ UserObjectId: 1, createdAt: -1 });
 // built-in full-text search (free, works on Atlas M0 and any MongoDB; no external index to create)
 MemorySchema.index({ title: 'text', desc: 'text', tags: 'text' }, { weights: { title: 5, tags: 3, desc: 1 }, name: 'memory_text' });

 // model

 export const MemoryModel = model<MemoryInterface>("Memory",MemorySchema);