import { faker } from "npm:@faker-js/faker";
import {
  ChapterVideo,
  IChapterVideo,
} from "../../../src/models/chapter-video/index.ts";

export const generateChapterVideoMock = (data: Partial<IChapterVideo> = {}) => {
  return new ChapterVideo({
    id: crypto.randomUUID(),
    chapterId: crypto.randomUUID(),
    embedURL: faker.internet.url({ appendSlash: false }),
    player: faker.company.name(),
    videoURL: faker.internet.url({ appendSlash: false }),
    ...data,
  });
};
