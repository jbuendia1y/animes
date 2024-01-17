import { inject, injectable } from "npm:tsyringe";
import { MongoCollection, MongoDatabase, ObjectId } from "../../../deps.ts";
import { createChapterAddapted } from "../../addapters/chapter.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import {
  Chapter,
  ChapterFilter,
  CreateChapter,
  DBChapter,
  Paginate,
  UpdateChapter,
} from "../../models/index.ts";
import { ChaptersRepository } from "./chapters.repository.ts";
import { DI_TOKEN } from "../../di.ts";

@injectable()
export class MongoChaptersRepository implements ChaptersRepository {
  private collection: MongoCollection<DBChapter>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBChapter>("chapters");
  }

  async find(filter: ChapterFilter): Promise<Paginate<Chapter[]>> {
    const values = filter.values;
    const options = values.options;

    const chapters = (
      await this.collection
        .find(options)
        .sort(values.sort)
        .limit(values.page.limit)
        .skip(values.page.offset)
        .toArray()
    ).map((doc) => createChapterAddapted(doc));

    const total = await this.collection.countDocuments(options);

    return new Paginate({ data: chapters, meta: { total: total } });
  }

  async findOne(id: string): Promise<Chapter | null> {
    const doc = await this.collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    return doc ? createChapterAddapted(doc) : null;
  }

  async save(data: CreateChapter) {
    const values = data.values;

    const exist = await this.collection.findOne({
      animeId: values.animeId,
      number: values.number,
    });

    if (exist) throw new ResourceAllReadyExistError();

    await this.collection.insertOne({
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(id: string, data: UpdateChapter) {
    await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: { ...data.values, updatedAt: new Date() } },
    );
  }
}
