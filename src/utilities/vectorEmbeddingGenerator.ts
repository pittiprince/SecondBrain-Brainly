import { HfInference } from '@huggingface/inference'

const Accesskey = process.env.HuggingFaceAccessKey
const hf = new HfInference(Accesskey)

export const generateVectorEmbeddings = async(input:any )=>{
 
    let Response  = await hf.featureExtraction({
        model: "sentence-transformers/distilbert-base-nli-mean-tokens",
        inputs: input
      });
      return Response
}