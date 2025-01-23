import {Schema , model, Types} from "mongoose";
import { ContentType, MemoryInterface } from "../interface/MemoryInterface";

// schema
const MemorySchema = new Schema<MemoryInterface>({
    UserObjectId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(ContentType), required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true }, 
    tags: { type: [String], required: true },
    embedding_Vectors: { type: [Number], required: false },
},
{
    timestamps: true
}
)
 // model

 export const MemoryModel = model<MemoryInterface>("Memory",MemorySchema);