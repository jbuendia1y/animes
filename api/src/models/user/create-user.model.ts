import { z } from "../../../deps.ts";

export interface ICreateUser {
  username: string;
  password: string;
}

const CreateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export class CreateUser {
  private username: string;
  private password: string;

  constructor(data: ICreateUser) {
    const parsed = CreateUserSchema.parse(data);
    this.username = parsed.username;
    this.password = parsed.password;
  }

  setPassword(password: string) {
    this.password = password;
  }

  get values(): ICreateUser {
    return {
      username: this.username,
      password: this.password,
    };
  }
}
