import { ChapterVideo } from "../models/chapter-video/chapter-video.model.ts";
import { DBChapterVideo } from "../models/chapter-video/db-chapter-video.model.ts";

export const createChapterVideoAddapted = (
  data: DBChapterVideo,
): ChapterVideo => {
  return new ChapterVideo({
    id: data._id.toString(),
    videoURL: data.videoURL,
    embedURL: data.embedURL,
    player: data.player,
    provider: data.provider,
    chapterId: data.chapterId,
  });
};
