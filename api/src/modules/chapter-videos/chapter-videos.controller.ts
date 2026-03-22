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
  NotFoundException,
} from "@nestjs/common";
import { ChapterVideosService } from "./chapter-videos.service";
import {
  CreateChapterVideoDto,
  UpdateChapterVideoDto,
  ChapterVideoQueryDto,
  ChapterVideoResponseDto,
} from "./dto/chapter-video.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { plainToInstance } from "class-transformer";

@Controller("chapters/videos")
export class ChapterVideosController {
  constructor(private readonly chapterVideosService: ChapterVideosService) {}

  @Get()
  async findAll(@Query() query: ChapterVideoQueryDto) {
    const { data, meta } = await this.chapterVideosService.findAll(query);
    return {
      data: plainToInstance(ChapterVideoResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const video = await this.chapterVideosService.findOne(id);
    if (!video) {
      throw new NotFoundException("Chapter video not found");
    }
    return plainToInstance(ChapterVideoResponseDto, video, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createDto: CreateChapterVideoDto) {
    const video = await this.chapterVideosService.create(createDto);
    return plainToInstance(ChapterVideoResponseDto, video, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateChapterVideoDto,
  ) {
    const video = await this.chapterVideosService.update(id, updateDto);
    return plainToInstance(ChapterVideoResponseDto, video, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param("id") id: string) {
    return this.chapterVideosService.delete(id);
  }
}
