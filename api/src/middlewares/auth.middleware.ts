import { container } from "npm:tsyringe";
import { Context, Status, verifyJWT } from "../../deps.ts";
import { JWT_KEY } from "../config/index.ts";
import { DI_TOKEN } from "../di.ts";
import type { UsersRepository } from "../repositories/users/users.repository.ts";

export const authMiddleware =
  ({ role }: { role?: "isAdmin" } = {}) =>
  async (ctx: Context, next: () => Promise<unknown>) => {
    const usersRepository = container.resolve<UsersRepository>(
      DI_TOKEN.USERS_REPO
    );
    const headers: Headers = ctx.request.headers;

    const authorization = headers.get("Authorization");
    if (!authorization) {
      ctx.response.status = Status.Unauthorized;
      return;
    }
    const [_token_type, access_token] = authorization.split(" ");
    const payload = await verifyJWT(access_token, JWT_KEY);

    if (!role) {
      await next();
      return;
    }

    const userId = payload.sub;
    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }
    const user = await usersRepository.findOne.bind(usersRepository)(userId);

    if (!user) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    if (!user.values.isAdmin) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    await next();
  };
