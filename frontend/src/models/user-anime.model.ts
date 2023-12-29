import { z } from "zod";

const CreateUserAnimeSchema = z.object({
  animeId: z.string().min(1),
});

export type ICreateUserAnime = z.infer<typeof CreateUserAnimeSchema>;

export class CreateUserAnime {
  private animeId: string;

  constructor(data: ICreateUserAnime) {
    const parsed = CreateUserAnimeSchema.parse(data);
    this.animeId = parsed.animeId;
  }

  get values(): ICreateUserAnime {
    return {
      animeId: this.animeId,
    };
  }
}

export interface IUserAnime {
  id: string;
  animeId: string;
  userId: string;
}

export interface DBUserAnime {
  id: string;
  animeId: string;
  userId: string;
}

export class UserAnime {
  private id: string;
  private animeId: string;
  private userId: string;

  constructor(data: IUserAnime) {
    this.id = data.id;
    this.animeId = data.animeId;
    this.userId = data.userId;
  }

  get values(): IUserAnime {
    return {
      id: this.id,
      animeId: this.animeId,
      userId: this.userId,
    };
  }
}
