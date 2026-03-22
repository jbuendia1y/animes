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
import { AnimeFavoritesService } from "./anime-favorites.service";
import {
  CreateAnimeFavoriteDto,
  UpdateAnimeFavoriteDto,
  AnimeFavoriteQueryDto,
  AnimeFavoriteResponseDto,
} from "./dto/anime-favorite.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../../common/decorators/current-user.decorator";
import { plainToInstance } from "class-transformer";

@Controller("animes/favorites")
@UseGuards(JwtAuthGuard)
export class AnimeFavoritesController {
  constructor(private readonly animeFavoritesService: AnimeFavoritesService) {}

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query() query: AnimeFavoriteQueryDto,
  ) {
    const { data, meta } = await this.animeFavoritesService.findAll(
      user.id,
      query,
    );
    return {
      data: plainToInstance(AnimeFavoriteResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      meta,
    };
  }

  @Post()
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateAnimeFavoriteDto,
  ) {
    const favorite = await this.animeFavoritesService.create(
      user.id,
      createDto,
    );
    return plainToInstance(AnimeFavoriteResponseDto, favorite, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param("id") id: string,
    @Body() updateDto: UpdateAnimeFavoriteDto,
  ) {
    const favorite = await this.animeFavoritesService.update(
      id,
      user.id,
      updateDto,
    );
    return plainToInstance(AnimeFavoriteResponseDto, favorite, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(":id")
  delete(@CurrentUser() user: CurrentUserData, @Param("id") id: string) {
    return this.animeFavoritesService.delete(id, user.id);
  }
}
