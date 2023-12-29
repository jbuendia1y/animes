import { RouterContext, Status, getQuery } from "../../deps.ts";
import {
  CreateUserChapterHistory,
  UserChapterHistoryFilter,
} from "../models/index.ts";
import { UserChapterHistoryRepository } from "../repositories/user-chapter-history/user-chapter-history.repository.ts";
import { getUserIdFromHeaders } from "../utils/index.ts";
import { DI_TOKEN } from "../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class UserChapterHistoryController {
  constructor(
    @inject(DI_TOKEN.USER_CHAPTER_HISTORY_REPO)
    private repository: UserChapterHistoryRepository
  ) {}

  public async getUserChapterHistory(ctx: RouterContext<"/">) {
    const userId = await getUserIdFromHeaders(ctx);
    if (!userId) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const query = getQuery(ctx);

    const filter = new UserChapterHistoryFilter({
      options: { userId },
      page: {
        limit: query.limit ? parseInt(query.limit) : 25,
        offset: query.offset ? parseInt(query.offset) : 0,
      },
    });
    const history = await this.repository
      .find(filter)
      .then((page) => page.values)
      .then((value) => ({
        data: value.data.map((v) => v.values),
        meta: value.meta,
      }));

    ctx.response.status = Status.OK;
    ctx.response.body = history;
  }
  public async createUserChapterHistory(ctx: RouterContext<"/">) {
    const userId = await getUserIdFromHeaders(ctx);

    const body = ctx.request.body();
    const result = await body.value;

    const data = new CreateUserChapterHistory({
      ...result,
      userId,
    });

    await this.repository.create(data);

    ctx.response.status = Status.OK;
  }
  public async deleteUserChapterHistory(ctx: RouterContext<"/:id">) {
    const id = ctx.params.id;

    await this.repository.delete(id);
  }
}
