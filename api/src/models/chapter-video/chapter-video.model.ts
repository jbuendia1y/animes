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

export class ChapterVideoFilter {
  private options: { chapterId?: string };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options?: { chapterId?: string };
    page: { limit: number; offset: number };
  }) {
    if (filters.page.limit > 300) {
      throw new Error("Put a limit no higher than 300 on the page filter");
    }
    this.options = filters.options ?? {};
    this.page = filters.page;
  }

  get values() {
    return { options: this.options, page: this.page };
  }
}
