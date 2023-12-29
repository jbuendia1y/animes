import { User, UserEndpoint } from "../models/user.model";

export const createUserAddapted = (ed: UserEndpoint): User => {
  return new User({
    id: ed.id,
    avatar: ed.avatar,
    username: ed.username,
    isAdmin: ed.isAdmin,
    createdAt: new Date(ed.createdAt),
    updatedAt: new Date(ed.updatedAt),
  });
};
