import { Tag } from "../../../src/models/tag/tag.model.ts";
import { faker, fakerEN, fakerES } from "npm:@faker-js/faker";

export const generateTagMock = () => {
  const nameES = fakerES.word.words({ count: 1 });
  const nameEN = fakerEN.word.words({ count: 1 });

  return new Tag({
    id: crypto.randomUUID(),
    name: { es: nameES, en: nameEN },
    description: { es: nameES, en: nameEN },
    nsfw: false,
    slug: faker.lorem.slug({ max: 2, min: 1 }),
  });
};
