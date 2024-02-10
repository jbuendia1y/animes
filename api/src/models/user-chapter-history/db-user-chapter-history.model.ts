import { ObjectId } from "mongodb";
import { IUserChapterHistory } from "./user-chapter-history.model.ts";

export interface DBUserChapterHistory extends Omit<IUserChapterHistory, "id"> {
  _id: ObjectId;
}
