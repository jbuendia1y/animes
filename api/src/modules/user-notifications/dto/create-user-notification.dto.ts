import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateUserNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  imageLink?: string;

  @IsString()
  @IsOptional()
  link?: string;
}

export class UserNotificationResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  userId: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  imageLink: string;

  @Expose()
  link: string;

  @Expose()
  viewed: boolean;
}
