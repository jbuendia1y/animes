import { getQuery, RouterContext, Status } from "../../deps.ts";
import {
  CreateUserAnime,
  DeleteUserAnime,
  UserAnimeFilter,
} from "../models/user-anime/index.ts";
import { UserAnimesRepository } from "../repositories/user-anime/user-anime.repository.ts";
import { AuthUtils } from "../utils/index.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class UserAnimesController {
  constructor(
    @inject(DI_TOKEN.USER_ANIMES_REPO) private repository: UserAnimesRepository,
  ) {}

  public async getUserAnimes(ctx: RouterContext<"/">) {
    const userId = await AuthUtils.getUserIdFromHeaders(ctx);
    const query = getQuery(ctx);

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }
    const options: { [key: string]: unknown } = { ...query, userId };
    if (query.animeId) options.animeId = query.animeId;

    const filter = new UserAnimeFilter({
      options,
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
  public async createUserAnimes(ctx: RouterContext<"/">) {
    const userId = await AuthUtils.getUserIdFromHeaders(ctx);
    const result = ctx.request.body({ type: "json" });
    const body = await result.value;

    const data = new CreateUserAnime({ ...body, userId });

    await this.repository.save(data);

    ctx.response.status = Status.Created;
  }
  public async deleteUserAnimes(ctx: RouterContext<"/:id">) {
    const userId = await AuthUtils.getUserIdFromHeaders(ctx);

    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const id = ctx.params.id;

    const data = new DeleteUserAnime({
      id,
      userId,
    });

    await this.repository.delete(data);

    ctx.response.status = Status.OK;
  }
}
