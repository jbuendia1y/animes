import { User } from "../../src/models/index.ts";

export const UserMock = new User({
  id: "MY_ID",
  avatar: null,
  username: "MY_USERNAME",
  password: "MY_SECRET_PASSWORD",
  isAdmin: false,
  updatedAt: new Date(),
  createdAt: new Date(),
});
