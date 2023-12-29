import { z } from "../../../deps.ts";

export const CreateUserChapterHistorySchema = z.object({
  userId: z.string(),
  chapterId: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export type ICreateUserChapterHistory = z.infer<
  typeof CreateUserChapterHistorySchema
>;

export class CreateUserChapterHistory {
  private userId: string;
  private chapterId: string;
  private createdAt: Date;

  constructor(data: ICreateUserChapterHistory) {
    const parsed = CreateUserChapterHistorySchema.parse(data);
    this.userId = parsed.userId;
    this.chapterId = parsed.chapterId;
    this.createdAt = parsed.createdAt;
  }

  get values(): ICreateUserChapterHistory {
    return {
      userId: this.userId,
      chapterId: this.chapterId,
      createdAt: this.createdAt,
    };
  }
}
