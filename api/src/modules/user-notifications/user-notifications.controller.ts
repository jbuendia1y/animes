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
} from "@nestjs/common";
import { UserNotificationsService } from "./user-notifications.service";
import {
  CreateUserNotificationDto,
  UserNotificationResponseDto,
} from "./dto/create-user-notification.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { plainToInstance } from "class-transformer";

@Controller("users/notifications")
export class UserNotificationsController {
  constructor(
    private readonly notificationsService: UserNotificationsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query("userId") userId: string,
    @Query("page") page = "1",
    @Query("limit") limit = "25",
  ) {
    const { data, meta } = await this.notificationsService.findAll(
      userId,
      parseInt(page),
      parseInt(limit),
    );
    return {
      data: plainToInstance(UserNotificationResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreateUserNotificationDto) {
    const notification = await this.notificationsService.create(createDto);
    return plainToInstance(UserNotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(":id/viewed")
  @UseGuards(JwtAuthGuard)
  async markAsViewed(@Param("id") id: string) {
    return await this.notificationsService.markAsViewed(id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    return await this.notificationsService.delete(id);
  }
}
