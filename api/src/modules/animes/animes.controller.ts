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
} from '@nestjs/common';
import { AnimesService } from './animes.service';
import { CreateAnimeDto, UpdateAnimeDto, AnimeQueryDto } from './dto/anime.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('animes')
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Get()
  findAll(@Query() query: AnimeQueryDto) {
    return this.animesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animesService.create(createAnimeDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {
    return this.animesService.update(id, updateAnimeDto);
  }
}
