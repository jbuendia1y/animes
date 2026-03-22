import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';

export class CreateUserAnimeDto {
  @IsString()
  animeId: string;
}

export class UserAnimeQueryDto {
  @IsOptional()
  @IsString()
  animeId?: string;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}

export class UserAnimeResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  userId: string;

  @Expose()
  animeId: string;
}
