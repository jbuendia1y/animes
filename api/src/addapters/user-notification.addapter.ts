import { DBUserNotification, UserNotification } from "../models/index.ts";

export const createUserNotificationAddapted = (
  data: DBUserNotification
): UserNotification => {
  return new UserNotification({
    id: data._id.toString(),
    title: data.title,
    description: data.description,
    imageLink: data.imageLink,
    link: data.link,
    userId: data.userId,
  });
};
