import { faker } from "npm:@faker-js/faker";
import {
  IUserChapterHistory,
  UserChapterHistory,
} from "../../../src/models/user-chapter-history/index.ts";

export const generateUserChapterHistoryMock = (
  data: Partial<IUserChapterHistory> = {},
) => {
  return new UserChapterHistory({
    id: crypto.randomUUID(),
    chapterId: crypto.randomUUID(),
    userId: crypto.randomUUID(),
    createdAt: faker.date.recent(),
    ...data,
  });
};
