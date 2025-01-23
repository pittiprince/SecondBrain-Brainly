import { Request, Response } from "express";
import { generateVectorEmbeddings } from "../utilities/vectorEmbeddingGenerator";
import { EmbeddingInputInterface } from '../interface/embeddings'
import { MemoryModel } from '../models/MemoryModel'

export const generateEmbeddingsHuggingFace = async (req: Request, res: Response) => {
   let inputObject: EmbeddingInputInterface = req.body
   let { MemoryObjectId } = req.body
   let combinedInputString = `${inputObject.title}. ${inputObject.desc} Tags: ${inputObject.tags.join(',')}`
   let result = await generateVectorEmbeddings(combinedInputString)
   if (result) {
      await MemoryModel.updateOne({ _id: MemoryObjectId }, { embedding_Vectors: result }).then(() => {
         res.status(200).json({ "message": "Successfully embeddings saved into db", "embeddings": result })
      }).catch((err) => {
         res.status(500).json({ "Message": "internal server error", "Error": err })
      })
   }
}

// search embedding keyword handler
export const searchEmbeddingKeywordHandler = async (req: Request, res: Response) => {
   try {
      const { keyword } = req.body;
      const similarityResponse = await MemoryModel.aggregate([
         {
           $search: {
             index: "query_search",
             text: {
               query: keyword,
               path: {
                 wildcard: "*",
               },
             },
           },
         },
       ])
       let optimized = similarityResponse.map(x=>x._id)
       console.log(similarityResponse.map(x=>x.title))
      res.status(200).json({"results":optimized})
   } catch (err) {
      console.log(err)
      res.status(500).json({ "Errror Message": err })
   }
}






