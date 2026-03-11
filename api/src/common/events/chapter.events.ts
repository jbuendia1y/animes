import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Anime, AnimeDocument } from '../../modules/animes/entities/anime.entity';
import { UserNotification, UserNotificationDocument } from '../../modules/user-notifications/entities/user-notification.entity';
import { AnimeFavorite, AnimeFavoriteDocument } from '../../modules/anime-favorites/entities/anime-favorite.entity';

export interface ChapterCreatedPayload {
  _id: Types.ObjectId;
  canonicalTitle: string;
  titles: { en?: string; es?: string; ja_jp?: string };
  number: number;
  animeId: string;
}

@Injectable()
export class ChapterEventsService {
  constructor(
    @InjectModel(Anime.name) private animeModel: Model<AnimeDocument>,
    @InjectModel(UserNotification.name) private notificationModel: Model<UserNotificationDocument>,
    @InjectModel(AnimeFavorite.name) private favoriteModel: Model<AnimeFavoriteDocument>,
  ) {}

  @OnEvent('chapter.created')
  async handleChapterCreated(payload: ChapterCreatedPayload) {
    const anime = await this.animeModel.findById(payload.animeId);
    if (!anime) return;

    const favorites = await this.favoriteModel.find({ animeId: payload.animeId }).exec();

    const notifications = favorites.map((fav) => ({
      userId: fav.userId,
      title: 'Nuevo capítulo disponible',
      description: `Se publicó el capítulo ${payload.number} de ${anime.canonicalTitle}`,
      imageLink: anime.posterImage,
      link: `/anime/${anime.slug}/${payload.number}`,
      viewed: false,
    }));

    if (notifications.length > 0) {
      await this.notificationModel.insertMany(notifications);
    }
  }
}
