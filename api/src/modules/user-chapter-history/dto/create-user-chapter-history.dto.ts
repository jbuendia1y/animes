import { IsString, IsNotEmpty, IsEmpty } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class CreateUserChapterHistoryDto {
  @IsEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chapterId: string;
}

export class UserChapterHistoryResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  userId: string;

  @Expose()
  chapterId: string;
}
