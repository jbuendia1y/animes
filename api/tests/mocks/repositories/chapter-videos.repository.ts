import {
  ChapterVideo,
  ChapterVideoFilter,
} from "../../../src/models/chapter-video/chapter-video.model.ts";
import { CreateChapterVideo } from "../../../src/models/chapter-video/create-chapter-video.model.ts";
import { UpdateChapterVideo } from "../../../src/models/chapter-video/update-chapter-video.model.ts";
import { ChapterVideosRepository } from "../../../src/repositories/chapter-videos/chapter-videos.repository.ts";
import { generateChapterVideoMock } from "../data/chapter-videos.ts";

export class MockChapterVideosRepository implements ChapterVideosRepository {
  data: ChapterVideo[] = [
    generateChapterVideoMock(),
    generateChapterVideoMock(),
    generateChapterVideoMock(),
    generateChapterVideoMock(),
    generateChapterVideoMock(),
    generateChapterVideoMock(),
  ];

  find(_filter: ChapterVideoFilter): Promise<ChapterVideo[]> {
    return Promise.resolve(this.data);
  }
  findOne(id: string): Promise<ChapterVideo | null> {
    const video = this.data.find((v) => v.values.id === id);
    return Promise.resolve(video ?? null);
  }
  save(data: CreateChapterVideo): Promise<void> {
    this.data.push(
      new ChapterVideo({
        ...data.values,
        id: crypto.randomUUID(),
      }),
    );
    return Promise.resolve();
  }
  update(id: string, data: UpdateChapterVideo): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);
    this.data[idx] = new ChapterVideo({
      ...this.data[idx].values,
      ...(data.values as Record<string, string>),
    });

    return Promise.resolve();
  }
  delete(id: string): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);
    this.data.splice(idx, 1);
    return Promise.resolve();
  }
}
