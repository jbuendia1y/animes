import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserChapterHistoryService } from "./user-chapter-history.service";
import {
  CreateUserChapterHistoryDto,
  UserChapterHistoryResponseDto,
} from "./dto/create-user-chapter-history.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { plainToInstance } from "class-transformer";
import {
  CurrentUser,
  CurrentUserData,
} from "@/common/decorators/current-user.decorator";

@Controller("animes/history")
export class UserChapterHistoryController {
  constructor(private readonly historyService: UserChapterHistoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query("page") page = "1",
    @Query("limit") limit = "25",
  ) {
    const { data, meta } = await this.historyService.findAll(
      user.id,
      parseInt(page),
      parseInt(limit),
    );
    return {
      data: plainToInstance(UserChapterHistoryResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateUserChapterHistoryDto,
  ) {
    createDto.userId = user.id;
    const history = await this.historyService.create(createDto);
    return plainToInstance(UserChapterHistoryResponseDto, history, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  delete(@Param("id") id: string) {
    return this.historyService.delete(id);
  }
}
