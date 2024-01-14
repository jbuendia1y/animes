import { z } from "../../../deps.ts";
import { CreateIntlTextSchema, IntlText } from "../intlstring.ts";
import { IAnimeTag } from "./anime.model.ts";
import { CreateAnimeTagSchema } from "./create-anime.model.ts";

const UpdateStarsAnimeSchema = z.object({
  star: z.number().min(1).max(5),
  type: z.enum(["increment", "decrement"]),
});

const UpdateAnimeSchema = z.object({
  slug: z.string().optional(),
  titles: CreateIntlTextSchema.optional(),
  canonicalTitle: z.string().optional(),
  description: z.string().optional(),
  synopsis: z.string().optional(),
  tags: z.array(CreateAnimeTagSchema).nullable().optional(),
  stars: UpdateStarsAnimeSchema.optional(),
  nsfw: z.boolean().optional(),
  showType: z.string().optional(),
  status: z.string().optional(),
  posterImage: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
});

export type IUpdateAnime = z.infer<typeof UpdateAnimeSchema>;
export type IUpdateStarsAnime = z.infer<typeof UpdateStarsAnimeSchema>;

export class UpdateAnime {
  private slug?: string;
  private titles?: IntlText;
  private canonicalTitle?: string;
  private description?: string;
  private synopsis?: string;
  private tags?: IAnimeTag[] | null;
  private stars?: IUpdateStarsAnime;
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
    this.stars = parsed.stars;
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
      stars: this.stars,
      nsfw: this.nsfw,
      showType: this.showType,
      status: this.status,
      posterImage: this.posterImage,
      coverImage: this.coverImage,
    };
  }
}
