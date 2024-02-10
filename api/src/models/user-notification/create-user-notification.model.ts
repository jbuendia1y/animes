import { z } from "zod";

const CreateUserNotificationSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageLink: z.string().nullable().optional().default(null),
  link: z.string().nullable().optional().default(null),
  userId: z.string(),
  viewed: z.boolean().default(false),
});

export type ICreateUserNotification = z.infer<
  typeof CreateUserNotificationSchema
>;

export class CreateUserNotification {
  private userId: string;
  private title: string;
  private description: string;
  private imageLink: string | null;
  private link: string | null;
  private viewed: boolean;

  constructor(data: ICreateUserNotification) {
    this.userId = data.userId;
    this.title = data.title;
    this.description = data.description;
    this.imageLink = data.imageLink;
    this.link = data.link;
    this.viewed = data.viewed;
  }

  get values(): ICreateUserNotification {
    return {
      userId: this.userId,
      title: this.title,
      description: this.description,
      imageLink: this.imageLink,
      link: this.link,
      viewed: this.viewed,
    };
  }
}
