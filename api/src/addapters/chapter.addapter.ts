import { Chapter, DBChapter } from "../models/index.ts";

export const createChapterAddapted = (data: DBChapter): Chapter => {
  return new Chapter({
    id: data._id.toString(),
    canonicalTitle: data.canonicalTitle,
    titles: data.titles,
    synopsis: data.synopsis,
    description: data.description,
    thumbnail: data.thumbnail,
    number: data.number,
    airdate: data.airdate,
    animeId: data.animeId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
};
