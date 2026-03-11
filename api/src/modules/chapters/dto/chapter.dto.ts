import { IsString, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IntlTextDto {
  @IsOptional()
  @IsString()
  en?: string;

  @IsOptional()
  @IsString()
  es?: string;

  @IsOptional()
  @IsString()
  en_jp?: string;

  @IsOptional()
  @IsString()
  ja_jp?: string;
}

export class CreateChapterDto {
  @IsString()
  canonicalTitle: string;

  @ValidateNested()
  @Type(() => IntlTextDto)
  titles: IntlTextDto;

  @IsString()
  synopsis: string;

  @IsString()
  description: string;

  @IsNumber()
  number: number;

  @IsString()
  airdate: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsString()
  animeId: string;
}

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  canonicalTitle?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IntlTextDto)
  titles?: IntlTextDto;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsString()
  airdate?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}

export class ChapterQueryDto {
  @IsOptional()
  @IsString()
  animeId?: string;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  number?: number;

  @IsOptional()
  @IsString()
  sort?: string;

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
