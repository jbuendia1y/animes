import { faker } from "npm:@faker-js/faker";
import {
  AnimeFavorite,
  IAnimeFavorite,
} from "../../../src/models/anime-favorite/index.ts";

export const generateAnimeFavoriteMock = (
  data: Partial<IAnimeFavorite> = {},
) => {
  return new AnimeFavorite({
    id: crypto.randomUUID(),
    stars: faker.number.int({ min: 1, max: 5 }),
    animeId: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    ...data,
  });
};
