import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChapterVideo, ChapterVideoDocument } from './entities/chapter-video.entity';
import {
  CreateChapterVideoDto,
  UpdateChapterVideoDto,
  ChapterVideoQueryDto,
} from './dto/chapter-video.dto';

@Injectable()
export class ChapterVideosService {
  constructor(
    @InjectModel(ChapterVideo.name)
    private chapterVideoModel: Model<ChapterVideoDocument>,
  ) {}

  async findAll(query: ChapterVideoQueryDto) {
    const filter: any = {};
    if (query.chapterId) filter.chapterId = query.chapterId;

    const limit = Math.min(query.limit || 25, 300);
    const offset = query.offset || 0;

    const [data, total] = await Promise.all([
      this.chapterVideoModel.find(filter).limit(limit).skip(offset).exec(),
      this.chapterVideoModel.countDocuments(filter).exec(),
    ]);

    return { data, meta: { total } };
  }

  async findOne(id: string): Promise<ChapterVideoDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.chapterVideoModel.findById(id).exec();
  }

  async create(
    createDto: CreateChapterVideoDto,
  ): Promise<ChapterVideoDocument> {
    const created = new this.chapterVideoModel(createDto);
    return created.save();
  }

  async update(
    id: string,
    updateDto: UpdateChapterVideoDto,
  ): Promise<ChapterVideoDocument> {
    const video = await this.findOne(id);
    if (!video) throw new NotFoundException('Chapter video not found');
    Object.assign(video, updateDto);
    return video.save();
  }

  async delete(id: string): Promise<void> {
    const video = await this.findOne(id);
    if (!video) throw new NotFoundException('Chapter video not found');
    await this.chapterVideoModel.deleteOne({ _id: id }).exec();
  }
}
