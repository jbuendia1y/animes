import { Router, z, Status } from "../../deps.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { ResourceAllReadyExistError } from "../errors/index.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { AnimeFavoritesController } from "../controllers/index.ts";
import { container } from "npm:tsyringe";

const controller = container.resolve<AnimeFavoritesController>(
  AnimeFavoritesController.name
);

export const router = new Router({
  prefix: API_PREFIX_V1 + "/animes/favorites",
}).use(authMiddleware());

router.get("/", controller.getAnimeFavorites.bind(controller));

router.post(
  "/",
  handleRouteErrors((ctx, err) => {
    if (err instanceof z.ZodError) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: err.issues.map(
          (v) => `Field ${v.path.join(".")} ${v.message}`
        ),
      };
    }
    if (err instanceof ResourceAllReadyExistError) {
      ctx.response.status = Status.Forbidden;
    }
  }),
  controller.createAnimeFavorite.bind(controller)
);

router.patch(
  "/:id",
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
  controller.updateAnimeFavorite.bind(controller)
);

router.delete(
  "/:id",
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
  controller.deleteAnimeFavorite.bind(controller)
);
