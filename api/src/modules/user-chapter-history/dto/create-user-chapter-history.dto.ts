import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserChapterHistoryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chapterId: string;
}
