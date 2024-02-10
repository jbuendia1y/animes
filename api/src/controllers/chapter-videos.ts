import { Status } from "../../deps.ts";
import { getQuery } from "$oak/helpers.ts";
import { RouterContext } from "$oak/mod.ts";
import {
  ChapterVideoFilter,
  CreateChapterVideo,
  UpdateChapterVideo,
} from "../models/index.ts";
import type { ChapterVideosRepository } from "../repositories/chapter-videos/chapter-videos.repository.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class ChapterVideosController {
  constructor(
    @inject(DI_TOKEN.CHAPTER_VIDEOS_REPO) private repository:
      ChapterVideosRepository,
  ) {}

  public async getChapterVideos(ctx: RouterContext<"/">) {
    const query = getQuery(ctx);

    let options = {};
    if (query.chapterId) options = { chapterId: query.chapterId };

    const filter = new ChapterVideoFilter({
      options,
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });

    const data = await this.repository.find(filter);

    ctx.response.status = Status.OK;
    ctx.response.body = data;
  }

  public async getOneChapterVideo(ctx: RouterContext<"/:id">) {
    const id = ctx.params.id;

    const data = await this.repository.findOne(id);

    ctx.response.status = Status.OK;
    ctx.response.body = data;
  }

  public async createChapterVideo(ctx: RouterContext<"/">) {
    const result = ctx.request.body({ type: "json" });
    const data = new CreateChapterVideo(await result.value);
    await this.repository.save(data);

    ctx.response.status = Status.Created;
  }

  public async deleteChapterVideo(ctx: RouterContext<"/:id">) {
    const id = ctx.params.id;

    await this.repository.delete(id);

    ctx.response.status = Status.OK;
  }
  public async updateChapterVideo(ctx: RouterContext<"/:id">) {
    const id = ctx.params.id;

    const result = ctx.request.body({ type: "json" });
    const body = new UpdateChapterVideo(await result.value);

    await this.repository.update(id, body);
    ctx.response.status = Status.OK;
  }
}
