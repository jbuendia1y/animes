import { container } from "npm:tsyringe";
import { Context, verifyJWT } from "../../deps.ts";
import { JWT_KEY } from "../config/index.ts";
import { DI_TOKEN } from "../di.ts";

import type { IUser, User } from "../models/index.ts";
import type { UsersRepository } from "../repositories/users/users.repository.ts";

export const createExposedUser = (user: User): Omit<IUser, "password"> => {
  const { password: _, ...data } = user.values;
  return data;
};

export const getUserIdFromHeaders = async (ctx: Context) => {
  const headers = ctx.request.headers;

  const authorization = headers.get("Authorization");
  if (!authorization) {
    return null;
  }

  const code = authorization.split(" ")[1];
  const payload = await verifyJWT(code, JWT_KEY);
  const userId = payload.sub;

  if (!userId) {
    return null;
  }

  return userId;
};

export const getUserFromHeaders = async (ctx: Context) => {
  const userRepository = container.resolve<UsersRepository>(
    DI_TOKEN.USERS_REPO
  );
  const userId = await getUserIdFromHeaders(ctx);

  if (!userId) {
    return null;
  }

  const user = await userRepository.findOne.bind(userRepository)(userId);
  if (!user) {
    return null;
  }
  return user;
};
