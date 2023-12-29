import {
  ChapterVideo,
  ChapterVideoFilter,
  CreateChapterVideo,
  UpdateChapterVideo,
} from "../../models/index.ts";

export interface ChapterVideosRepository {
  find(filter: ChapterVideoFilter): Promise<ChapterVideo[]>;

  findOne(id: string): Promise<ChapterVideo | null>;

  save(data: CreateChapterVideo): Promise<void>;

  update(id: string, data: UpdateChapterVideo): Promise<void>;

  delete(id: string): Promise<void>;
}
