import { z } from "zod";
import { CreateIntlTextSchema, IntlText } from "./intltext.model";

export type ICreateTag = z.infer<typeof CreateTagSchema>;

const CreateTagSchema = z.object({
  slug: z.string(),
  name: CreateIntlTextSchema,
  description: CreateIntlTextSchema,
  nsfw: z.boolean(),
});

export class CreateTag {
  private slug: string;
  private name: IntlText;
  private description: IntlText;
  private nsfw: boolean;

  constructor(data: ICreateTag) {
    const parsed = CreateTagSchema.parse(data);
    this.slug = parsed.slug;
    this.name = parsed.name;
    this.description = parsed.description;
    this.nsfw = parsed.nsfw;
  }

  get values(): ICreateTag {
    return {
      slug: this.slug,
      name: this.name,
      description: this.description,
      nsfw: this.nsfw,
    };
  }
}

export interface TagEndpoint {
  id: string;
  slug: string;
  name: IntlText;
  description: IntlText;
  nsfw: boolean;
}

export interface ITag {
  id: string;
  slug: string;
  name: IntlText;
  description: IntlText;
  nsfw: boolean;
}

export class Tag {
  private id: string;
  private slug: string;
  private name: IntlText;
  private description: IntlText;
  private nsfw: boolean;

  constructor(data: ITag) {
    this.id = data.id;
    this.slug = data.slug;
    this.name = data.name;
    this.description = data.description;
    this.nsfw = data.nsfw;
  }

  get values(): ITag {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      description: this.description,
      nsfw: this.nsfw,
    };
  }
}
