import { useEffect, useState } from "react";
import { UserNotification } from "../../../models/notification.model";
import {
  NotificationsService,
  UserNotificationFilter,
} from "../../../services/notifications.service";

export const useNotifications = (filter?: UserNotificationFilter) => {
  const [{ notifications, loading }, setData] = useState<{
    notifications: UserNotification[] | null;
    loading: boolean;
  }>({
    notifications: null,
    loading: true,
  });

  useEffect(() => {
    let subscribe = true;
    setData((v) => ({ ...v, loading: true }));
    const service = new NotificationsService();
    service.find(filter).then((v) => {
      if (subscribe) setData({ notifications: v.values.data, loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, [filter]);

  return { notifications, loading };
};
