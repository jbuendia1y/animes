import { ObjectId } from "../../../deps.ts";

export interface DBUserNotification extends Omit<IUserNotification, "id"> {
  _id: ObjectId;
}

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
  private link: string | null;
  private viewed: boolean;

  constructor(data: IUserNotification) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description;
    this.imageLink = data.imageLink;
    this.link = data.link;
    this.viewed = data.viewed;
  }

  get values(): IUserNotification {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      imageLink: this.imageLink,
      link: this.link,
      viewed: this.viewed,
    };
  }
}

export class DeleteUserNotification {
  private id: string;
  private userId: string;

  constructor(data: { id: string; userId: string }) {
    (this.id = data.id), (this.userId = data.userId);
  }

  get values() {
    return {
      id: this.id,
      userId: this.userId,
    };
  }
}

export class UserNotificationsFilter {
  private options: { userId?: string; viewed?: boolean };
  private page: { limit: number; offset: number };

  constructor(filters: {
    options?: { userId?: string; viewed?: boolean };
    page: { limit: number; offset: number };
  }) {
    this.options = filters.options ?? {};
    this.page = filters.page;
  }

  get values() {
    return { options: this.options, page: this.page };
  }
}
