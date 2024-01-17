import { Router, Status, z } from "../../deps.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { ResourceAllReadyExistError } from "../errors/index.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { UserAnimesController } from "../controllers/index.ts";
import { container } from "npm:tsyringe";

const controller = container.resolve<UserAnimesController>(
  UserAnimesController.name,
);

export const router = new Router({
  prefix: API_PREFIX_V1 + "/users/animes",
}).use(authMiddleware());

router.get("/", controller.getUserAnimes.bind(controller));

router.post(
  "/",
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
      ctx.response.status = Status.Forbidden;
    }
  }),
  controller.createUserAnimes.bind(controller),
);

router.delete(
  "/:id",
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
  controller.deleteUserAnimes.bind(controller),
);
