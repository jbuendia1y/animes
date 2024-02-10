import { ObjectId } from "mongodb";
import type { ITag } from "./tag.model.ts";

export interface DBTag extends Omit<ITag, "id"> {
  _id: ObjectId;
}
