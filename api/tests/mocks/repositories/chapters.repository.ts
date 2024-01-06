import {
  ChapterFilter,
  Chapter,
} from "../../../src/models/chapter/chapter.model.ts";
import { CreateChapter } from "../../../src/models/chapter/create-chapter.model.ts";
import { UpdateChapter } from "../../../src/models/chapter/update-chapter.model.ts";
import { Paginate } from "../../../src/models/paginate.ts";
import { ChaptersRepository } from "../../../src/repositories/chapters/chapters.repository.ts";
import { generateChapterMock } from "../data/chapter.ts";

export class MockChaptersRepository implements ChaptersRepository {
  data: Chapter[] = [
    generateChapterMock(),
    generateChapterMock(),
    generateChapterMock(),
    generateChapterMock(),
  ];

  find(_filter: ChapterFilter): Promise<Paginate<Chapter[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      })
    );
  }

  findOne(id: string): Promise<Chapter | null> {
    const chapter = this.data.find((v) => v.values.id === id);
    return Promise.resolve(chapter ?? null);
  }

  save(data: CreateChapter): Promise<void> {
    this.data.push(
      new Chapter({
        ...data.values,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        createdAt: new Date(),
      })
    );
    return Promise.resolve();
  }

  update(id: string, data: UpdateChapter): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);

    this.data[idx] = new Chapter({
      ...this.data[idx].values,
      ...data.values,
      updatedAt: new Date(),
    });

    return Promise.resolve();
  }
}
