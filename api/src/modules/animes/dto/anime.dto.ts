import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  IsNumber,
  ValidateNested,
  Min,
  Max,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

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

class AnimeTagDto {
  @IsString()
  id: string;

  @IsString()
  slug: string;

  @ValidateNested()
  @Type(() => IntlTextDto)
  name: IntlTextDto;
}

export class CreateAnimeDto {
  @IsString()
  slug: string;

  @ValidateNested()
  @Type(() => IntlTextDto)
  titles: IntlTextDto;

  @IsString()
  canonicalTitle: string;

  @IsString()
  synopsis: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  stars?: { [key: number]: number };

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnimeTagDto)
  tags?: AnimeTagDto[];

  @IsOptional()
  @IsString()
  posterImage?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  nsfw?: boolean;

  @IsString()
  showType: string;

  @IsString()
  status: string;
}

export class UpdateAnimeStarsDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  star: number;

  @IsEnum(["increment", "decrement"])
  type: "increment" | "decrement";
}

export class UpdateAnimeDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IntlTextDto)
  titles?: IntlTextDto;

  @IsOptional()
  @IsString()
  canonicalTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnimeTagDto)
  tags?: AnimeTagDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAnimeStarsDto)
  stars?: UpdateAnimeStarsDto;

  @IsOptional()
  @IsBoolean()
  nsfw?: boolean;

  @IsOptional()
  @IsString()
  showType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  posterImage?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}

export class AnimeQuerySortDto {
  createdAt?: -1 | 1;
}

export class AnimeQueryDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsObject()
  sort?: AnimeQuerySortDto;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  tags?: string;

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
