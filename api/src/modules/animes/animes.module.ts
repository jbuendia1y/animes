import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimesService } from './animes.service';
import { AnimesController } from './animes.controller';
import { Anime, AnimeSchema } from './entities/anime.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Anime.name, schema: AnimeSchema }]),
  ],
  controllers: [AnimesController],
  providers: [AnimesService],
  exports: [AnimesService],
})
export class AnimesModule {}
