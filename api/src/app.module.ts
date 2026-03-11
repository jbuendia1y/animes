import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { AuthModule } from "./modules/auth/auth.module";
import { AnimesModule } from "./modules/animes/animes.module";
import { UsersModule } from "./modules/users/users.module";
import { ChaptersModule } from "./modules/chapters/chapters.module";
import { TagsModule } from "./modules/tags/tags.module";
import { UserAnimesModule } from "./modules/user-animes/user-animes.module";
import { UserChapterHistoryModule } from "./modules/user-chapter-history/user-chapter-history.module";
import { UserNotificationsModule } from "./modules/user-notifications/user-notifications.module";
import { ChapterVideosModule } from "./modules/chapter-videos/chapter-videos.module";
import { AnimeFavoritesModule } from "./modules/anime-favorites/anime-favorites.module";
import { EventsModule } from "./common/events/events.module";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      load: [configuration],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("mongoUri"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AnimesModule,
    UsersModule,
    ChaptersModule,
    TagsModule,
    UserAnimesModule,
    UserChapterHistoryModule,
    UserNotificationsModule,
    ChapterVideosModule,
    AnimeFavoritesModule,
    EventsModule,
  ],
})
export class AppModule {}
