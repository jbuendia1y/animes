import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserAnimesService } from './user-animes.service';
import { CreateUserAnimeDto, UserAnimeQueryDto } from './dto/user-anime.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../common/decorators/current-user.decorator';

@Controller('users/animes')
@UseGuards(JwtAuthGuard)
export class UserAnimesController {
  constructor(private readonly userAnimesService: UserAnimesService) {}

  @Get()
  findAll(@CurrentUser() user: CurrentUserData, @Query() query: UserAnimeQueryDto) {
    return this.userAnimesService.findAll(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserData, @Body() createDto: CreateUserAnimeDto) {
    return this.userAnimesService.create(user.id, createDto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: CurrentUserData, @Param('id') id: string) {
    return this.userAnimesService.delete(id, user.id);
  }
}
