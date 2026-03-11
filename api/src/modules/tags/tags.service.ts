import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './entities/tag.entity';
import { CreateTagDto, TagQueryDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async findAll(query: TagQueryDto) {
    const filter: any = {};
    if (query.slug) filter.slug = { $regex: query.slug };

    const limit = Math.min(query.limit || 25, 300);
    const offset = query.offset || 0;

    const [data, total] = await Promise.all([
      this.tagModel.find(filter).limit(limit).skip(offset).exec(),
      this.tagModel.countDocuments(filter).exec(),
    ]);

    return { data, meta: { total } };
  }

  async create(createTagDto: CreateTagDto): Promise<TagDocument> {
    const existing = await this.tagModel.findOne({ slug: createTagDto.slug });
    if (existing) throw new ConflictException('Tag with this slug already exists');

    const created = new this.tagModel(createTagDto);
    return created.save();
  }
}
