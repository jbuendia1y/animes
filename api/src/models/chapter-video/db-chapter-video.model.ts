import { ObjectId } from "mongodb";

export interface DBChapterVideo {
  _id: ObjectId;
  player: string;

  videoURL: string;
  embedURL: string;

  chapterId: string;
}
