import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimeFavoritesService } from './anime-favorites.service';
import { AnimeFavoritesController } from './anime-favorites.controller';
import { AnimeFavorite, AnimeFavoriteSchema } from './entities/anime-favorite.entity';
import { Anime, AnimeSchema } from '../animes/entities/anime.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnimeFavorite.name, schema: AnimeFavoriteSchema },
      { name: Anime.name, schema: AnimeSchema },
    ]),
  ],
  controllers: [AnimeFavoritesController],
  providers: [AnimeFavoritesService],
  exports: [AnimeFavoritesService],
})
export class AnimeFavoritesModule {}
