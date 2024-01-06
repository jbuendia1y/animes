import { UserAnime } from "../../../src/models/user-anime/user-anime.model.ts";

export const generateUserAnimeMock = (
  data: Partial<{ userId: string; animeId: string }> = {}
) => {
  return new UserAnime({
    id: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    animeId: crypto.randomUUID(),
    ...data,
  });
};
