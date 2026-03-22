import { IsString, MinLength, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsString()
  locale?: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  locale?: string;
}

export class UserResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  avatar: string;

  @Expose()
  isAdmin: boolean;

  @Expose()
  locale: string;
}
