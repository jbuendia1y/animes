import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
