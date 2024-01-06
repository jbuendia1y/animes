import { faker, fakerEN, fakerES } from "npm:@faker-js/faker";
import { Anime } from "../../../src/models/index.ts";

export const generateAnimeMock = () => {
  const title = { en: fakerEN.lorem.words(7), es: fakerES.lorem.words(7) };

  return new Anime({
    id: crypto.randomUUID(),
    slug: faker.lorem.slug({ min: 3, max: 5 }),
    canonicalTitle: title.en,
    synopsis: faker.lorem.paragraph(3),
    description: faker.lorem.paragraph(3),
    nsfw: false,
    coverImage: faker.image.urlPicsumPhotos(),
    posterImage: faker.image.urlPicsumPhotos(),
    showType: "TV",
    stars: {
      1: faker.number.int({ min: 0, max: 20 }),
      2: faker.number.int({ min: 0, max: 20 }),
      3: faker.number.int({ min: 0, max: 20 }),
      4: faker.number.int({ min: 0, max: 20 }),
      5: faker.number.int({ min: 0, max: 20 }),
    },
    status: "Emision",
    tags: [],
    titles: title,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
