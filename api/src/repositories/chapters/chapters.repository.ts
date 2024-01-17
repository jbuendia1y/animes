import type {
  Chapter,
  ChapterFilter,
  CreateChapter,
  Paginate,
  UpdateChapter,
} from "../../models/index.ts";

export interface ChaptersRepository {
  find(filter: ChapterFilter): Promise<Paginate<Chapter[]>>;

  findOne(id: string): Promise<Chapter | null>;

  save(data: CreateChapter): Promise<void>;

  update(id: string, data: UpdateChapter): Promise<void>;
}
