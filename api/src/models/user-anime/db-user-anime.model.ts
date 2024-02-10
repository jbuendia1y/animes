import { ObjectId } from "mongodb";
import { IUserAnime } from "./user-anime.model.ts";

export interface DBUserAnime extends Omit<IUserAnime, "id"> {
  _id: ObjectId;
}
