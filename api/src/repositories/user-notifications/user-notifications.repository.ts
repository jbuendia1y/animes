import type {
  UserNotification,
  UserNotificationsFilter,
  CreateUserNotification,
  DeleteUserNotification,
  Paginate,
  UpdateUserNotification,
} from "../../models/index.ts";

export interface UserNotificationsRepository {
  find(filter: UserNotificationsFilter): Promise<Paginate<UserNotification[]>>;

  save(data: CreateUserNotification): Promise<void>;

  update(id: string, data: UpdateUserNotification): Promise<void>;

  delete(data: DeleteUserNotification): Promise<void>;
}
