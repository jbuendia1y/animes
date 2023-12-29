import { RouterContext, Status, getQuery } from "../../deps.ts";
import { emitAnimeFavoriteEvent } from "../events/anime-favorite.event.ts";
import {
  AnimeFavoriteFilter,
  CreateAnimeFavorite,
  UpdateAnimeFavorite,
} from "../models/index.ts";
import { AnimeFavoritesRepository } from "../repositories/anime-favorites/anime-favorites.repository.ts";
import { getUserIdFromHeaders } from "../utils/index.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class AnimeFavoritesController {
  constructor(
    @inject(DI_TOKEN.ANIMES_FAVORITES_REPO)
    private repository: AnimeFavoritesRepository
  ) {}

  public async getAnimeFavorites(ctx: RouterContext<"/">) {
    const userId = await getUserIdFromHeaders(ctx);
    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const query = getQuery(ctx);
    const options: { [key: string]: string } = { userId };
    if (query.animeId) options["animeId"] = query.animeId;

    const filter = new AnimeFavoriteFilter({
      options,
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });

    const favorites = await this.repository
      .find(filter)
      .then((page) => page.values)
      .then((value) => ({
        data: value.data.map((v) => v.values),
        meta: value.meta,
      }));

    ctx.response.status = Status.OK;
    ctx.response.body = favorites;
  }

  public async createAnimeFavorite(ctx: RouterContext<"/">) {
    const userId = await getUserIdFromHeaders(ctx);
    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const result = ctx.request.body({ type: "json" });
    const body = await result.value;
    const data = new CreateAnimeFavorite({
      ...body,
      userId,
    });

    await this.repository.save(data);

    ctx.response.status = Status.OK;

    await emitAnimeFavoriteEvent("create", data);
  }

  public async updateAnimeFavorite(ctx: RouterContext<"/:id">) {
    const favoriteId = ctx.params.id;
    const userId = await getUserIdFromHeaders(ctx);

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const result = ctx.request.body({ type: "json" });
    const body = await result.value;
    const data = new UpdateAnimeFavorite(body);

    const beforeUpdate = await this.repository.findOne(favoriteId);
    if (!beforeUpdate) {
      ctx.response.status = Status.BadRequest;
      return;
    }

    if (beforeUpdate.values.userId !== userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    await this.repository.update(favoriteId, data);
    ctx.response.status = Status.OK;

    await emitAnimeFavoriteEvent("update", {
      before: beforeUpdate,
      toUpdateData: data,
    });
  }

  public async deleteAnimeFavorite(ctx: RouterContext<"/:id">) {
    const favoriteId = ctx.params.id;
    const userId = await getUserIdFromHeaders(ctx);

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const beforeDelete = await this.repository.findOne(favoriteId);
    if (!beforeDelete) {
      ctx.response.status = Status.BadRequest;
      return;
    }

    if (beforeDelete.values.userId !== userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    await this.repository.delete(favoriteId);
    ctx.response.status = Status.OK;

    await emitAnimeFavoriteEvent("delete", {
      before: beforeDelete,
    });
  }
}
