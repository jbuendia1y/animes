import {
  Collection as MongoCollection,
  Database as MongoDatabase,
  ObjectId,
} from "mongodb";

import { createUserAddapted } from "../../addapters/user.addapter.ts";
import { ResourceAllReadyExistError } from "../../errors/index.ts";
import { CreateUser, DBUser, IUser, User } from "../../models/index.ts";
import { UsersRepository } from "./users.repository.ts";
import { DI_TOKEN } from "../../di.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class MongoUsersRepository implements UsersRepository {
  private collection: MongoCollection<DBUser>;

  constructor(@inject(DI_TOKEN.DATABASE) database: MongoDatabase) {
    this.collection = database.collection<DBUser>("users");
  }

  async findOne(id: string): Promise<User | null> {
    const doc = await this.collection.findOne({
      _id: ObjectId.createFromHexString(id),
    });

    return doc ? createUserAddapted(doc) : null;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const doc = await this.collection.findOne({
      username,
    });

    return doc ? createUserAddapted(doc) : null;
  }

  async save(data: CreateUser) {
    const values = data.values;
    const exist = await this.collection.findOne({ username: values.username });
    if (exist) throw new ResourceAllReadyExistError();

    await this.collection.insertOne({
      ...values,
      isAdmin: false,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(id: string, data: Partial<IUser>) {
    await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    );
  }
}

export const DI_REPO = {
  TOKEN: DI_TOKEN.USERS_REPO,
  VALUE: MongoUsersRepository,
};
