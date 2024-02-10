import { Status } from "../../deps.ts";
import { getQuery } from "$oak/helpers.ts";
import { RouterContext } from "$oak/mod.ts";

import {
  DeleteUserNotification,
  UpdateUserNotification,
  UserNotificationsFilter,
} from "../models/index.ts";
import type { UserNotificationsRepository } from "../repositories/user-notifications/user-notifications.repository.ts";
import { AuthUtils } from "../utils/index.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserNotificationsController {
  constructor(
    @inject(DI_TOKEN.USER_NOTIFICATIONS_REPO) private repository:
      UserNotificationsRepository,
  ) {}

  public async getUserNotifications(ctx: RouterContext<"/">) {
    const query = getQuery(ctx);
    const userId = await AuthUtils.getUserIdFromHeaders(ctx);

    const options: { [key: string]: string | boolean } = {};

    if (query.viewed === "false" || query.viewed === "true") {
      options["viewed"] = query.viewed === "false" ? false : true;
    }

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const filter = new UserNotificationsFilter({
      options: { ...options, userId },
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });

    const data = await this.repository
      .find(filter)
      .then((page) => page.values)
      .then((value) => ({
        data: value.data.map((v) => v.values),
        meta: value.meta,
      }));

    ctx.response.status = Status.OK;
    ctx.response.body = data;
  }
  public async updateUserNotification(ctx: RouterContext<"/:id">) {
    const result = ctx.request.body({ type: "json" });
    const body = await result.value;

    const toUpdate = new UpdateUserNotification(body);
    await this.repository.update(ctx.params.id, toUpdate);

    ctx.response.status = Status.OK;
  }
  public async deleteUserNotification(ctx: RouterContext<"/:id">) {
    const userId = await AuthUtils.getUserIdFromHeaders(ctx);
    const id = ctx.params.id;

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const toDelete = new DeleteUserNotification({ id, userId });

    await this.repository.delete(toDelete);

    ctx.response.status = Status.OK;
  }
}
