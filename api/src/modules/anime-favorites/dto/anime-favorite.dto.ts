import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';

export class CreateAnimeFavoriteDto {
  @IsNumber()
  stars: number;

  @IsString()
  animeId: string;
}

export class UpdateAnimeFavoriteDto {
  @IsOptional()
  @IsNumber()
  stars?: number;
}

export class AnimeFavoriteQueryDto {
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

export class AnimeFavoriteResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  stars: number;

  @Expose()
  animeId: string;

  @Expose()
  userId: string;
}
