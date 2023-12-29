import { z } from "zod";
import { CreateIntlTextSchema, IntlText } from "./intltext.model";

export interface ChapterEndpoint
  extends Omit<Omit<IChapter, "createdAt">, "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

export type ICreateChapter = Omit<
  Omit<Omit<IChapter, "id">, "createdAt">,
  "updatedAt"
>;

const CreateChapterSchema = z.object({
  canonicalTitle: z.string(),
  titles: CreateIntlTextSchema,
  synopsis: z.string(),
  description: z.string(),
  number: z.number(),
  airdate: z.string(),
  thumbnail: z.string(),
  animeId: z.string(),
});

export class CreateChapter {
  private canonicalTitle: string;
  private titles: IntlText;
  private synopsis: string;
  private description: string;
  private number: number;
  private airdate: string;
  private thumbnail: string;
  private animeId: string;

  constructor(data: ICreateChapter) {
    const parsed = CreateChapterSchema.parse(data);
    this.canonicalTitle = parsed.canonicalTitle;
    this.titles = parsed.titles;
    this.synopsis = parsed.synopsis;
    this.description = parsed.description;
    this.number = parsed.number;
    this.airdate = parsed.airdate;
    this.thumbnail = parsed.thumbnail;
    this.animeId = parsed.animeId;
  }

  get values(): ICreateChapter {
    return {
      canonicalTitle: this.canonicalTitle,
      titles: this.titles,
      synopsis: this.synopsis,
      description: this.description,
      number: this.number,
      airdate: this.airdate,
      thumbnail: this.thumbnail,
      animeId: this.animeId,
    };
  }
}

const UpdateChapterSchema = z.object({
  canonicalTitle: z.string().optional(),
  titles: CreateIntlTextSchema,
  synopsis: z.string().optional(),
  description: z.string().optional(),
  number: z.number().optional(),
  airdate: z.string().optional(),
  thumbnail: z.string().optional(),
});
export type IUpdateChapter = z.infer<typeof UpdateChapterSchema>;

export class UpdateChapter {
  private canonicalTitle?: string;
  private titles: IntlText;
  private synopsis?: string;
  private description?: string;
  private number?: number;
  private airdate?: string;
  private thumbnail?: string;

  constructor(data: IUpdateChapter) {
    const parsed = UpdateChapterSchema.parse(data);
    this.canonicalTitle = parsed.canonicalTitle;
    this.titles = parsed.titles;
    this.synopsis = parsed.synopsis;
    this.description = parsed.description;
    this.number = parsed.number;
    this.airdate = parsed.airdate;
    this.thumbnail = parsed.thumbnail;
  }

  get values(): IUpdateChapter {
    return {
      canonicalTitle: this.canonicalTitle,
      titles: this.titles,
      synopsis: this.synopsis,
      description: this.description,
      number: this.number,
      airdate: this.airdate,
      thumbnail: this.thumbnail,
    };
  }
}

export interface IChapter {
  id: string;
  canonicalTitle: string;
  titles: IntlText;
  synopsis: string;
  description: string;
  number: number;
  airdate: string;
  thumbnail: string;

  animeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Chapter {
  private id: string;
  private canonicalTitle: string;
  private titles: IntlText;
  private synopsis: string;
  private description: string;
  private number: number;
  private airdate: string;
  private thumbnail: string;
  private animeId: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: IChapter) {
    this.id = data.id;
    this.canonicalTitle = data.canonicalTitle;
    this.titles = data.titles;
    this.synopsis = data.synopsis;
    this.description = data.description;
    this.number = data.number;
    this.airdate = data.airdate;
    this.thumbnail = data.thumbnail;
    this.animeId = data.animeId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get values(): IChapter {
    return {
      id: this.id,
      canonicalTitle: this.canonicalTitle,
      titles: this.titles,
      synopsis: this.synopsis,
      description: this.description,
      number: this.number,
      airdate: this.airdate,
      thumbnail: this.thumbnail,
      animeId: this.animeId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
