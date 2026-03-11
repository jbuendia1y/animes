import { IsString, IsOptional, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
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

export class CreateTagDto {
  @IsString()
  slug: string;

  @ValidateNested()
  @Type(() => IntlTextDto)
  name: IntlTextDto;

  @ValidateNested()
  @Type(() => IntlTextDto)
  description: IntlTextDto;

  @IsOptional()
  @IsBoolean()
  nsfw?: boolean;
}

export class TagQueryDto {
  @IsOptional()
  @IsString()
  slug?: string;

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
