import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AnimeFavorite, AnimeFavoriteDocument } from './entities/anime-favorite.entity';
import {
  CreateAnimeFavoriteDto,
  UpdateAnimeFavoriteDto,
  AnimeFavoriteQueryDto,
} from './dto/anime-favorite.dto';

@Injectable()
export class AnimeFavoritesService {
  constructor(
    @InjectModel(AnimeFavorite.name)
    private animeFavoriteModel: Model<AnimeFavoriteDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(userId: string, query: AnimeFavoriteQueryDto) {
    const filter: any = { userId };
    if (query.animeId) filter.animeId = query.animeId;

    const limit = query.limit || 25;
    const offset = query.offset || 0;

    const [data, total] = await Promise.all([
      this.animeFavoriteModel.find(filter).limit(limit).skip(offset).exec(),
      this.animeFavoriteModel.countDocuments(filter).exec(),
    ]);

    return { data, meta: { total } };
  }

  async findOne(id: string): Promise<AnimeFavoriteDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.animeFavoriteModel.findById(id).exec();
  }

  async create(userId: string, createDto: CreateAnimeFavoriteDto) {
    const created = new this.animeFavoriteModel({
      ...createDto,
      userId,
    });
    const saved = await created.save();

    this.eventEmitter.emit('anime-favorite.created', {
      animeId: saved.animeId,
      stars: saved.stars,
    });

    return saved;
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateAnimeFavoriteDto,
  ): Promise<AnimeFavoriteDocument> {
    const favorite = await this.findOne(id);
    if (!favorite) throw new NotFoundException('Favorite not found');
    if (favorite.userId !== userId) throw new ForbiddenException('Not authorized');

    const beforeStars = favorite.stars;
    Object.assign(favorite, updateDto);
    const saved = await favorite.save();

    this.eventEmitter.emit('anime-favorite.updated', {
      before: { animeId: saved.animeId, stars: beforeStars },
      toUpdateData: { stars: saved.stars },
    });

    return saved;
  }

  async delete(id: string, userId: string): Promise<void> {
    const favorite = await this.findOne(id);
    if (!favorite) throw new NotFoundException('Favorite not found');
    if (favorite.userId !== userId) throw new ForbiddenException('Not authorized');

    const animeId = favorite.animeId;
    const stars = favorite.stars;

    await this.animeFavoriteModel.deleteOne({ _id: id }).exec();

    this.eventEmitter.emit('anime-favorite.deleted', {
      animeId,
      stars,
    });
  }
}
