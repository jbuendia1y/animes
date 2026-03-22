import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { AnimesService } from "./animes.service";
import {
  CreateAnimeDto,
  UpdateAnimeDto,
  AnimeDto,
  AnimeQueryDto,
} from "./dto/anime.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminGuard } from "../../common/guards/admin.guard";
import { plainToInstance } from "class-transformer";

@Controller("animes")
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Get()
  async findAll(@Query() query: AnimeQueryDto) {
    const { data, meta } = await this.animesService.findAll(query);

    return {
      data: plainToInstance(AnimeDto, data, { excludeExtraneousValues: true }),
      meta,
    };
  }

  @Get(":id([0-9a-fA-F]{24})")
  async findOne(@Param("id") id: string) {
    const anime = await this.animesService.findOne(id);
    if (!anime) {
      throw new NotFoundException("Anime not found");
    }

    return plainToInstance(AnimeDto, anime, { excludeExtraneousValues: true });
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAnimeDto: CreateAnimeDto) {
    const anime = await this.animesService.create(createAnimeDto);
    return plainToInstance(AnimeDto, anime, { excludeExtraneousValues: true });
  }

  @Patch(":id([0-9a-fA-F]{24})")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param("id") id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {
    const anime = await this.animesService.update(id, updateAnimeDto);
    return plainToInstance(AnimeDto, anime, { excludeExtraneousValues: true });
  }
}
