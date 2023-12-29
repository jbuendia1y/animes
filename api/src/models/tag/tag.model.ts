import { IntlText } from "../intlstring.ts";

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

export class TagFilter {
  private options: { slug?: string };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options?: { slug?: string };
    page: { limit: number; offset: number };
  }) {
    if (filters.page.limit > 300)
      throw new Error("Put a limit no higher than 300 on the page filter");
    this.options = filters.options ?? {};
    this.page = filters.page;
  }

  get values() {
    type stringRegex = string | { $regex?: string };
    const options: { slug?: stringRegex } = {
      slug: this.options.slug,
    };
    if (typeof options.slug === "string")
      options.slug = { $regex: this.options.slug };

    return { options, page: this.page };
  }
}
