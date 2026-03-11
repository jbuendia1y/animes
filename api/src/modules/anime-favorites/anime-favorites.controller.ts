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
import { AnimeFavoritesService } from './anime-favorites.service';
import {
  CreateAnimeFavoriteDto,
  UpdateAnimeFavoriteDto,
  AnimeFavoriteQueryDto,
} from './dto/anime-favorite.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('animes/favorites')
@UseGuards(JwtAuthGuard)
export class AnimeFavoritesController {
  constructor(private readonly animeFavoritesService: AnimeFavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserData, @Query() query: AnimeFavoriteQueryDto) {
    return this.animeFavoritesService.findAll(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserData, @Body() createDto: CreateAnimeFavoriteDto) {
    return this.animeFavoritesService.create(user.id, createDto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() updateDto: UpdateAnimeFavoriteDto,
  ) {
    return this.animeFavoritesService.update(id, user.id, updateDto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.animeFavoritesService.delete(id, user.id);
  }
}
