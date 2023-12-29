import type {
  CreateUserChapterHistory,
  Paginate,
  UserChapterHistory,
  UserChapterHistoryFilter,
} from "../../models/index.ts";

export interface UserChapterHistoryRepository {
  find(
    filter: UserChapterHistoryFilter
  ): Promise<Paginate<UserChapterHistory[]>>;

  create(data: CreateUserChapterHistory): Promise<void>;
  delete(id: string): Promise<void>;
}
