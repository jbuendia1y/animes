import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserNotificationsService } from './user-notifications.service';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('user-notifications')
export class UserNotificationsController {
  constructor(private readonly notificationsService: UserNotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('userId') userId: string, @Query('page') page = '1', @Query('limit') limit = '25') {
    return this.notificationsService.findAll(userId, parseInt(page), parseInt(limit));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateUserNotificationDto) {
    return this.notificationsService.create(createDto);
  }

  @Patch(':id/viewed')
  @UseGuards(JwtAuthGuard)
  markAsViewed(@Param('id') id: string) {
    return this.notificationsService.markAsViewed(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}
