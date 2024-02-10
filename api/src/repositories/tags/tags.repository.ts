import { CreateTag, Paginate, Tag, TagFilter } from "../../models/index.ts";
import { UpdateTag } from "../../models/tag/update-tag.model.ts";

export interface TagsRepository {
  find(filter: TagFilter): Promise<Paginate<Tag[]>>;
  save(data: CreateTag): Promise<void>;
  update(id: string, data: UpdateTag): Promise<void>;
}
