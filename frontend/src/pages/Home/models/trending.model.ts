export interface TrendingEndpoint {
  id: string;
  attributes: {
    slug: string;
    canonicalTitle: string;
    posterImage: { original: string } | null;
    coverImage: { original: string } | null;
  };
}

export interface ITrending {
  id: string;
  animeId: string;
  slug: string;
  title: string;
  posterImage: string | null;
  coverImage: string | null;
}

export class Trending {
  private id: string;
  private animeId: string;
  private slug: string;
  private title: string;
  private posterImage: string | null;
  private coverImage: string | null;

  constructor(data: ITrending) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.animeId = data.animeId;
    this.coverImage = data.coverImage;
    this.posterImage = data.posterImage;
  }

  get values(): ITrending {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      animeId: this.animeId,
      coverImage: this.coverImage,
      posterImage: this.posterImage,
    };
  }
}
