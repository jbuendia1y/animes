import { Anime, DBAnime } from "../models/index.ts";

export const createAnimeAddapted = (data: DBAnime): Anime => {
  return new Anime({
    id: data._id.toString(),
    slug: data.slug,
    canonicalTitle: data.canonicalTitle,
    coverImage: data.coverImage,
    createdAt: data.createdAt,
    description: data.description,
    stars: data.stars,
    tags: data.tags,
    nsfw: data.nsfw,
    posterImage: data.posterImage,
    showType: data.showType,
    status: data.status,
    synopsis: data.synopsis,
    titles: data.titles,
    updatedAt: data.updatedAt,
  });
};
