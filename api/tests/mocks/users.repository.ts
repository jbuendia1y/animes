import { UserMock } from "./user.ts";

export class UserRepositoryForAuthMock {
  findOne(_id: string) {
    return Promise.resolve(UserMock);
  }
}
