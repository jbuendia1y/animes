import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChapterVideoDto {
  @IsOptional()
  @IsString()
  provider?: string;

  @IsString()
  player: string;

  @IsString()
  videoURL: string;

  @IsOptional()
  @IsString()
  embedURL?: string;

  @IsString()
  chapterId: string;
}

export class UpdateChapterVideoDto {
  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  player?: string;

  @IsOptional()
  @IsString()
  videoURL?: string;

  @IsOptional()
  @IsString()
  embedURL?: string;
}

export class ChapterVideoQueryDto {
  @IsOptional()
  @IsString()
  chapterId?: string;

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
