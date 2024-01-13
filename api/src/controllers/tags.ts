import { RouterContext, Status, getQuery } from "../../deps.ts";
import { CreateTag, TagFilter } from "../models/index.ts";
import { TagsRepository } from "../repositories/tags/tags.repository.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class TagsController {
  constructor(@inject(DI_TOKEN.TAGS_REPO) private repository: TagsRepository) {}

  public async getTags(ctx: RouterContext<"/">) {
    const query = getQuery(ctx);
    const options: { [key: string]: unknown } = {};

    if (query.slug) options["slug"] = query.slug;

    const filter = new TagFilter({
      options,
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });

    const tags = await this.repository
      .find(filter)
      .then((page) => page.values)
      .then((value) => ({
        data: value.data.map((v) => v.values),
        meta: value.meta,
      }));

    ctx.response.status = Status.OK;
    ctx.response.body = tags;
  }

  public async createTag(ctx: RouterContext<"/">) {
    const result = ctx.request.body({ type: "json" });
    const body = await result.value;

    const data = new CreateTag(body);

    await this.repository.save(data);
    ctx.response.status = Status.Created;
  }
}
