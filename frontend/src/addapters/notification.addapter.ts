import {
  UserNotification,
  UserNotificationEndpoint,
} from "../models/notification.model";

export const createNotificationAddapted = (
  data: UserNotificationEndpoint
): UserNotification => {
  return new UserNotification({
    id: data.id,
    title: data.title,
    description: data.description,
    imageLink: data.imageLink,
    link: data.link,
    viewed: data.viewed,
    userId: data.userId,
  });
};
