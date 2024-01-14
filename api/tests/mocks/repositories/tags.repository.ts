import { Paginate } from "../../../src/models/paginate.ts";
import { CreateTag } from "../../../src/models/tag/create-tag.model.ts";
import { TagFilter, Tag } from "../../../src/models/tag/tag.model.ts";
import { TagsRepository } from "../../../src/repositories/tags/tags.repository.ts";
import { generateTagMock } from "../data/tag.ts";

export class MockTagsRepository implements TagsRepository {
  data: Tag[] = [
    generateTagMock(),
    generateTagMock(),
    generateTagMock(),
    generateTagMock(),
    generateTagMock(),
    generateTagMock(),
  ];

  find(_filter: TagFilter): Promise<Paginate<Tag[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      })
    );
  }

  save(data: CreateTag): Promise<void> {
    this.data.push(
      new Tag({
        ...data.values,
        id: crypto.randomUUID(),
      })
    );
    return Promise.resolve();
  }
}
