import { Document, ObjectId } from "../../../deps.ts";
import { IChapter } from "./chapter.model.ts";

export interface DBChapter extends Document, Omit<IChapter, "id"> {
  _id: ObjectId;
}
