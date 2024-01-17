import { DBUserChapterHistory, UserChapterHistory } from "../models/index.ts";

export const createUserChapterHistoryAddapted = (
  data: DBUserChapterHistory,
): UserChapterHistory => {
  return new UserChapterHistory({
    id: data._id.toString(),
    chapterId: data.chapterId,
    userId: data.userId,
    createdAt: data.createdAt,
  });
};
