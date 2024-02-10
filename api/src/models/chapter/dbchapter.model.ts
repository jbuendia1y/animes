import { Document, ObjectId } from "mongodb";
import { IChapter } from "./chapter.model.ts";

export interface DBChapter extends Document, Omit<IChapter, "id"> {
  _id: ObjectId;
}
