import { Router, Status, z } from "../../deps.ts";

import { ResourceAllReadyExistError } from "../errors/index.ts";
import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { ChaptersController } from "../controllers/index.ts";
import { container } from "npm:tsyringe";

const controller = container.resolve<ChaptersController>(
  ChaptersController.name
);

export const router = new Router({ prefix: API_PREFIX_V1 + "/chapters" });

router.get(
  "/",
  handleRouteErrors((ctx, err) => {
    if (err instanceof z.ZodError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = err.issues.map((v) => ({
        field: v.path,
        reason: v.message,
      }));
    }
  }),
  controller.getChapters.bind(controller)
);

router.get("/:id", controller.getOneChapter.bind(controller));

router.post(
  "/",
  async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        ctx.response.status = Status.BadRequest;
        ctx.response.body = {
          message: err.issues.map(
            (v) => `Field ${v.path.join(".")} ${v.message}`
          ),
        };
      }
      if (err instanceof ResourceAllReadyExistError) {
        ctx.response.status = Status.BadRequest;
        ctx.response.body = { message: "Resource all ready exist" };
      }
    }
  },
  controller.createChapter.bind(controller)
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
          (v) => `Field ${v.path.join(".")} ${v.message}`
        ),
      };
    }
  }),
  controller.updateChapter.bind(controller)
);
