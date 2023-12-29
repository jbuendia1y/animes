import { z } from "../../../deps.ts";

const UpdateChapterVideoSchema = z.object({
  provider: z.string().nullable(),
  player: z.string(),
  videoURL: z.string(),
  embedURL: z.string(),
});

export type IUpdateChapterVideo = z.infer<typeof UpdateChapterVideoSchema>;

export class UpdateChapterVideo {
  private provider?: string | null;
  private player?: string;
  private videoURL?: string;
  private embedURL?: string;

  constructor(data: IUpdateChapterVideo) {
    const parsed = UpdateChapterVideoSchema.parse(data);
    this.provider = parsed.provider;
    this.player = parsed.player;
    this.videoURL = parsed.videoURL;
    this.embedURL = parsed.embedURL;
  }

  get values() {
    return {
      provider: this.provider,
      player: this.player,
      videoURL: this.videoURL,
      embedURL: this.embedURL,
    };
  }
}
