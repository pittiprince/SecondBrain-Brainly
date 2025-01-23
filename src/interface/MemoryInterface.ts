import { Types } from "mongoose";

export enum ContentType {
    Link = 'link',
    YoutubeLink = 'YoutubeLink',
    Tweet = 'tweet',
    Pdf = 'pdf',
  }

export interface MemoryInterface {
UserObjectId: Types.ObjectId;
type: ContentType;
link: string;
title: string;
desc: string;
tags: string[];
embedding_Vectors?: number[];
}