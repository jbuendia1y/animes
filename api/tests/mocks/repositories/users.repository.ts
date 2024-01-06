// import { CreateUser } from "../../../src/models/user/create-user.model.ts";
// import { User, IUser } from "../../../src/models/user/user.model.ts";
// import { UsersRepository } from "../../../src/repositories/users/users.repository.ts";
import { UserMock } from "../data/user.ts";

export class UserRepositoryForAuthMock {
  findOne(_id: string) {
    return Promise.resolve(UserMock);
  }
}

/* export class MockUsersRepository implements UsersRepository {
  findOne(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  findOneByUsername(username: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  save(data: CreateUser): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: Partial<IUser>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
 */
