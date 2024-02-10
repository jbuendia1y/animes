import { inject, injectable } from "tsyringe";
import {
  Collection as MongoCollection,
  Database as MongoDatabase,
  ObjectId,
} from "mongodb";

import { createAnimeFavoriteAddapted } from "../../addapters/anime-favorite.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import {
  AnimeFavorite,
  AnimeFavoriteFilter,
  CreateAnimeFavorite,
  DBAnimeFavorite,
  Paginate,
  UpdateAnimeFavorite,
} from "../../models/index.ts";
import { AnimeFavoritesRepository } from "./anime-favorites.repository.ts";
import { DI_TOKEN } from "../../di.ts";

@injectable()
export class MongoAnimeFavoritesRepository implements AnimeFavoritesRepository {
  private collection: MongoCollection<DBAnimeFavorite>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBAnimeFavorite>("anime-favorites");
  }

  async find(filter: AnimeFavoriteFilter): Promise<Paginate<AnimeFavorite[]>> {
    const { options, page } = filter.values;
    const favorites = (
      await this.collection
        .find(options)
        .limit(page.limit)
        .skip(page.offset)
        .toArray()
    ).map((doc) => createAnimeFavoriteAddapted(doc));

    const total = await this.collection.countDocuments(options);

    return new Paginate({ data: favorites, meta: { total } });
  }

  async findOne(id: string): Promise<AnimeFavorite | null> {
    const doc = await this.collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    if (!doc) return null;

    const data = createAnimeFavoriteAddapted(doc);
    return data;
  }

  async update(id: string, data: UpdateAnimeFavorite): Promise<void> {
    await this.collection.updateOne(
      {
        _id: ObjectId.createFromHexString(id),
      },
      { $set: data.values },
    );
  }

  async save(data: CreateAnimeFavorite): Promise<void> {
    const values = data.values;

    const exist = await this.collection.findOne({
      animeId: values.animeId,
      userId: values.userId,
    });

    if (exist) throw new ResourceAllReadyExistError();

    await this.collection.insertOne(values);
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
  }
}

export const DI_REPO = {
  TOKEN: DI_TOKEN.ANIMES_FAVORITES_REPO,
  VALUE: MongoAnimeFavoritesRepository,
};
