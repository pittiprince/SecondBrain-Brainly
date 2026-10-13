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
export const searchEmbeddingKeywordHandler = async (req: Request, res: Response) => {
   const { keyword } = req.body;
   const userId = req.user!.id;
   let found: any[];
   try {
      // Atlas Search (needs the "query_search" index on the Memory collection)
      const { Types } = await import("mongoose");
      found = await MemoryModel.aggregate([
         { $search: { index: "query_search", text: { query: keyword, path: { wildcard: "*" } } } },
         { $match: { UserObjectId: new Types.ObjectId(userId) } },
         { $limit: 50 },
         { $project: { embedding_Vectors: 0 } },
      ]);
   } catch (err: any) {
      // no Atlas Search index (local MongoDB, index still building): fall back to a plain regex match
      console.warn("Atlas Search unavailable, using regex fallback:", err?.message);
      const rx = new RegExp(escapeRegex(keyword), "i");
      found = await MemoryModel.find({
         UserObjectId: userId,
         $or: [{ title: rx }, { desc: rx }, { tags: rx }],
      }).limit(50);
   }
   res.status(200).json({
      results: found.map((x) => x._id),
      memories: found.map((m) => ({ MemoryObjectId: m._id, type: m.type, link: m.link, title: m.title, desc: m.desc, tags: m.tags })),
   });
};
