import { inject, injectable } from "npm:tsyringe";
import { createJWT, Payload, RouterContext, Status, z } from "../../deps.ts";
import { JWT_ALG, JWT_KEY } from "../config/index.ts";
import { CreateUser } from "../models/index.ts";
import { UsersRepository } from "../repositories/users/users.repository.ts";
import { AuthUtils } from "../utils/index.ts";
import { DI_TOKEN } from "../di.ts";

@injectable()
export class AuthController {
  constructor(
    @inject(DI_TOKEN.USERS_REPO) private repository: UsersRepository,
  ) {}

  public async login(ctx: RouterContext<"/login">) {
    const result = ctx.request.body({ type: "json" });
    const body = await result.value;
    const loginSchema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const parsed = loginSchema.parse(body);
    const user = await this.repository.findOneByUsername(parsed.username);
    if (!user) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "username or password was wrong" };
      return;
    }

    const equals = await AuthUtils.comparePasswords(
      parsed.password,
      user.values.password,
    );
    if (!equals) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "username or password was wrong" };
      return;
    }

    const date = new Date();
    date.setHours(date.getHours() + 8);
    const payload: Payload = {
      sub: user.values.id,
      exp: date.getTime(),
    };

    const access_token = await createJWT({ alg: JWT_ALG }, payload, JWT_KEY);
    const token_type = "Bearer";

    ctx.response.status = Status.OK;
    ctx.response.body = {
      user: AuthUtils.createExposedUser(user),
      token_type,
      access_token,
    };
  }
  public async register(ctx: RouterContext<"/register">) {
    const result = ctx.request.body({ type: "json" });
    const body = new CreateUser(await result.value);

    const passwordHashed = await AuthUtils.hashPassword(body.values.password);
    body.setPassword(passwordHashed);

    await this.repository.save(body);

    ctx.response.status = Status.Created;
  }
  public async profile(ctx: RouterContext<"/profile">) {
    const user = await AuthUtils.getUserFromHeaders(ctx);

    if (!user) {
      ctx.response.status = Status.Unauthorized;
      return;
    }

    const data = AuthUtils.createExposedUser(user);
    ctx.response.status = Status.OK;
    ctx.response.body = data;
  }
}
