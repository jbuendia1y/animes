import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { Chapter, ChapterSchema } from './entities/chapter.entity';
import { Anime, AnimeSchema } from '../animes/entities/anime.entity';
import { UserNotification, UserNotificationSchema } from '../user-notifications/entities/user-notification.entity';
import { AnimeFavorite, AnimeFavoriteSchema } from '../anime-favorites/entities/anime-favorite.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Anime.name, schema: AnimeSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
      { name: AnimeFavorite.name, schema: AnimeFavoriteSchema },
    ]),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
