import { z } from "zod";

import { CreateIntlTextSchema, IntlText } from "../intlstring.ts";

const UpdateChapterSchema = z.object({
  canonicalTitle: z.string().optional(),
  titles: CreateIntlTextSchema.optional().optional(),
  synopsis: z.string().optional(),
  description: z.string().optional(),
  number: z.number().optional(),
  airdate: z.string().optional(),
  thumbnail: z.string().optional(),
});

type IUpdateChapter = z.infer<typeof UpdateChapterSchema>;

export class UpdateChapter {
  private canonicalTitle?: string;
  private titles?: IntlText;
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
