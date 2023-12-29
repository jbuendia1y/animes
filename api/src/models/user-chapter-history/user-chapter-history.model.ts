import { z } from "../../../deps.ts";

export interface IUserChapterHistory {
  id: string;
  userId: string;
  chapterId: string;
  createdAt: Date;
}

export class UserChapterHistory {
  private id: string;
  private userId: string;
  private chapterId: string;
  private createdAt: Date;

  constructor(data: IUserChapterHistory) {
    this.id = data.id;
    this.userId = data.userId;
    this.chapterId = data.chapterId;
    this.createdAt = data.createdAt;
  }

  get values(): IUserChapterHistory {
    return {
      id: this.id,
      userId: this.userId,
      chapterId: this.chapterId,
      createdAt: this.createdAt,
    };
  }
}

const UserChapterHistoryFilterSchema = z.object({
  options: z.object({
    userId: z.string(),
  }),
  page: z.object({
    limit: z.number().max(300),
    offset: z.number(),
  }),
});

export class UserChapterHistoryFilter {
  private options: { userId: string };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options: { userId: string };
    page: { limit: number; offset: number };
  }) {
    const parsed = UserChapterHistoryFilterSchema.parse({
      options: filters.options,
      page: filters.page,
    });

    this.options = parsed.options ?? {};
    this.page = parsed.page;
  }

  get values() {
    return { options: this.options, page: this.page };
  }
}
