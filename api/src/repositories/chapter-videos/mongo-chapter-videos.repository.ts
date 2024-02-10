import { inject, injectable } from "tsyringe";
import {
  Collection as MongoCollection,
  Database as MongoDatabase,
  ObjectId,
} from "mongodb";

import { createChapterVideoAddapted } from "../../addapters/chapter-video.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import {
  ChapterVideo,
  ChapterVideoFilter,
  CreateChapterVideo,
  DBChapterVideo,
  UpdateChapterVideo,
} from "../../models/index.ts";
import { ChapterVideosRepository } from "./chapter-videos.repository.ts";
import { DI_TOKEN } from "../../di.ts";

@injectable()
export class MongoChapterVideosRepository implements ChapterVideosRepository {
  private collection: MongoCollection<DBChapterVideo>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBChapterVideo>("chapter-videos");
  }

  async find(filter: ChapterVideoFilter): Promise<ChapterVideo[]> {
    const { options, page } = filter.values;
    const docs = await this.collection
      .find(options)
      .limit(page.limit)
      .skip(page.offset)
      .toArray();
    const data = docs.map((doc) => createChapterVideoAddapted(doc));
    return data;
  }

  async findOne(id: string): Promise<ChapterVideo | null> {
    const doc = await this.collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });
    if (!doc) return null;

    const data = createChapterVideoAddapted(doc);
    return data;
  }

  async save(data: CreateChapterVideo) {
    const values = data.values;
    const exist = await this.collection.findOne({
      player: values.player,
      chapterId: values.chapterId,
    });

    if (exist) throw new ResourceAllReadyExistError();

    await this.collection.insertOne({
      chapterId: values.chapterId,
      embedURL: values.embedURL,
      player: values.player,
      videoURL: values.videoURL,
    });
  }

  async update(id: string, data: UpdateChapterVideo) {
    await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      { $set: { ...data.values } },
    );
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: ObjectId.createFromHexString(id) });
  }
}

export const DI_REPO = {
  TOKEN: DI_TOKEN.CHAPTER_VIDEOS_REPO,
  VALUE: MongoChapterVideosRepository,
};
