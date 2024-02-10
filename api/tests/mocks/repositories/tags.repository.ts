import { Paginate } from "../../../src/models/paginate.ts";
import { CreateTag } from "../../../src/models/tag/create-tag.model.ts";
import { Tag, TagFilter } from "../../../src/models/tag/tag.model.ts";
import { UpdateTag } from "../../../src/models/tag/update-tag.model.ts";
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

  update(id: string, data: UpdateTag): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);

    this.data[idx] = new Tag({
      ...this.data[idx].values,
      ...data.values,
    });

    return Promise.resolve();
  }

  find(_filter: TagFilter): Promise<Paginate<Tag[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      }),
    );
  }

  save(data: CreateTag): Promise<void> {
    this.data.push(
      new Tag({
        ...data.values,
        id: crypto.randomUUID(),
      }),
    );
    return Promise.resolve();
  }
}
