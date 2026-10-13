import { Request, Response } from "express";
import { MemoryModel } from "../models/MemoryModel";
import { deriveImage } from "../utilities/thumbnail";

const publicView = (m: any) => ({
  MemoryObjectId: m._id,
  type: m.type,
  link: m.link,
  title: m.title,
  desc: m.desc,
  image: m.image,
  tags: m.tags,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

// Create a memory for the signed-in user (the owner always comes from the token).
export const MemoryHandler = async (req: Request, res: Response) => {
  const { type, link, title, desc, tags, image } = req.body;
  const created = await MemoryModel.create({ UserObjectId: req.user!.id, type, link, title, desc, tags, image: image ?? deriveImage(type, link) });
  res.status(201).json({ message: "Successfully added the memory", MemoryObjectId: created._id });
};

// Data needed to generate embeddings for one of the user's memories (?id=<MemoryObjectId>).
export const GetDataForEmbeddings = async (req: Request, res: Response) => {
  const id = String(req.query.id ?? "");
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(400).json({ message: "invalid MemoryObjectId" });
    return;
  }
  const memory = await MemoryModel.findOne({ _id: id, UserObjectId: req.user!.id });
  if (!memory) {
    res.status(404).json({ message: "memory not found" });
    return;
  }
  res.status(200).json([{ title: memory.title, desc: memory.desc, tags: memory.tags }]);
};

// All memories of the signed-in user, newest first. Optional ?type= filter.
export const GetMemoryHandler = async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { UserObjectId: req.user!.id };
  if (typeof req.query.type === "string") filter.type = req.query.type;
  const result = await MemoryModel.find(filter).sort({ createdAt: -1 });
  res.status(200).json(result.map(publicView));
};

// Update one of the user's own memories.
export const updateMemoryHandler = async (req: Request, res: Response) => {
  const { MemoryObjectId, ...changes } = req.body;
  if (changes.image === undefined && changes.link && changes.type) changes.image = deriveImage(changes.type, changes.link);
  const updated = await MemoryModel.findOneAndUpdate(
    { _id: MemoryObjectId, UserObjectId: req.user!.id },
    { $set: changes },
    { new: true, runValidators: true }
  );
  if (!updated) {
    res.status(404).json({ message: "memory not found" });
    return;
  }
  res.status(200).json({ message: "updated successfully", memoryObjectId: updated._id, memory: publicView(updated) });
};

// Delete one of the user's own memories.
export const DeleteMemoryHandler = async (req: Request, res: Response) => {
  const result = await MemoryModel.deleteOne({ _id: req.body.MemoryObjectId, UserObjectId: req.user!.id });
  if (result.deletedCount === 0) {
    res.status(404).json({ message: "memory does not exist to delete" });
    return;
  }
  res.status(200).json({ message: "deleted successfully" });
};
