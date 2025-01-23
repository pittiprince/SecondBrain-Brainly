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
exports.DeleteMemoryHandler = exports.updateMemoryHandler = exports.GetMemoryHandler = exports.GetDataForEmbeddings = exports.MemoryHandler = void 0;
const MemoryModel_1 = require("../models/MemoryModel");
const inspector_1 = require("inspector");
const MemoryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let memoryBody = req.body;
        if (memoryBody.type === "pdf") {
            let datawrite = yield MemoryModel_1.MemoryModel.create({
                UserObjectId: memoryBody.UserObjectId,
                type: memoryBody.type,
                link: memoryBody.link,
                title: memoryBody.title,
                desc: memoryBody.desc,
                tags: memoryBody.tags
            });
            datawrite.save();
            res.status(200).json({ "message": "Succesfully added the document", "MemoryObjectId": datawrite._id });
        }
        if (memoryBody.type === "tweet") {
            let dataWrite = yield MemoryModel_1.MemoryModel.create({
                UserObjectId: memoryBody.UserObjectId,
                type: memoryBody.type,
                link: memoryBody.link,
                title: memoryBody.title,
                desc: memoryBody.desc,
                tags: memoryBody.tags
            });
            dataWrite.save();
            res.status(200).json({ "message": "Succesfully added the tweet", "MemoryObjectId": dataWrite._id });
        }
        if (memoryBody.type === "YoutubeLink") {
            let dataWrite = yield MemoryModel_1.MemoryModel.create({
                UserObjectId: memoryBody.UserObjectId,
                type: memoryBody.type,
                link: memoryBody.link,
                title: memoryBody.title,
                desc: memoryBody.desc,
                tags: memoryBody.tags
            });
            dataWrite.save();
            res.status(200).json({ "message": "Succesfully added the Youtube link", "MemoryObjectId": dataWrite._id });
        }
        if (memoryBody.type === "link") {
            let dataWrite = yield MemoryModel_1.MemoryModel.create({
                UserObjectId: memoryBody.UserObjectId,
                type: memoryBody.type,
                link: memoryBody.link,
                title: memoryBody.title,
                desc: memoryBody.desc,
                tags: memoryBody.tags
            });
            dataWrite.save();
            res.status(200).json({ "message": "Succesfully added the link", "MemoryObjectId": dataWrite._id });
        }
    }
    catch (err) {
        inspector_1.console.log(err);
        res.status(500).json({ message: err });
    }
});
exports.MemoryHandler = MemoryHandler;
//response with data to generate embeddings
const GetDataForEmbeddings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).json({ message: "invalid MemoryObjectId" });
        }
        let result = yield MemoryModel_1.MemoryModel.find({ _id: id });
        if (!result) {
            res.status(400).json({ message: "invalid MemoryObjectId" });
        }
        let TitleTagsDesc = result.map(val => ({
            title: val.title,
            desc: val.desc,
            tags: val.tags
        }));
        res.status(200).send(TitleTagsDesc);
    }
    catch (err) {
        inspector_1.console.error("Error fetching memory:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.GetDataForEmbeddings = GetDataForEmbeddings;
//response with all the memories of the user based on the userId
const GetMemoryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).json({ "message": "send valid memoryObjectId" });
        }
        let result = yield MemoryModel_1.MemoryModel.find({ UserObjectId: id });
        let resultData = result.map(val => ({
            type: val.type,
            link: val.link,
            title: val.title,
            desc: val.desc,
            tags: val.tags
        }));
        res.status(200).send(resultData);
    }
    catch (err) {
        inspector_1.console.error("Error fetching memory:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.GetMemoryHandler = GetMemoryHandler;
//responese with updating of memory based on respective user and respective MemoryID
const updateMemoryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ObjectId } = req.body;
        let isUpdated;
        let result = yield MemoryModel_1.MemoryModel.find({ _id: ObjectId });
        if (result) {
            isUpdated = yield MemoryModel_1.MemoryModel.updateOne({
                link: req.body.link,
                title: req.body.title,
                desc: req.body.desc,
                tags: req.body.tags
            });
        }
        res.status(200).json({ "message": "updated sucessfully", "Updated Result": isUpdated, "memoryObjectId": req.body.MemoryObjectId });
    }
    catch (err) {
        inspector_1.console.error("Error fetching memory:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.updateMemoryHandler = updateMemoryHandler;
//response with deleting of memory based on respective user and respective MemoryId
const DeleteMemoryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { MemoryObjectId } = req.body;
        if (!MemoryObjectId) {
            res.status(400).json({ "message": "send valid memoryObjectId" });
        }
        let isFound = yield MemoryModel_1.MemoryModel.findOne({ _id: MemoryObjectId });
        if (isFound) {
            let result = yield MemoryModel_1.MemoryModel.deleteOne({ _id: MemoryObjectId });
            res.send(result);
        }
        else {
            res.status(400).json({ "message": "memory does not exist to delete" });
        }
    }
    catch (err) {
        inspector_1.console.error("Error fetching memory:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.DeleteMemoryHandler = DeleteMemoryHandler;
