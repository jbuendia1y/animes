export type UserNotificationEndpoint = IUserNotification;

export interface IUserNotification {
  id: string;

  title: string;
  description: string;
  imageLink: string | null;
  link: string | null;
  viewed: boolean;

  userId: string;
}

export class UserNotification {
  private id: string;
  private userId: string;
  private title: string;
  private description: string;
  private imageLink: string | null;
  private viewed: boolean;
  private link: string | null;

  constructor(data: IUserNotification) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description;
    this.imageLink = data.imageLink;
    this.viewed = data.viewed;
    this.link = data.link;
  }

  get values(): IUserNotification {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      imageLink: this.imageLink,
      viewed: this.viewed,
      link: this.link,
    };
  }
}
