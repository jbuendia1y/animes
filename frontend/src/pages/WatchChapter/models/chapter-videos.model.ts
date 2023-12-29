import { z } from "zod";

export interface ChapterVideoEndpoint {
  id: string;
  provider: string | null;
  player: string;

  videoURL: string;
  embedURL: string;

  chapterId: string;
}

export interface IChapterVideo {
  id: string;
  provider: string | null;
  player: string;

  videoURL: string;
  embedURL: string;

  chapterId: string;
}

export class ChapterVideo {
  private id: string;
  private provider: string | null;
  private player: string;

  private videoURL: string;
  private embedURL: string;

  private chapterId: string;

  constructor(data: IChapterVideo) {
    this.id = data.id;
    this.provider = data.provider;
    this.player = data.player;
    this.videoURL = data.videoURL;
    this.embedURL = data.embedURL;
    this.chapterId = data.chapterId;
  }

  get values(): IChapterVideo {
    return {
      id: this.id,
      provider: this.provider,
      player: this.player,
      videoURL: this.videoURL,
      embedURL: this.embedURL,
      chapterId: this.chapterId,
    };
  }
}

const CreateChapterVideoSchema = z.object({
  provider: z.string().nullable(),
  player: z.string(),
  videoURL: z.string(),
  embedURL: z.string(),
  chapterId: z.string(),
});

export type ICreateChapterVideo = z.infer<typeof CreateChapterVideoSchema>;

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

const UpdateChapterVideoSchema = z.object({
  provider: z.string().nullable().optional(),
  player: z.string().optional(),
  videoURL: z.string().optional(),
  embedURL: z.string().optional(),
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

  get values(): IUpdateChapterVideo {
    return {
      provider: this.provider,
      player: this.player,
      videoURL: this.videoURL,
      embedURL: this.embedURL,
    };
  }
}
