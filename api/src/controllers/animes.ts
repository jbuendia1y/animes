import { queryString, Status } from "../../deps.ts";
import { getQuery } from "$oak/helpers.ts";
import { RouterContext } from "$oak/mod.ts";
import { inject, injectable } from "tsyringe";

import { AnimeFilter, CreateAnime, UpdateAnime } from "../models/index.ts";
import type { AnimesRepository } from "../repositories/animes/animes.repository.ts";
import { DI_TOKEN } from "../di.ts";

@injectable()
export class AnimesContoller {
  constructor(
    @inject(DI_TOKEN.ANIMES_REPO) private repository: AnimesRepository,
  ) {}

  public async getAnimes(ctx: RouterContext<"/">) {
    const query = getQuery(ctx);
    const formattedQuery = queryString.parse(
      new URLSearchParams(query).toString(),
      {
        arrayFormat: "index",
      },
    );

    let options = {};
    if (query.slug) options = { ...options, slug: query.slug };
    if (query.status) options = { ...options, status: query.status };
    if (formattedQuery["tags"]) {
      options = {
        ...options,
        tags: formattedQuery["tags"],
      };
    }

    const filter = new AnimeFilter({
      options,
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });

    const animes = await this.repository
      .find(filter)
      .then((page) => page.values)
      .then((value) => ({
        data: value.data.map((v) => v.values),
        meta: value.meta,
      }));
    ctx.response.body = animes;
    ctx.response.status = Status.OK;
  }

  public async getOneAnime(ctx: RouterContext<"/:id">) {
    const anime = await this.repository.findOne(ctx.params.id);
    ctx.response.body = anime ? anime.values : null;
    ctx.response.status = anime ? Status.OK : Status.NotFound;
  }

  public async createAnime(ctx: RouterContext<"/">) {
    if (!ctx.request.hasBody) {
      ctx.response.status = Status.BadRequest;
      return;
    }

    const result = ctx.request.body({ type: "json" });
    const data = new CreateAnime(await result.value);

    await this.repository.save(data);
    ctx.response.status = Status.Created;
  }

  public async updateAnime(ctx: RouterContext<"/:id">) {
    const id = ctx.params.id;
    const result = ctx.request.body({ type: "json" });
    const body = new UpdateAnime(await result.value);

    await this.repository.update(id, body);
    ctx.response.status = Status.OK;
  }
}
