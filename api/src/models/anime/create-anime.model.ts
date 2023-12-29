import { z } from "../../../deps.ts";
import { CreateIntlTextSchema } from "../intlstring.ts";
import { IAnimeTag, ITitles } from "./anime.model.ts";

export type ICreateAnime = z.infer<typeof CreateAnimeSchema>;

const CreateAnimeStars = z
  .object({
    1: z.number().default(0),
    2: z.number().default(0),
    3: z.number().default(0),
    4: z.number().default(0),
    5: z.number().default(0),
  })
  .default({});

export const CreateAnimeTagSchema = z.object({
  id: z.string(),
  name: CreateIntlTextSchema,
  slug: z.string(),
});

const CreateAnimeSchema = z.object({
  slug: z.string(),
  titles: z.object({
    en: z.string().optional(),
    en_jp: z.string().optional(),
    ja_jp: z.string().optional(),
  }),
  canonicalTitle: z.string(),
  description: z.string(),
  synopsis: z.string(),
  stars: CreateAnimeStars,
  tags: z.array(CreateAnimeTagSchema).nullable(),
  nsfw: z.boolean(),
  showType: z.string(),
  status: z.string(),
  posterImage: z.string().nullable(),
  coverImage: z.string().nullable(),
});

export class CreateAnime {
  private slug: string;
  private titles: ITitles;
  private canonicalTitle: string;
  private synopsis: string;
  private description: string;
  private stars: ICreateAnime["stars"];
  private tags: IAnimeTag[] | null;
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
