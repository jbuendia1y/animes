import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Anime, AnimeDocument } from '../../modules/animes/entities/anime.entity';
import { AnimeFavorite, AnimeFavoriteDocument } from '../../modules/anime-favorites/entities/anime-favorite.entity';

export interface AnimeFavoritePayload {
  animeId: string;
  stars: number;
}

export interface AnimeFavoriteUpdatePayload {
  before: { animeId: string; stars: number };
  toUpdateData: { stars: number };
}

@Injectable()
export class AnimeFavoriteEventsService {
  constructor(
    @InjectModel(Anime.name) private animeModel: Model<AnimeDocument>,
    @InjectModel(AnimeFavorite.name) private favoriteModel: Model<AnimeFavoriteDocument>,
  ) {}

  @OnEvent('anime-favorite.created')
  async handleFavoriteCreated(payload: AnimeFavoritePayload) {
    const starField = `stars.${payload.stars}`;
    await this.animeModel.updateOne(
      { _id: new Types.ObjectId(payload.animeId) },
      { $inc: { [starField]: 1 } },
    );
  }

  @OnEvent('anime-favorite.updated')
  async handleFavoriteUpdated(payload: AnimeFavoriteUpdatePayload) {
    if (payload.before.stars !== payload.toUpdateData.stars) {
      const decrementField = `stars.${payload.before.stars}`;
      const incrementField = `stars.${payload.toUpdateData.stars}`;

      await this.animeModel.updateOne(
        { _id: new Types.ObjectId(payload.before.animeId) },
        {
          $inc: {
            [decrementField]: -1,
            [incrementField]: 1,
          },
        },
      );
    }
  }

  @OnEvent('anime-favorite.deleted')
  async handleFavoriteDeleted(payload: { animeId: string; stars: number }) {
    const starField = `stars.${payload.stars}`;
    await this.animeModel.updateOne(
      { _id: new Types.ObjectId(payload.animeId) },
      { $inc: { [starField]: -1 } },
    );
  }
}
