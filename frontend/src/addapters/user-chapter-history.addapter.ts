import {
  UserChapterHistory,
  UserChapterHistoryEndpoint,
} from "../models/user-chapter-history";

export const createUserChapterHistoryAddapted = (
  ed: UserChapterHistoryEndpoint
) => {
  const data = new UserChapterHistory({
    id: ed.id,
    chapterId: ed.chapterId,
    createdAt: new Date(ed.createdAt),
    userId: ed.userId,
  });

  return data;
};
