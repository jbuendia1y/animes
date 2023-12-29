import { bcrypt } from "../deps.ts";
import { CreateUser } from "../src/models/index.ts";
import { UsersRepository } from "../src/repositories/users.repository.ts";

const main = async () => {
  const userRepository = new UsersRepository();
  const username = prompt("username: ");
  const password = prompt("password: ");

  if (!username || !password)
    throw new Error("username and password is required");

  const body = new CreateUser({ username, password });
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(body.values.password, salt);
  body.setPassword(passwordHashed);

  await userRepository.save(body);

  const user = await userRepository.findOneByUsername(username);
  if (!user) throw new Error("Something was wrong getting user");

  await userRepository.update(user.values.id, { isAdmin: true });
};

if (import.meta.main) await main();
