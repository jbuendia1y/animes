import { z } from "../../../deps.ts";

interface ICreateChapterVideo {
  provider: string | null;
  player: string;

  videoURL: string;
  embedURL: string;

  chapterId: string;
}

const CreateChapterVideoSchema = z.object({
  provider: z.string().nullable(),
  player: z.string(),
  videoURL: z.string(),
  embedURL: z.string(),
  chapterId: z.string(),
});

export class CreateChapterVideo {
  private provider: string | null;
  private player: string;
  private videoURL: string;
  private embedURL: string;
  private chapterId: string;

  constructor(data: ICreateChapterVideo) {
    const parsed = CreateChapterVideoSchema.parse(data);

    this.provider = parsed.provider;
    this.player = parsed.player;
    this.videoURL = parsed.videoURL;
    this.embedURL = parsed.embedURL;
    this.chapterId = parsed.chapterId;
  }

  get values(): ICreateChapterVideo {
    return {
      provider: this.provider,
      player: this.player,
      videoURL: this.videoURL,
      embedURL: this.embedURL,
      chapterId: this.chapterId,
    };
  }
}
