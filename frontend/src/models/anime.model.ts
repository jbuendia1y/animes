import { z } from "zod";
import { CreateIntlTextSchema, IntlText } from "./intltext.model";

export interface AnimeEndpoint
  extends Omit<Omit<IAnime, "createdAt">, "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export type AnimeList = Array<Anime>;
export interface AnimeTag {
  id: string;
  slug: string;
  name: IntlText;
}
export type ICreateAnime = z.infer<typeof CreateAnimeSchema>;
const CreateAnimeTagSchema = z.object({
  id: z.string(),
  name: CreateIntlTextSchema,
  slug: z.string(),
});

const CreateAnimeSchema = z.object({
  slug: z.string(),
  titles: CreateIntlTextSchema,
  canonicalTitle: z.string(),
  description: z.string(),
  synopsis: z.string(),
  stars: z
    .object({
      1: z.number().default(0),
      2: z.number().default(0),
      3: z.number().default(0),
      4: z.number().default(0),
      5: z.number().default(0),
    })
    .default({}),
  tags: z.array(CreateAnimeTagSchema).nullable(),
  nsfw: z.boolean(),
  showType: z.string(),
  status: z.string(),
  posterImage: z.string().nullable(),
  coverImage: z.string().nullable(),
});

export class CreateAnime {
  private slug: string;
  private titles: IntlText;
  private canonicalTitle: string;
  private synopsis: string;
  private description: string;
  private stars: ICreateAnime["stars"];
  private tags: AnimeTag[] | null;
  private coverImage: string | null;
  private posterImage: string | null;
  private nsfw: boolean;
  private status: string;
  private showType: string;

  constructor(data: ICreateAnime) {
    const parsed = CreateAnimeSchema.parse(data);
    this.slug = parsed.slug;
    this.titles = parsed.titles;
    this.canonicalTitle = parsed.canonicalTitle;
    this.synopsis = parsed.synopsis;
    this.description = parsed.description;
    this.stars = parsed.stars;
    this.tags = parsed.tags;
    this.coverImage = parsed.coverImage;
    this.posterImage = parsed.posterImage;
    this.nsfw = parsed.nsfw;
    this.status = parsed.status;
    this.showType = parsed.showType;
  }

  get values(): ICreateAnime {
    return {
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
      showType: this.showType,
    };
  }
}

const UpdateAnimeSchema = z.object({
  slug: z.string().optional(),
  titles: CreateIntlTextSchema.optional(),
  canonicalTitle: z.string().optional(),
  description: z.string().optional(),
  synopsis: z.string().optional(),
  tags: z.array(CreateAnimeTagSchema).nullable().optional(),
  nsfw: z.boolean().optional(),
  showType: z.string().optional(),
  status: z.string().optional(),
  posterImage: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
});

export type IUpdateAnime = z.infer<typeof UpdateAnimeSchema>;

export class UpdateAnime {
  private slug?: string;
  private titles?: IntlText;
  private canonicalTitle?: string;
  private description?: string;
  private synopsis?: string;
  private tags?: AnimeTag[] | null;
  private nsfw?: boolean;
  private showType?: string;
  private status?: string;
  private posterImage?: string | null;
  private coverImage?: string | null;

  constructor(data: IUpdateAnime) {
    const parsed = UpdateAnimeSchema.parse(data);
    this.slug = parsed.slug;
    this.titles = parsed.titles;
    this.canonicalTitle = parsed.canonicalTitle;
    this.description = parsed.description;
    this.synopsis = parsed.synopsis;
    this.tags = parsed.tags;
    this.nsfw = parsed.nsfw;
    this.showType = parsed.showType;
    this.status = parsed.status;
    this.posterImage = parsed.posterImage;
    this.coverImage = parsed.coverImage;
  }

  get values(): IUpdateAnime {
    return {
      slug: this.slug,
      titles: this.titles,
      canonicalTitle: this.canonicalTitle,
      description: this.description,
      synopsis: this.synopsis,
      tags: this.tags,
      nsfw: this.nsfw,
      showType: this.showType,
      status: this.status,
      posterImage: this.posterImage,
      coverImage: this.coverImage,
    };
  }
}

export interface IAnime {
  id: string;
  slug: string;
  titles: IntlText;
  canonicalTitle: string;
  synopsis: string;
  description: string;
  stars: ICreateAnime["stars"];
  tags: AnimeTag[] | null;
  posterImage: string | null;
  coverImage: string | null;
  nsfw: boolean;
  status: string;
  createdAt: Date;
  showType: string;
  updatedAt: Date;
}

export class Anime {
  private id: string;
  private slug: string;
  private titles: IntlText;
  private canonicalTitle: string;
  private synopsis: string;
  private description: string;
  private stars: IAnime["stars"];
  private tags: AnimeTag[] | null;
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

  public getAnimeId(): string {
    return this.id;
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
