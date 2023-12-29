import { Router, Status, z } from "../../deps.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { UserChapterHistoryController } from "../controllers/index.ts";
import { container } from "npm:tsyringe";

const controller = container.resolve<UserChapterHistoryController>(
  UserChapterHistoryController.name
);

export const router = new Router({
  prefix: API_PREFIX_V1 + "/animes/history",
}).use(authMiddleware());

router.get("/", controller.getUserChapterHistory.bind(controller));

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
  }),
  controller.createUserChapterHistory.bind(controller)
);

router.delete("/:id", controller.deleteUserChapterHistory.bind(controller));
