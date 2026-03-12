import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChapterVideosService } from './chapter-videos.service';
import {
  CreateChapterVideoDto,
  UpdateChapterVideoDto,
  ChapterVideoQueryDto,
} from './dto/chapter-video.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('chapters/videos')
export class ChapterVideosController {
  constructor(private readonly chapterVideosService: ChapterVideosService) {}

  @Get()
  findAll(@Query() query: ChapterVideoQueryDto) {
    return this.chapterVideosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterVideosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createDto: CreateChapterVideoDto) {
    return this.chapterVideosService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id') id: string, @Body() updateDto: UpdateChapterVideoDto) {
    return this.chapterVideosService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id') id: string) {
    return this.chapterVideosService.delete(id);
  }
}
