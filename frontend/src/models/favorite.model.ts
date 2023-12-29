import { z } from "zod";

export interface DBFavorite {
  id: string;
  stars: number;
  animeId: string;
  userId: string;
}

export interface IFavorite {
  id: string;
  stars: number;
  animeId: string;
  userId: string;
}

export class Favorite {
  private id: string;
  private stars: number;
  private animeId: string;
  private userId: string;

  constructor(data: IFavorite) {
    this.id = data.id;
    this.stars = data.stars;
    this.animeId = data.animeId;
    this.userId = data.userId;
  }

  get values(): IFavorite {
    return {
      id: this.id,
      stars: this.stars,
      animeId: this.animeId,
      userId: this.userId,
    };
  }
}

const CreateFavoriteSchema = z.object({
  stars: z.number().min(1),
  animeId: z.string(),
});

export type ICreateFavorite = z.infer<typeof CreateFavoriteSchema>;

export class CreateFavorite {
  private animeId: string;
  private stars: number;

  constructor(data: ICreateFavorite) {
    this.animeId = data.animeId;
    this.stars = data.stars;
  }

  get values(): ICreateFavorite {
    return {
      stars: this.stars,
      animeId: this.animeId,
    };
  }
}

const UpdateFavoriteSchema = z.object({
  stars: z.number().min(1),
});

export type IUpdateFavorite = z.infer<typeof UpdateFavoriteSchema>;

export class UpdateFavorite {
  private stars: number;

  constructor(data: IUpdateFavorite) {
    this.stars = data.stars;
  }

  get values(): IUpdateFavorite {
    return {
      stars: this.stars,
    };
  }
}
