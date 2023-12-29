import { DBUserAnime, UserAnime } from "../models/user-anime.model";

export const createUserAnimeAddapted = (data: DBUserAnime): UserAnime => {
  return new UserAnime({
    id: data.id,
    animeId: data.animeId,
    userId: data.userId,
  });
};
