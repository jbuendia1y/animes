import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "./dto/user.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  CurrentUserData,
} from "../../common/decorators/current-user.decorator";
import { plainToInstance } from "class-transformer";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get(":id([0-9a-fA-F]{24})")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(":id([0-9a-fA-F]{24})")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
