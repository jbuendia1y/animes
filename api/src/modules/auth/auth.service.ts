import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('username or password was wrong');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('username or password was wrong');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      user: this.usersService.createExposedUser(user),
      token_type: 'Bearer',
      access_token,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { id: user._id, username: user.username };
  }
}
