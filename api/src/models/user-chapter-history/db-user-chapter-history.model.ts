import { ObjectId } from "../../../deps.ts";
import { IUserChapterHistory } from "./user-chapter-history.model.ts";

export interface DBUserChapterHistory extends Omit<IUserChapterHistory, "id"> {
  _id: ObjectId;
}
