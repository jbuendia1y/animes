import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  NotFoundException,
} from "@nestjs/common";
import { ChaptersService } from "./chapters.service";
import {
  CreateChapterDto,
  UpdateChapterDto,
  ChapterQueryDto,
  ChapterResponseDto,
} from "./dto/chapter.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { plainToInstance } from "class-transformer";

@Controller("chapters")
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  async findAll(@Query() query: ChapterQueryDto) {
    const { data, meta } = await this.chaptersService.findAll(query);
    return {
      data: plainToInstance(ChapterResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Get(":id([0-9a-fA-F]{24})")
  async findOne(@Param("id") id: string) {
    const chapter = await this.chaptersService.findOne(id);
    if (!chapter) {
      throw new NotFoundException("Chapter not found");
    }
    return plainToInstance(ChapterResponseDto, chapter, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createChapterDto: CreateChapterDto) {
    const chapter = await this.chaptersService.create(createChapterDto);
    return plainToInstance(ChapterResponseDto, chapter, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(":id([0-9a-fA-F]{24})")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param("id") id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    const chapter = await this.chaptersService.update(id, updateChapterDto);
    return plainToInstance(ChapterResponseDto, chapter, {
      excludeExtraneousValues: true,
    });
  }
}
