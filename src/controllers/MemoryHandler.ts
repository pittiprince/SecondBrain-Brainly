import { Request, Response } from "express";
import { MemoryModel } from "../models/MemoryModel";
import { console } from "inspector";
export const MemoryHandler = async (req: Request, res: Response) => {
  try {
    let memoryBody = req.body;
    if (memoryBody.type === "pdf") {
      let datawrite = await MemoryModel.create({
        UserObjectId: memoryBody.UserObjectId,
        type: memoryBody.type,
        link: memoryBody.link,
        title: memoryBody.title,
        desc: memoryBody.desc,
        tags: memoryBody.tags

      })
      datawrite.save()
      res.status(200).json({ "message": "Succesfully added the document", "MemoryObjectId": datawrite._id })
    }
    if (memoryBody.type === "tweet") {
      let dataWrite = await MemoryModel.create({
        UserObjectId: memoryBody.UserObjectId,
        type: memoryBody.type,
        link: memoryBody.link,
        title: memoryBody.title,
        desc: memoryBody.desc,
        tags: memoryBody.tags
      })
      dataWrite.save()
      res.status(200).json({ "message": "Succesfully added the tweet", "MemoryObjectId": dataWrite._id })
    }
    if (memoryBody.type === "YoutubeLink") {
      let dataWrite = await MemoryModel.create({
        UserObjectId: memoryBody.UserObjectId,
        type: memoryBody.type,
        link: memoryBody.link,
        title: memoryBody.title,
        desc: memoryBody.desc,
        tags: memoryBody.tags
      })
      dataWrite.save()
      res.status(200).json({ "message": "Succesfully added the Youtube link", "MemoryObjectId": dataWrite._id })
    }
    if (memoryBody.type === "link") {
      let dataWrite = await MemoryModel.create({
        UserObjectId: memoryBody.UserObjectId,
        type: memoryBody.type,
        link: memoryBody.link,
        title: memoryBody.title,
        desc: memoryBody.desc,
        tags: memoryBody.tags
      })
      dataWrite.save()
      res.status(200).json({ "message": "Succesfully added the link", "MemoryObjectId": dataWrite._id })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
}


//response with data to generate embeddings
export const GetDataForEmbeddings = async (req: Request, res: Response) => {
  try {
    const { id } = req.body
    if (!id) {
      res.status(400).json({ message: "invalid MemoryObjectId" });
    }
    let result = await MemoryModel.find({ _id: id })
    if (!result) {
      res.status(400).json({ message: "invalid MemoryObjectId" });
    }
    let TitleTagsDesc = result.map(val => ({
      title: val.title,
      desc: val.desc,
      tags: val.tags
    }))
    res.status(200).send(TitleTagsDesc)

  } catch (err) {
    console.error("Error fetching memory:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


//response with all the memories of the user based on the userId
export const GetMemoryHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.body
    if (!id) {
      res.status(400).json({ "message": "send valid memoryObjectId" })
    }
    let result = await MemoryModel.find({ UserObjectId: id })
    let resultData = result.map(val => ({
      type: val.type,
      link: val.link,
      title: val.title,
      desc: val.desc,
      tags: val.tags
    }))
    res.status(200).send(resultData)

  } catch (err) {
    console.error("Error fetching memory:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}


//responese with updating of memory based on respective user and respective MemoryID
export const updateMemoryHandler = async (req: Request, res: Response) => {
  try {
    const { ObjectId } = req.body
    let isUpdated;
    let result = await MemoryModel.find({ _id: ObjectId })
    if (result) {
      isUpdated = await MemoryModel.updateOne({
        link: req.body.link,
        title: req.body.title,
        desc: req.body.desc,
        tags: req.body.tags
      })
    }
    res.status(200).json({ "message": "updated sucessfully", "Updated Result": isUpdated, "memoryObjectId": req.body.MemoryObjectId })
  } catch (err) {
    console.error("Error fetching memory:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}


//response with deleting of memory based on respective user and respective MemoryId
export const DeleteMemoryHandler = async (req: Request, res: Response) => {
  try {
    const { MemoryObjectId } = req.body
    if (!MemoryObjectId) {
      res.status(400).json({ "message": "send valid memoryObjectId" })
    }
    let isFound = await MemoryModel.findOne({ _id: MemoryObjectId })
    if (isFound) {
      let result = await MemoryModel.deleteOne({ _id: MemoryObjectId })
      res.send(result)
    } else {
      res.status(400).json({ "message": "memory does not exist to delete" })
    }

  } catch (err) {
    console.error("Error fetching memory:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}
