import { IsString, IsOptional, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';

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

export interface IntlText {
  en?: string;
  es?: string;
  en_jp?: string;
  ja_jp?: string;
}

export class TagResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  slug: string;

  @Expose()
  name: IntlText;

  @Expose()
  description: IntlText;

  @Expose()
  nsfw: boolean;
}
