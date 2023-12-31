import { MongoCollection, MongoDatabase } from "../../../deps.ts";
import { createTagAddapted } from "../../addapters/tag.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import {
  CreateTag,
  DBTag,
  Paginate,
  Tag,
  TagFilter,
} from "../../models/index.ts";
import { TagsRepository } from "./tags.repository.ts";
import { DI_TOKEN } from "../../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class MongoTagsRepository implements TagsRepository {
  private collection: MongoCollection<DBTag>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBTag>("tag");
  }

  async find(filter: TagFilter): Promise<Paginate<Tag[]>> {
    const { options, page } = filter.values;
    const total = await this.collection.countDocuments(options);
    const tags = (
      await this.collection
        .find(options)
        .limit(page.limit)
        .skip(page.offset)
        .toArray()
    ).map((doc) => createTagAddapted(doc));

    return new Paginate({ data: tags, meta: { total } });
  }

  async save(data: CreateTag): Promise<void> {
    const slug = data.values.slug;
    const exist = await this.collection.findOne({ slug });

    if (exist) throw new ResourceAllReadyExistError();

    await this.collection.insertOne(data.values);
  }
}
