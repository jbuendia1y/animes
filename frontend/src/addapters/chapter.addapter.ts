import { Chapter, ChapterEndpoint } from "../models/chapter.model";

export const createChapterAddapted = (ed: ChapterEndpoint): Chapter => {
  return new Chapter({
    id: ed.id,
    canonicalTitle: ed.canonicalTitle,
    titles: ed.titles,
    description: ed.description,
    synopsis: ed.synopsis,
    airdate: ed.airdate,
    number: ed.number,
    thumbnail: ed.thumbnail,
    animeId: ed.animeId,
    createdAt: new Date(ed.createdAt),
    updatedAt: new Date(ed.updatedAt),
  });
};
