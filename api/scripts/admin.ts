import "npm:reflect-metadata";
import { MongoClient } from "../deps.ts";
import { CreateUser } from "../src/models/user/index.ts";
import { MongoUsersRepository } from "../src/repositories/users/mongo-users.repository.ts";
import { config } from "../src/config/index.ts";
import { AuthUtils } from "../src/utils/index.ts";

const main = async () => {
  const client = new MongoClient();
  const mongoDatabase = await client.connect(config.MONGO_URI);
  const userRepository = new MongoUsersRepository(mongoDatabase);

  const username = prompt("username: ");
  const password = prompt("password: ");

  if (!username || !password)
    throw new Error("username and password is required");

  const body = new CreateUser({ username, password });

  const passwordHashed = await AuthUtils.hashPassword(body.values.password);
  body.setPassword(passwordHashed);

  await userRepository.save(body);

  const user = await userRepository.findOneByUsername(username);
  if (!user) throw new Error("Something was wrong getting user");

  await userRepository.update(user.values.id, { isAdmin: true });
};

if (import.meta.main) await main();
