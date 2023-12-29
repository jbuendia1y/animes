import { AnimeFavorite, DBAnimeFavorite } from "../models/index.ts";

export const createAnimeFavoriteAddapted = (
  data: DBAnimeFavorite
): AnimeFavorite => {
  return new AnimeFavorite({
    id: data._id.toString(),
    stars: data.stars,
    userId: data.userId,
    animeId: data.animeId,
  });
};
