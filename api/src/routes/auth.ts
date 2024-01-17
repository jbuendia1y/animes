import { Router, Status, z } from "../../deps.ts";
import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";

import { ResourceAllReadyExistError } from "../errors/index.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { AuthController } from "../controllers/index.ts";
import { container } from "npm:tsyringe";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware.ts";

const controller = container.resolve<AuthController>(AuthController.name);

export const router = new Router({ prefix: API_PREFIX_V1 + "/auth" });

router.post(
  "/login",
  rateLimitMiddleware({ breakTime: 60_000, limit: 15 }),
  handleRouteErrors((ctx, err) => {
    if (err instanceof z.ZodError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: err.issues.map(
          (v) => `Field ${v.path.join(".")} ${v.message}`,
        ),
      };
    }
  }),
  controller.login.bind(controller),
);

router.post(
  "/register",
  handleRouteErrors((ctx, err) => {
    if (err instanceof z.ZodError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: err.issues.map(
          (v) => `Field ${v.path.join(".")} ${v.message}`,
        ),
      };
    }
    if (err instanceof ResourceAllReadyExistError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "This username is already taken" };
    }
  }),
  controller.register.bind(controller),
);

router.get("/profile", authMiddleware(), controller.profile.bind(controller));
