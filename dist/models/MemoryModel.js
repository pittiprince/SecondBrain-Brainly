"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryModel = void 0;
const mongoose_1 = require("mongoose");
const MemoryInterface_1 = require("../interface/MemoryInterface");
// schema
const MemorySchema = new mongoose_1.Schema({
    UserObjectId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(MemoryInterface_1.ContentType), required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    tags: { type: [String], required: true },
    embedding_Vectors: { type: [Number], required: false },
}, {
    timestamps: true
});
// model
exports.MemoryModel = (0, mongoose_1.model)("Memory", MemorySchema);
