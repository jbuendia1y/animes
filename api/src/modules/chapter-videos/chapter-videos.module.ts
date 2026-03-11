import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterVideosService } from './chapter-videos.service';
import { ChapterVideosController } from './chapter-videos.controller';
import { ChapterVideo, ChapterVideoSchema } from './entities/chapter-video.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChapterVideo.name, schema: ChapterVideoSchema },
    ]),
  ],
  controllers: [ChapterVideosController],
  providers: [ChapterVideosService],
  exports: [ChapterVideosService],
})
export class ChapterVideosModule {}
