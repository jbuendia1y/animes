import { DBUser, User } from "../models/index.ts";

export const createUserAddapted = (data: DBUser): User => {
  return new User({
    id: data._id.toString(),
    avatar: data.avatar,
    username: data.username,
    password: data.password,
    isAdmin: data.isAdmin,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
};
