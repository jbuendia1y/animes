import { Document, ObjectId } from "../../../deps.ts";
import { IAnime } from "./anime.model.ts";

export interface DBAnime extends Document, Omit<IAnime, "id"> {
  _id: ObjectId;
}
