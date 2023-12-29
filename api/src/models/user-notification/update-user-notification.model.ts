import { z } from "../../../deps.ts";

export const UpdateUserNotificationSchema = z.object({
  viewed: z.boolean(),
});

export type IUpdateUserNotification = z.infer<
  typeof UpdateUserNotificationSchema
>;

export class UpdateUserNotification {
  private viewed: boolean;

  constructor(data: IUpdateUserNotification) {
    const parsed = UpdateUserNotificationSchema.parse(data);
    this.viewed = parsed.viewed;
  }

  get values(): IUpdateUserNotification {
    return {
      viewed: this.viewed,
    };
  }
}
