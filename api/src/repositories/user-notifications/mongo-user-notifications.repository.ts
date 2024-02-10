import {
  Collection as MongoCollection,
  Database as MongoDatabase,
  ObjectId,
} from "mongodb";
import { createUserNotificationAddapted } from "../../addapters/user-notification.addapter.ts";
import {
  CreateUserNotification,
  DBUserNotification,
  DeleteUserNotification,
  Paginate,
  UpdateUserNotification,
  UserNotification,
  UserNotificationsFilter,
} from "../../models/index.ts";
import { UserNotificationsRepository } from "./user-notifications.repository.ts";
import { DI_TOKEN } from "../../di.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class MongoUserNotificationsRepository
  implements UserNotificationsRepository {
  private collection: MongoCollection<DBUserNotification>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBUserNotification>(
      "user-notifications",
    );
  }

  async find(
    filter: UserNotificationsFilter,
  ): Promise<Paginate<UserNotification[]>> {
    const docs = await this.collection.find(filter.values.options).toArray();
    const data = docs.map((doc) => createUserNotificationAddapted(doc));

    const total = await this.collection.countDocuments(filter.values.options);
    const paginate = new Paginate({ data, meta: { total } });

    return paginate;
  }

  async save(data: CreateUserNotification) {
    const values = data.values;
    await this.collection.insertOne(values);
  }

  async update(id: string, data: UpdateUserNotification) {
    await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $set: data.values,
      },
    );
  }

  async delete(data: DeleteUserNotification) {
    await this.collection.deleteOne({
      _id: ObjectId.createFromHexString(data.values.id),
      userId: data.values.userId,
    });
  }
}

export const DI_REPO = {
  TOKEN: DI_TOKEN.USER_NOTIFICATIONS_REPO,
  VALUE: MongoUserNotificationsRepository,
};
