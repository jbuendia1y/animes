import { CreateUser } from "../../../src/models/user/create-user.model.ts";
import { User, IUser } from "../../../src/models/user/user.model.ts";
import { UsersRepository } from "../../../src/repositories/users/users.repository.ts";
import { UserMock, generateUserMock } from "../data/user.ts";

export class UserRepositoryForAuthMock {
  findOne(_id: string) {
    return Promise.resolve(UserMock);
  }
}

export class MockUsersRepository implements UsersRepository {
  data: User[] = [
    generateUserMock(),
    generateUserMock(),
    generateUserMock(),
    generateUserMock(),
    generateUserMock(),
  ];

  findOne(id: string): Promise<User | null> {
    return Promise.resolve(this.data.find((v) => v.values.id === id) ?? null);
  }
  findOneByUsername(username: string): Promise<User | null> {
    return Promise.resolve(
      this.data.find((v) => v.values.username === username) ?? null
    );
  }
  save(data: CreateUser): Promise<void> {
    this.data.push(
      new User({
        id: crypto.randomUUID(),
        avatar: null,
        createdAt: new Date(),
        isAdmin: false,
        updatedAt: new Date(),
        ...data.values,
      })
    );
    return Promise.resolve();
  }
  update(id: string, data: Partial<IUser>): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);

    this.data[idx] = new User({
      ...this.data[idx].values,
      ...data,
      updatedAt: new Date(),
    });

    return Promise.resolve();
  }
}
