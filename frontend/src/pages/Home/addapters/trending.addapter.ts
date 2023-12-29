import { Trending, TrendingEndpoint } from "../models/trending.model";

export const createTrendingAddapter = (ed: TrendingEndpoint): Trending => {
  return new Trending({
    id: ed.id,
    title: ed.attributes.canonicalTitle,
    slug: ed.attributes.slug,
    coverImage: ed.attributes.coverImage?.original || null,
    posterImage: ed.attributes.posterImage?.original || null,
    animeId: "",
  });
};
