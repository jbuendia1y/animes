import { faker } from "npm:@faker-js/faker";
import {
  IAnimeFavorite,
  AnimeFavorite,
} from "../../../src/models/anime-favorite/index.ts";

export const generateAnimeFavoriteMock = (
  data: Partial<IAnimeFavorite> = {}
) => {
  return new AnimeFavorite({
    id: crypto.randomUUID(),
    stars: faker.number.int({ min: 0, max: 5 }),
    animeId: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    ...data,
  });
};
