import { container } from "npm:tsyringe";
import { bcrypt, Context, Payload, verifyJWT } from "../../deps.ts";
import { JWT_KEY } from "../config/index.ts";
import { DI_TOKEN } from "../di.ts";

import type { IUser, User } from "../models/index.ts";
import type { UsersRepository } from "../repositories/users/users.repository.ts";

export class AuthUtils {
  /**
   * @param user
   * @returns User to return into the response.body without password
   */
  static createExposedUser(user: User): Omit<IUser, "password"> {
    const { password: _, ...data } = user.values;
    return data;
  }

  static async getUserIdFromHeaders(ctx: Context) {
    const headers = ctx.request.headers;

    const authorization = headers.get("Authorization");
    if (!authorization) {
      return null;
    }

    const code = authorization.split(" ")[1];
    const payload = await verifyJWT(code, JWT_KEY).catch(
      () => ({ sub: undefined } as Payload),
    );
    const userId = payload.sub;

    if (!userId) {
      return null;
    }

    return userId;
  }

  static async getUserFromHeaders(ctx: Context) {
    const userRepository = container.resolve<UsersRepository>(
      DI_TOKEN.USERS_REPO,
    );
    const userId = await this.getUserIdFromHeaders(ctx);

    if (!userId) {
      return null;
    }

    const user = await userRepository.findOne.bind(userRepository)(userId);
    if (!user) {
      return null;
    }
    return user;
  }

  /**
   * @param input plain password
   * @param original database password
   */
  static comparePasswords(input: string, original: string) {
    return bcrypt.compare(input, original);
  }

  /**
   * @param password plain password
   * @returns hash
   */
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }
}
