import {
  Collection as MongoCollection,
  Database as MongoDatabase,
  ObjectId,
} from "mongodb";

import { createUserAnimeAddapted } from "../../addapters/user-anime.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import { Paginate } from "../../models/index.ts";
import {
  CreateUserAnime,
  DBUserAnime,
  DeleteUserAnime,
  UserAnime,
  UserAnimeFilter,
} from "../../models/user-anime/index.ts";
import { UserAnimesRepository } from "./user-anime.repository.ts";
import { DI_TOKEN } from "../../di.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class MongoUserAnimesRepository implements UserAnimesRepository {
  private collection: MongoCollection<DBUserAnime>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBUserAnime>("user-animes");
  }

  async find(filter: UserAnimeFilter): Promise<Paginate<UserAnime[]>> {
    const { options, page } = filter.values;
    const favorites = (
      await this.collection
        .find({
          ...options,
        })
        .limit(page.limit)
        .skip(page.offset)
        .toArray()
    ).map((doc) => createUserAnimeAddapted(doc));

    const total = await this.collection.countDocuments(options);

    return new Paginate({ data: favorites, meta: { total } });
  }

  async save(data: CreateUserAnime): Promise<void> {
    const values = data.values;

    const exist = await this.collection.findOne({
      userId: values.userId,
      animeId: values.animeId,
    });
    if (exist) {
      throw new ResourceAllReadyExistError();
    }

    await this.collection.insertOne(values);
  }

  async delete(data: DeleteUserAnime): Promise<void> {
    const values = data.values;

    await this.collection.deleteOne({
      _id: ObjectId.createFromHexString(values.id),
      userId: values.userId,
    });
  }
}

export const DI_REPO = {
  TOKEN: DI_TOKEN.USER_ANIMES_REPO,
  VALUE: MongoUserAnimesRepository,
};
