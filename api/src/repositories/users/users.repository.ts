import type { CreateUser, IUser, User } from "../../models/index.ts";

export interface UsersRepository {
  findOne(id: string): Promise<User | null>;

  findOneByUsername(username: string): Promise<User | null>;

  save(data: CreateUser): Promise<void>;

  update(id: string, data: Partial<IUser>): Promise<void>;
}
