import { Types } from "mongoose";
export interface EmbeddingsInterface {
    UserObjectId: Types.ObjectId;
    title: string; 
    desc: string; 
    tags: string[]; 
    embeddingsResponse: number[]; 
}

export interface EmbeddingInputInterface {
    MemoryObjectId: Types.ObjectId;
    title : string,
    desc : string,
    tags : string[]
}