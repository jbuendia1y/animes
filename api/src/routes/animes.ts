import { Status } from "../../deps.ts";
import { Router } from "$oak/mod.ts";
import { z } from "zod";
import { ResourceAllReadyExistError } from "../errors/index.ts";
import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { AnimesContoller } from "../controllers/index.ts";
import { container } from "tsyringe";

const controller = container.resolve<AnimesContoller>(AnimesContoller.name);

export const router = new Router({ prefix: API_PREFIX_V1 + "/animes" });

router.get(
  "/",
  handleRouteErrors((ctx, err) => {
    if (err instanceof z.ZodError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: err.issues.map(
          (v) => `Param ${v.path.join(".")} ${v.message}`,
        ),
      };
    }
  }),
  controller.getAnimes.bind(controller),
);

router.get("/:id", controller.getOneAnime.bind(controller));

router.post(
  "/",
  authMiddleware({
    role: "isAdmin",
  }),
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
  controller.createAnime.bind(controller),
);

router.patch(
  "/:id",
  authMiddleware({
    role: "isAdmin",
  }),
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
  controller.updateAnime.bind(controller),
);
