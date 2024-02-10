import { z } from "zod";

import { ITitles } from "../index.ts";
import { IChapter } from "./chapter.model.ts";

export type ICreateChapter = Omit<
  Omit<Omit<IChapter, "id">, "createdAt">,
  "updatedAt"
>;

const CreateChapterSchema = z.object({
  canonicalTitle: z.string(),
  titles: z.object({
    en: z.string().optional(),
    en_jp: z.string().optional(),
    ja_jp: z.string().optional(),
  }),
  synopsis: z.string(),
  description: z.string(),
  number: z.number(),
  airdate: z.string(),
  thumbnail: z.string(),
  animeId: z.string(),
});

export class CreateChapter {
  private canonicalTitle: string;
  private titles: ITitles;
  private synopsis: string;
  private description: string;
  private number: number;
  private airdate: string;
  private thumbnail: string;
  private animeId: string;

  constructor(data: ICreateChapter) {
    const parsed = CreateChapterSchema.parse(data);
    this.titles = parsed.titles;
    (this.canonicalTitle = parsed.canonicalTitle),
      (this.synopsis = parsed.synopsis);
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
