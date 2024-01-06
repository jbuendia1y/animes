import { faker, fakerEN, fakerES } from "npm:@faker-js/faker";
import {
  Chapter,
  IChapter,
} from "../../../src/models/chapter/chapter.model.ts";

export const generateChapterMock = ({
  animeId,
  ...data
}: Partial<IChapter> = {}) => {
  const title = { en: fakerEN.lorem.words(7), es: fakerES.lorem.words(7) };

  const date = faker.date.past({ years: 2 });
  const airdate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  // example: 2020-05-04

  const createdAt = faker.date.recent({ refDate: date });

  return new Chapter({
    id: crypto.randomUUID(),
    thumbnail: faker.image.urlPicsumPhotos(),
    canonicalTitle: title.en,
    titles: title,
    synopsis: faker.lorem.paragraph(3),
    description: faker.lorem.paragraph(3),
    number: faker.number.int({ min: 1, max: 24 }),
    airdate: airdate,
    animeId: animeId ?? crypto.randomUUID(),
    createdAt: createdAt,
    updatedAt: faker.date.recent({ refDate: createdAt }),
    ...data,
  });
};
