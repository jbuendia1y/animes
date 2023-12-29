import { ObjectId } from "../../../deps.ts";
import { IAnimeFavorite } from "./anime-favorite.model.ts";

export interface DBAnimeFavorite extends Omit<IAnimeFavorite, "id"> {
  _id: ObjectId;
}
