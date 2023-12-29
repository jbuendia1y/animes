import { z } from "../../../deps.ts";

const CreateUserAnimeSchema = z.object({
  userId: z.string().min(1),
  animeId: z.string().min(1),
});

export type ICreateUserAnime = z.infer<typeof CreateUserAnimeSchema>;

export class CreateUserAnime {
  private userId: string;
  private animeId: string;

  constructor(data: ICreateUserAnime) {
    const parsed = CreateUserAnimeSchema.parse(data);
    this.userId = parsed.userId;
    this.animeId = parsed.animeId;
  }

  get values(): ICreateUserAnime {
    return {
      userId: this.userId,
      animeId: this.animeId,
    };
  }
}
