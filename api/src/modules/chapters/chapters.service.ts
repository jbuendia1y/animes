import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Chapter, ChapterDocument } from "./entities/chapter.entity";
import {
  CreateChapterDto,
  UpdateChapterDto,
  ChapterQueryDto,
} from "./dto/chapter.dto";

@Injectable()
export class ChaptersService {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<ChapterDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(query: ChapterQueryDto) {
    const filter: any = {};
    if (query.animeId) filter.animeId = query.animeId;
    if (query.number) filter.number = query.number;

    const limit = query.limit || 25;
    const offset = query.offset || 0;

    const [data, total] = await Promise.all([
      this.chapterModel
        .find(filter)
        .sort(
          query.sort?.createdAt
            ? {
                createdAt:
                  parseInt(query.sort.createdAt.toString()) === 1
                    ? "asc"
                    : "desc",
              }
            : {},
        )
        .limit(limit)
        .skip(offset)
        .exec(),
      this.chapterModel.countDocuments(filter).exec(),
    ]);

    return { data, meta: { total } };
  }

  async findOne(id: string): Promise<ChapterDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.chapterModel.findById(id).exec();
  }

  async create(createChapterDto: CreateChapterDto): Promise<ChapterDocument> {
    const created = new this.chapterModel(createChapterDto);
    const saved = await created.save();

    this.eventEmitter.emit("chapter.created", {
      _id: saved._id,
      canonicalTitle: saved.canonicalTitle,
      titles: saved.titles,
      number: saved.number,
      animeId: saved.animeId,
    });

    return saved;
  }

  async update(
    id: string,
    updateChapterDto: UpdateChapterDto,
  ): Promise<ChapterDocument> {
    const chapter = await this.findOne(id);
    if (!chapter) throw new NotFoundException("Chapter not found");
    Object.assign(chapter, updateChapterDto);
    return chapter.save();
  }
}
