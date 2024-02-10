import { ObjectId } from "mongodb";
import type { IUser } from "./user.model.ts";

export interface DBUser extends Omit<IUser, "id"> {
  _id: ObjectId;
}
