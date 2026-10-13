import { Request, Response } from "express";
import { generateVectorEmbeddings } from "../utilities/vectorEmbeddingGenerator";
import { MemoryModel } from "../models/MemoryModel";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const generateEmbeddingsHuggingFace = async (req: Request, res: Response) => {
   const memory = await MemoryModel.findOne({ _id: req.body.MemoryObjectId, UserObjectId: req.user!.id });
   if (!memory) {
      res.status(404).json({ message: "memory not found" });
      return;
   }
   const combinedInputString = `${memory.title}. ${memory.desc} Tags: ${memory.tags.join(",")}`;
   let embeddings;
   try {
      embeddings = await generateVectorEmbeddings(combinedInputString);
   } catch (err: any) {
      console.error("Embedding generation failed:", err?.message);
      res.status(502).json({ message: "Could not generate embeddings right now" });
      return;
   }
   await MemoryModel.updateOne({ _id: memory._id }, { $set: { embedding_Vectors: embeddings } });
   res.status(200).json({ message: "Successfully embeddings saved into db" });
};

// Keyword search over the signed-in user's own memories only.
// 1) MongoDB's built-in text index (ranked, stemmed, free); 2) partial-word regex match when that finds nothing.
export const searchEmbeddingKeywordHandler = async (req: Request, res: Response) => {
   const { keyword } = req.body;
   const userId = req.user!.id;
   const fields = { embedding_Vectors: 0 };
   let found: any[] = await MemoryModel.find({ UserObjectId: userId, $text: { $search: keyword } }, fields)
      .sort({ score: { $meta: "textScore" } } as any)
      .limit(50);
   if (found.length === 0) {
      const rx = new RegExp(escapeRegex(keyword), "i");
      found = await MemoryModel.find({
         UserObjectId: userId,
         $or: [{ title: rx }, { desc: rx }, { tags: rx }],
      }, fields).limit(50);
   }
   res.status(200).json({
      results: found.map((x) => x._id),
      memories: found.map((m) => ({ MemoryObjectId: m._id, type: m.type, link: m.link, title: m.title, desc: m.desc, tags: m.tags })),
   });
};
