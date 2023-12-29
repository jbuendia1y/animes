import type { ObjectId } from "../../../deps.ts";
import type { ITag } from "./tag.model.ts";

export interface DBTag extends Omit<ITag, "id"> {
  _id: ObjectId;
}
