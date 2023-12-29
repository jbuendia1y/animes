import { DBUserAnime } from "../models/user-anime/db-user-anime.model.ts";
import { UserAnime } from "../models/user-anime/user-anime.model.ts";

export const createUserAnimeAddapted = (data: DBUserAnime): UserAnime => {
  return new UserAnime({
    id: data._id.toString(),
    animeId: data.animeId,
    userId: data.userId,
  });
};
