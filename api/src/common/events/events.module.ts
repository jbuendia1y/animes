import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChapterEventsService } from './chapter.events';
import { AnimeFavoriteEventsService } from './anime-favorite.events';
import { Anime, AnimeSchema } from '../../modules/animes/entities/anime.entity';
import { UserNotification, UserNotificationSchema } from '../../modules/user-notifications/entities/user-notification.entity';
import { AnimeFavorite, AnimeFavoriteSchema } from '../../modules/anime-favorites/entities/anime-favorite.entity';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    MongooseModule.forFeature([
      { name: Anime.name, schema: AnimeSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
      { name: AnimeFavorite.name, schema: AnimeFavoriteSchema },
    ]),
  ],
  providers: [ChapterEventsService, AnimeFavoriteEventsService],
  exports: [ChapterEventsService, AnimeFavoriteEventsService],
})
export class EventsModule {}
