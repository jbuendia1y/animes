import { Paginate } from "../../../src/models/paginate.ts";
import { CreateUserChapterHistory } from "../../../src/models/user-chapter-history/create-user-chapter-history.model.ts";
import {
  UserChapterHistoryFilter,
  UserChapterHistory,
} from "../../../src/models/user-chapter-history/user-chapter-history.model.ts";
import { UserChapterHistoryRepository } from "../../../src/repositories/user-chapter-history/user-chapter-history.repository.ts";
import { generateUserChapterHistoryMock } from "../data/user-chapter-history.ts";

export class MockUserChapterHistoryRepository
  implements UserChapterHistoryRepository
{
  data: UserChapterHistory[] = [
    generateUserChapterHistoryMock(),
    generateUserChapterHistoryMock(),
    generateUserChapterHistoryMock(),
    generateUserChapterHistoryMock(),
    generateUserChapterHistoryMock(),
    generateUserChapterHistoryMock(),
  ];

  find(
    _filter: UserChapterHistoryFilter
  ): Promise<Paginate<UserChapterHistory[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      })
    );
  }
  create(data: CreateUserChapterHistory): Promise<void> {
    this.data.push(
      new UserChapterHistory({
        ...data.values,
        id: crypto.randomUUID(),
      })
    );
    return Promise.resolve();
  }
  delete(id: string): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);
    this.data.splice(idx, 1);
    return Promise.resolve();
  }
}
