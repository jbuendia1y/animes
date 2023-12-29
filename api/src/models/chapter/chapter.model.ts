import { z } from "../../../deps.ts";
import { ITitles } from "../anime/index.ts";

export interface IChapter {
  id: string;
  canonicalTitle: string;
  titles: ITitles;
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
  private titles: ITitles;
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

const ChapterFilterSchema = z.object({
  options: z
    .object({
      animeId: z.string().optional(),
      number: z.number().optional(),
    })
    .default({}),
  sort: z
    .object({ createdAt: z.number().max(1).min(-1).optional() })
    .default({}),
  page: z.object({
    limit: z.number().min(0).max(300),
    offset: z.number(),
  }),
});

export class ChapterFilter {
  private options: { animeId?: string; number?: number };
  private sort: { createdAt?: number };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options?: { animeId?: string; number?: number };
    sort?: { createdAt?: number };
    page: { limit: number; offset: number };
  }) {
    const parsed = ChapterFilterSchema.parse(filters);
    this.options = parsed.options;
    this.sort = parsed.sort;
    this.page = parsed.page;
  }

  get values() {
    return { options: this.options, page: this.page, sort: this.sort };
  }
}
