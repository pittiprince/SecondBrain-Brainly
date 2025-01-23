"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEmbeddingKeywordHandler = exports.generateEmbeddingsHuggingFace = void 0;
const vectorEmbeddingGenerator_1 = require("../utilities/vectorEmbeddingGenerator");
const MemoryModel_1 = require("../models/MemoryModel");
const generateEmbeddingsHuggingFace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inputObject = req.body;
    let { MemoryObjectId } = req.body;
    let combinedInputString = `${inputObject.title}. ${inputObject.desc} Tags: ${inputObject.tags.join(',')}`;
    let result = yield (0, vectorEmbeddingGenerator_1.generateVectorEmbeddings)(combinedInputString);
    if (result) {
        yield MemoryModel_1.MemoryModel.updateOne({ _id: MemoryObjectId }, { embedding_Vectors: result }).then(() => {
            res.status(200).json({ "message": "Successfully embeddings saved into db", "embeddings": result });
        }).catch((err) => {
            res.status(500).json({ "Message": "internal server error", "Error": err });
        });
    }
});
exports.generateEmbeddingsHuggingFace = generateEmbeddingsHuggingFace;
// search embedding keyword handler
const searchEmbeddingKeywordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.body;
        const similarityResponse = yield MemoryModel_1.MemoryModel.aggregate([
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
        ]);
        let optimized = similarityResponse.map(x => x._id);
        console.log(similarityResponse.map(x => x.title));
        res.status(200).json({ "results": optimized });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ "Errror Message": err });
    }
});
exports.searchEmbeddingKeywordHandler = searchEmbeddingKeywordHandler;
