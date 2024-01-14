import { container } from "npm:tsyringe";
import { Context, Status } from "../../deps.ts";
import { DI_TOKEN } from "../di.ts";
import type { UsersRepository } from "../repositories/users/users.repository.ts";
import { AuthUtils } from "../utils/index.ts";

export const authMiddleware =
  ({ role }: { role?: "isAdmin" } = {}) =>
  async (ctx: Context, next: () => Promise<unknown>) => {
    const usersRepository = container.resolve<UsersRepository>(
      DI_TOKEN.USERS_REPO
    );

    const userId = await AuthUtils.getUserIdFromHeaders(ctx);

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }
    if (!role) {
      await next();
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
