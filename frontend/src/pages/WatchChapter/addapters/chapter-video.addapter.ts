import { ChapterVideo, ChapterVideoEndpoint } from "../models";

export const createChapterVideoAddapted = (
  ed: ChapterVideoEndpoint
): ChapterVideo => {
  return new ChapterVideo({
    id: ed.id,
    provider: ed.provider,
    player: ed.player,
    embedURL: ed.embedURL,
    videoURL: ed.videoURL,
    chapterId: ed.chapterId,
  });
};
