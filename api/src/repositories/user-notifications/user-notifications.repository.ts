import type {
  CreateUserNotification,
  DeleteUserNotification,
  Paginate,
  UpdateUserNotification,
  UserNotification,
  UserNotificationsFilter,
} from "../../models/index.ts";

export interface UserNotificationsRepository {
  find(filter: UserNotificationsFilter): Promise<Paginate<UserNotification[]>>;

  save(data: CreateUserNotification): Promise<void>;

  update(id: string, data: UpdateUserNotification): Promise<void>;

  delete(data: DeleteUserNotification): Promise<void>;
}
