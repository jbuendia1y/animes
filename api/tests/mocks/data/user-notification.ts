import { faker, fakerES } from "npm:@faker-js/faker";
import {
  IUserNotification,
  UserNotification,
} from "../../../src/models/user-notification/index.ts";

export const generateUserNoticiationMock = (
  data: Partial<IUserNotification> = {},
) => {
  return new UserNotification({
    id: crypto.randomUUID(),
    description: fakerES.lorem.paragraph(3),
    imageLink: faker.image.urlPicsumPhotos(),
    link: faker.internet.url({ appendSlash: false }),
    title: fakerES.word.sample(),
    userId: crypto.randomUUID(),
    viewed: false,
    ...data,
  });
};
