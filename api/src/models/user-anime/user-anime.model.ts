import { z } from "../../../deps.ts";

export interface IUserAnime {
  id: string;
  userId: string;
  animeId: string;
}

export class UserAnime {
  private id: string;
  private userId: string;
  private animeId: string;

  constructor(data: IUserAnime) {
    this.id = data.id;
    this.userId = data.userId;
    this.animeId = data.animeId;
  }

  get values(): IUserAnime {
    return {
      id: this.id,
      animeId: this.animeId,
      userId: this.userId,
    };
  }
}

const UserAnimeFilterSchema = z.object({
  options: z.object({
    userId: z.string().optional(),
    animeId: z.string().optional(),
  }),
  page: z.object({
    limit: z.number(),
    offset: z.number(),
  }),
});

export class UserAnimeFilter {
  private options: { userId?: string, animeId?:string };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options: { userId?: string,animeId?:string };
    page: { limit: number; offset: number };
  }) {
    const parsed = UserAnimeFilterSchema.parse(filters);
    this.options = parsed.options;
    this.page = parsed.page;
  }

  get values() {
    const options = {
      userId: this.options.userId,
      animeId: this.options.animeId,
    };

    return { options, page: this.page };
  }
}
