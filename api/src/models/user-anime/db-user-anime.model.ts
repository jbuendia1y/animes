import { ObjectId } from "../../../deps.ts";
import { IUserAnime } from "./user-anime.model.ts";

export interface DBUserAnime extends Omit<IUserAnime, "id"> {
  _id: ObjectId;
}
