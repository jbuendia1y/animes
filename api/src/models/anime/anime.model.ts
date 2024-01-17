import { z } from "../../../deps.ts";
import { IntlText } from "../intlstring.ts";

export type AnimeList = Array<Anime>;

export interface IAnimeStars {
  [key: number]: number;
}

export interface IAnimeTag {
  id: string;
  slug: string;
  name: IntlText;
}

export interface IAnime {
  id: string;
  slug: string;
  titles: ITitles;
  canonicalTitle: string;
  synopsis: string;
  description: string;
  stars: IAnimeStars;
  tags: IAnimeTag[] | null;
  posterImage: string | null;
  coverImage: string | null;
  nsfw: boolean;
  status: string;
  createdAt: Date;
  showType: string;
  updatedAt: Date;
}

export interface ITitles {
  en?: string;
  en_jp?: string;
  ja_jp?: string;
}

export class Anime {
  private id: string;
  private slug: string;
  private titles: ITitles;
  private canonicalTitle: string;
  private synopsis: string;
  private description: string;
  private stars: IAnimeStars;
  private tags: IAnimeTag[] | null;
  private coverImage: string | null;
  private posterImage: string | null;
  private nsfw: boolean;
  private status: string;
  private createdAt: Date;
  private showType: string;
  private updatedAt: Date;

  constructor(data: IAnime) {
    this.id = data.id;
    this.slug = data.slug;
    this.titles = data.titles;
    this.canonicalTitle = data.canonicalTitle;
    this.synopsis = data.synopsis;
    this.description = data.description;
    this.stars = data.stars;
    this.tags = data.tags;
    this.coverImage = data.coverImage;
    this.posterImage = data.posterImage;
    this.nsfw = data.nsfw;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.showType = data.showType;
    this.updatedAt = data.updatedAt;
  }

  get values(): IAnime {
    return {
      id: this.id,
      slug: this.slug,
      titles: this.titles,
      canonicalTitle: this.canonicalTitle,
      synopsis: this.synopsis,
      description: this.description,
      stars: this.stars,
      tags: this.tags,
      posterImage: this.posterImage,
      coverImage: this.coverImage,
      nsfw: this.nsfw,
      status: this.status,
      createdAt: this.createdAt,
      showType: this.showType,
      updatedAt: this.updatedAt,
    };
  }
}

const AnimeFilterSchema = z.object({
  options: z.object({
    slug: z.string().optional(),
    status: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  page: z.object({
    limit: z.number().max(300),
    offset: z.number(),
  }),
});

export class AnimeFilter {
  private options: { slug?: string; status?: string; tags?: string[] };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options?: { slug?: string; status?: string; tags?: string[] };
    page: { limit: number; offset: number };
  }) {
    const parsed = AnimeFilterSchema.parse({
      options: filters.options ?? {},
      page: filters.page,
    });

    this.options = parsed.options ?? {};
    this.page = parsed.page;
  }

  get values() {
    type stringRegex = string | { $regex?: string };
    const options: {
      slug?: stringRegex;
      status?: stringRegex;
      "tags.slug"?: { $in: string[] };
    } = {
      slug: this.options.slug,
      status: this.options.status,
      "tags.slug": this.options.tags ? { $in: this.options.tags } : undefined,
    };
    if (typeof options.slug === "string") {
      options.slug = { $regex: this.options.slug };
    }

    return { options, page: this.page };
  }
}
