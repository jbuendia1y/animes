import { Router, Status, z } from "../../deps.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { ResourceAllReadyExistError } from "../errors/index.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { ChapterVideosController } from "../controllers/index.ts";
import { container } from "npm:tsyringe";

const controller = container.resolve<ChapterVideosController>(
  ChapterVideosController.name,
);

export const router = new Router({
  prefix: API_PREFIX_V1 + "/chapters/videos",
});

router.get("/", controller.getChapterVideos.bind(controller));

router.get("/:id", controller.getOneChapterVideo.bind(controller));

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
  controller.createChapterVideo.bind(controller),
);

router.delete(
  "/:id",
  authMiddleware({
    role: "isAdmin",
  }),
  controller.deleteChapterVideo.bind(controller),
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
  controller.updateChapterVideo.bind(controller),
);
