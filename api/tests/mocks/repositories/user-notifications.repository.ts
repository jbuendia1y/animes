import { Paginate } from "../../../src/models/paginate.ts";
import { CreateUserNotification } from "../../../src/models/user-notification/create-user-notification.model.ts";
import { UpdateUserNotification } from "../../../src/models/user-notification/update-user-notification.model.ts";
import {
  DeleteUserNotification,
  UserNotification,
  UserNotificationsFilter,
} from "../../../src/models/user-notification/user-notification.model.ts";
import { UserNotificationsRepository } from "../../../src/repositories/user-notifications/user-notifications.repository.ts";
import { generateUserNoticiationMock } from "../data/user-notification.ts";

export class MockUserNotificationsRepository
  implements UserNotificationsRepository {
  data: UserNotification[] = [
    generateUserNoticiationMock(),
    generateUserNoticiationMock(),
    generateUserNoticiationMock(),
    generateUserNoticiationMock(),
    generateUserNoticiationMock(),
    generateUserNoticiationMock(),
  ];

  find(
    _filter: UserNotificationsFilter,
  ): Promise<Paginate<UserNotification[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      }),
    );
  }
  save(data: CreateUserNotification): Promise<void> {
    this.data.push(
      new UserNotification({
        ...data.values,
        id: crypto.randomUUID(),
      }),
    );
    return Promise.resolve();
  }
  update(id: string, data: UpdateUserNotification): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);

    this.data[idx] = new UserNotification({
      ...this.data[idx].values,
      ...data.values,
    });

    return Promise.resolve();
  }
  delete(data: DeleteUserNotification): Promise<void> {
    const idx = this.data.findIndex(
      (v) =>
        v.values.id === data.values.id &&
        v.values.userId === data.values.userId,
    );
    this.data.splice(idx, 1);
    return Promise.resolve();
  }
}
