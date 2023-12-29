export interface UserChapterHistoryEndpoint
  extends Omit<IUserChapterHistory, "createdAt"> {
  createdAt: string;
}

export interface IUserChapterHistory {
  id: string;
  userId: string;
  chapterId: string;
  createdAt: Date;
}

export class UserChapterHistory {
  private id: string;
  private userId: string;
  private chapterId: string;
  private createdAt: Date;

  constructor(data: IUserChapterHistory) {
    this.id = data.id;
    this.userId = data.userId;
    this.chapterId = data.chapterId;
    this.createdAt = data.createdAt;
  }

  get values(): IUserChapterHistory {
    return {
      id: this.id,
      userId: this.userId,
      chapterId: this.chapterId,
      createdAt: this.createdAt,
    };
  }
}
