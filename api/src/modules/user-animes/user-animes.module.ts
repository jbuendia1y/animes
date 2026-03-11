import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAnimesController } from './user-animes.controller';
import { UserAnimesService } from './user-animes.service';
import { UserAnime, UserAnimeSchema } from './entities/user-anime.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserAnime.name, schema: UserAnimeSchema },
    ]),
  ],
  controllers: [UserAnimesController],
  providers: [UserAnimesService],
  exports: [UserAnimesService],
})
export class UserAnimesModule {}
