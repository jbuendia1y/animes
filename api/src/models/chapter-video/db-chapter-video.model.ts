import { ObjectId } from "../../../deps.ts";

export interface DBChapterVideo {
  _id: ObjectId;
  provider: string | null;
  player: string;

  videoURL: string;
  embedURL: string;

  chapterId: string;
}
