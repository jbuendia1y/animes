import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserChapterHistoryService } from './user-chapter-history.service';
import { CreateUserChapterHistoryDto } from './dto/create-user-chapter-history.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('user-chapter-history')
export class UserChapterHistoryController {
  constructor(private readonly historyService: UserChapterHistoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('userId') userId: string, @Query('page') page = '1', @Query('limit') limit = '25') {
    return this.historyService.findAll(userId, parseInt(page), parseInt(limit));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateUserChapterHistoryDto) {
    return this.historyService.create(createDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.historyService.delete(id);
  }
}
