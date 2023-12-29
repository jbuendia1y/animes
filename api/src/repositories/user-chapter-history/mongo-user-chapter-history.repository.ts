import { MongoCollection, MongoDatabase, ObjectId } from "../../../deps.ts";
import { createUserChapterHistoryAddapted } from "../../addapters/user-chapter-history.addapter.ts";
import {
  CreateUserChapterHistory,
  DBUserChapterHistory,
  Paginate,
  UserChapterHistory,
  UserChapterHistoryFilter,
} from "../../models/index.ts";
import { UserChapterHistoryRepository } from "./user-chapter-history.repository.ts";
import { DI_TOKEN } from "../../di.ts";
import { inject, injectable } from "npm:tsyringe";

@injectable()
export class MongoUserChapterHistoryRepository
  implements UserChapterHistoryRepository
{
  private collection: MongoCollection<DBUserChapterHistory>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBUserChapterHistory>(
      "user-chapter-histories"
    );
  }

  async find(
    filter: UserChapterHistoryFilter
  ): Promise<Paginate<UserChapterHistory[]>> {
    const values = filter.values;
    const options = values.options;

    const docs = await this.collection
      .find(options)
      .limit(values.page.limit)
      .skip(values.page.offset)
      .toArray();

    const data = docs.map((doc) => createUserChapterHistoryAddapted(doc));

    const total = await this.collection.countDocuments(options);

    const paginate = new Paginate({
      data,
      meta: { total },
    });

    return paginate;
  }

  async create(data: CreateUserChapterHistory) {
    await this.collection.insertOne(data.values);
  }

  async delete(id: string) {
    await this.collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
  }
}
