import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserAnime, UserAnimeDocument } from './entities/user-anime.entity';
import { CreateUserAnimeDto, UserAnimeQueryDto } from './dto/user-anime.dto';

@Injectable()
export class UserAnimesService {
  constructor(
    @InjectModel(UserAnime.name) private userAnimeModel: Model<UserAnimeDocument>,
  ) {}

  async findAll(userId: string, query: UserAnimeQueryDto) {
    const filter: any = { userId };
    if (query.animeId) filter.animeId = query.animeId;

    const limit = query.limit || 25;
    const offset = query.offset || 0;

    const [data, total] = await Promise.all([
      this.userAnimeModel.find(filter).limit(limit).skip(offset).exec(),
      this.userAnimeModel.countDocuments(filter).exec(),
    ]);

    return { data, meta: { total } };
  }

  async create(userId: string, createDto: CreateUserAnimeDto) {
    const created = new this.userAnimeModel({ ...createDto, userId });
    return created.save();
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.userAnimeModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId,
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('User anime not found');
    }
  }
}
