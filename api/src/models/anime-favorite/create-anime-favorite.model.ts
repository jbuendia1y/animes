import { z } from "../../../deps.ts";

const CreateAnimeFavoriteSchema = z.object({
  stars: z.number().min(1).max(5),
  animeId: z.string(),
  userId: z.string(),
});

export type ICreateAnimeFavorite = z.infer<typeof CreateAnimeFavoriteSchema>;

export class CreateAnimeFavorite {
  private stars: number;
  private animeId: string;
  private userId: string;

  constructor(data: ICreateAnimeFavorite) {
    const parsed = CreateAnimeFavoriteSchema.parse(data);
    this.stars = parsed.stars;
    this.animeId = parsed.animeId;
    this.userId = parsed.userId;
  }

  get values(): ICreateAnimeFavorite {
    return {
      stars: this.stars,
      animeId: this.animeId,
      userId: this.userId,
    };
  }
}
