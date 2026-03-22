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
import { UserAnimesService } from "./user-animes.service";
import {
  CreateUserAnimeDto,
  UserAnimeQueryDto,
  UserAnimeResponseDto,
} from "./dto/user-anime.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../../common/decorators/current-user.decorator";
import { plainToInstance } from "class-transformer";

@Controller("users/animes")
@UseGuards(JwtAuthGuard)
export class UserAnimesController {
  constructor(private readonly userAnimesService: UserAnimesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query() query: UserAnimeQueryDto,
  ) {
    const { data, meta } = await this.userAnimesService.findAll(user.id, query);
    return {
      data: plainToInstance(UserAnimeResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Post()
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateUserAnimeDto,
  ) {
    const userAnime = await this.userAnimesService.create(user.id, createDto);
    return plainToInstance(UserAnimeResponseDto, userAnime, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  delete(@CurrentUser() user: CurrentUserData, @Param("id") id: string) {
    return this.userAnimesService.delete(id, user.id);
  }
}
