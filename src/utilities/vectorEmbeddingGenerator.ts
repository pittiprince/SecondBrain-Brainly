import { HfInference } from '@huggingface/inference';

let client: HfInference | undefined;

export const generateVectorEmbeddings = async (input: string) => {
    if (!process.env.HuggingFaceAccessKey) {
        throw new Error("HuggingFaceAccessKey is not configured");
    }
    client = client ?? new HfInference(process.env.HuggingFaceAccessKey);
    return client.featureExtraction({
        model: "sentence-transformers/distilbert-base-nli-mean-tokens",
        inputs: input,
    });
};
