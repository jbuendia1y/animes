import { z } from "zod";

const UpdateAnimeFavoriteSchema = z.object({
  stars: z.number().min(1).max(5),
});

export type IUpdateAnimeFavorite = z.infer<typeof UpdateAnimeFavoriteSchema>;

export class UpdateAnimeFavorite {
  private stars: number;

  constructor(data: IUpdateAnimeFavorite) {
    const parsed = UpdateAnimeFavoriteSchema.parse(data);
    this.stars = parsed.stars;
  }

  get values(): IUpdateAnimeFavorite {
    return {
      stars: this.stars,
    };
  }
}
