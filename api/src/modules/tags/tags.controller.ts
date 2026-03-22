import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto, TagQueryDto, TagResponseDto } from "./dto/tag.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { plainToInstance } from "class-transformer";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@Query() query: TagQueryDto) {
    const { data, meta } = await this.tagsService.findAll(query);
    return {
      data: plainToInstance(TagResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() createTagDto: CreateTagDto) {
    const tag = await this.tagsService.create(createTagDto);
    return plainToInstance(TagResponseDto, tag, {
      excludeExtraneousValues: true,
    });
  }
}
