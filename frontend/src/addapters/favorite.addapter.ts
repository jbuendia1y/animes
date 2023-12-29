import { DBFavorite, Favorite } from "../models/favorite.model";

export const createFavoriteAddapted = (ed: DBFavorite): Favorite => {
  return new Favorite({
    id: ed.id,
    stars: ed.stars,
    animeId: ed.animeId,
    userId: ed.userId,
  });
};
