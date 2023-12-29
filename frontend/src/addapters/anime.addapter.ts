import { Anime, AnimeEndpoint } from "../models/anime.model";

export const createAnimeAddapted = (ed: AnimeEndpoint): Anime => {
  return new Anime({
    id: ed.id,
    slug: ed.slug,
    canonicalTitle: ed.canonicalTitle,
    titles: ed.titles,
    description: ed.description,
    synopsis: ed.synopsis,
    stars: ed.stars,
    tags: ed.tags,
    coverImage: ed.coverImage,
    posterImage: ed.posterImage,
    nsfw: ed.nsfw,
    showType: ed.showType,
    status: ed.status,
    createdAt: new Date(ed.createdAt),
    updatedAt: new Date(ed.updatedAt),
  });
};
