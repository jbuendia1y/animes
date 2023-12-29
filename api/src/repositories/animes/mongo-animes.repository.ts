import { inject, injectable } from "npm:tsyringe";
import { MongoCollection, MongoDatabase, ObjectId } from "../../../deps.ts";
import { createAnimeAddapted } from "../../addapters/anime.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import {
  Anime,
  CreateAnime,
  UpdateAnime,
  AnimeList,
  AnimeFilter,
  Paginate,
  DBAnime,
} from "../../models/index.ts";
import type { AnimesRepository } from "./animes.repository.ts";
import { DI_TOKEN } from "../../di.ts";

@injectable()
export class MongoAnimesRepository implements AnimesRepository {
  private collection: MongoCollection<DBAnime>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBAnime>("animes");
  }

  async find(filter: AnimeFilter): Promise<Paginate<AnimeList>> {
    const values = filter.values;
    const options = values.options;

    const animes = (
      await this.collection
        .find(options)
        .limit(values.page.limit)
        .skip(values.page.offset)
        .toArray()
    ).map((doc) => createAnimeAddapted(doc));

    const total = await this.collection.countDocuments(options);

    return new Paginate({ data: animes, meta: { total: total } });
  }

  async findOne(id: string): Promise<Anime | null> {
    const doc = await this.collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    return doc ? createAnimeAddapted(doc) : null;
  }

  async save(data: CreateAnime) {
    const exist = await this.collection.findOne({ slug: data.values.slug });
    if (exist) throw new ResourceAllReadyExistError();
    await this.collection.insertOne({
      ...data.values,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(id: string, data: UpdateAnime) {
    await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $set: { ...data.values, updatedAt: new Date() },
      }
    );
  }
}
