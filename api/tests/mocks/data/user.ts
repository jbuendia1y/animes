import { faker } from "npm:@faker-js/faker";
import { User } from "../../../src/models/index.ts";

export const UserMock = new User({
  id: crypto.randomUUID(),
  avatar: faker.internet.avatar(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  isAdmin: false,
  updatedAt: new Date(),
  createdAt: new Date(),
});

export const generateUserMock = (
  data: { isAdmin: boolean } = { isAdmin: false }
) => {
  const createdAt = faker.date.past({ years: 2 });

  return new User({
    id: crypto.randomUUID(),
    avatar: faker.internet.avatar(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    isAdmin: data.isAdmin,
    updatedAt: faker.date.recent({ refDate: createdAt }),
    createdAt: createdAt,
  });
};
