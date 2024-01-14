import { RouterContext, Status, getQuery, z } from "../../deps.ts";
import {
  CreateChapterEvent,
  emitChapterEvent,
} from "../events/chapters.event.ts";
import {
  ChapterFilter,
  CreateChapter,
  UpdateChapter,
} from "../models/index.ts";
import { ChaptersRepository } from "../repositories/chapters/chapters.repository.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class ChaptersController {
  constructor(
    @inject(DI_TOKEN.CHAPTERS_REPO) private repository: ChaptersRepository
  ) {}

  public async getChapters(ctx: RouterContext<"/">) {
    const query = getQuery(ctx);

    let options: { [key: string]: unknown } = {};
    let sort = {};
    if (query.animeId) options = { animeId: query.animeId };
    if (query.number) options.number = parseInt(query.number);
    if (query["sort[createdAt]"]) {
      const value = parseInt(query["sort[createdAt]"]);
      const validator = z.number().max(1).min(-1);
      const parsed = validator.parse(value);
      sort = { createdAt: parsed };
    }

    const filter = new ChapterFilter({
      options,
      sort,
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });

    const chapters = await this.repository
      .find(filter)
      .then((page) => page.values)
      .then((value) => ({
        data: value.data.map((v) => v.values),
        meta: value.meta,
      }));

    ctx.response.body = chapters;
    ctx.response.status = Status.OK;
  }

  public async getOneChapter(ctx: RouterContext<"/:id">) {
    const chapter = await this.repository.findOne(ctx.params.id);
    ctx.response.body = chapter ? chapter.values : null;
    ctx.response.status = chapter ? Status.OK : Status.NotFound;
  }

  public async createChapter(ctx: RouterContext<"/">) {
    if (!ctx.request.hasBody) {
      ctx.response.status = Status.BadRequest;
      return;
    }

    const result = ctx.request.body({ type: "json" });
    const data = new CreateChapter(await result.value);

    await this.repository.save(data);
    await emitChapterEvent(CreateChapterEvent, data);
    ctx.response.status = Status.Created;
  }

  public async updateChapter(ctx: RouterContext<"/:id">) {
    const id = ctx.params.id;
    const result = ctx.request.body({ type: "json" });

    const chapter = await this.repository.findOne(id);
    if (!chapter) {
      ctx.response.status = Status.BadRequest;
      return;
    }

    const body = new UpdateChapter(await result.value);

    await this.repository.update(id, body);
    ctx.response.status = Status.OK;
  }
}
