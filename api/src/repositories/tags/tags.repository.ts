import { CreateTag, Paginate, Tag, TagFilter } from "../../models/index.ts";

export interface TagsRepository {
  find(filter: TagFilter): Promise<Paginate<Tag[]>>;
  save(data: CreateTag): Promise<void>;
}
