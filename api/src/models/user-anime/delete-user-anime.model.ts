import { z } from "zod";

const DeleteUserAnimeSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
});

export type IDeleteUserAnime = z.infer<typeof DeleteUserAnimeSchema>;

export class DeleteUserAnime {
  private id: string;
  private userId: string;

  constructor(data: IDeleteUserAnime) {
    this.id = data.id;
    this.userId = data.userId;
  }

  get values(): IDeleteUserAnime {
    return {
      id: this.id,
      userId: this.userId,
    };
  }
}
