import { z } from "zod";

import { CreateIntlTextSchema, IntlText } from "../intlstring.ts";

const UpdateTagSchema = z.object({
  slug: z.string().optional(),
  name: CreateIntlTextSchema.optional(),
  description: CreateIntlTextSchema.optional(),
  nsfw: z.boolean().optional(),
});

export type IUpdateTag = z.infer<typeof UpdateTagSchema>;

export class UpdateTag {
  private slug?: string;
  private name?: IntlText;
  private description?: IntlText;
  private nsfw?: boolean;

  constructor(data: IUpdateTag) {
    const parsed = UpdateTagSchema.parse(data);
    this.slug = parsed.slug;
    this.name = parsed.name;
    this.description = parsed.description;
    this.nsfw = parsed.nsfw;
  }

  get values(): IUpdateTag {
    return {
      slug: this.slug,
      name: this.name,
      description: this.description,
      nsfw: this.nsfw,
    };
  }
}
