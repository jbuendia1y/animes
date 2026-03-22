import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsObject,
} from "class-validator";
import { Type, Expose, Transform } from "class-transformer";

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

export class ChapterQuerySortDto {
  createdAt?: -1 | 1;
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
  @IsObject()
  sort?: ChapterQuerySortDto;

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

export interface IntlText {
  en?: string;
  es?: string;
  en_jp?: string;
  ja_jp?: string;
}

export class ChapterResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  canonicalTitle: string;

  @Expose()
  titles: IntlText;

  @Expose()
  synopsis: string;

  @Expose()
  description: string;

  @Expose()
  number: number;

  @Expose()
  airdate: string;

  @Expose()
  thumbnail: string;

  @Expose()
  animeId: string;
}
