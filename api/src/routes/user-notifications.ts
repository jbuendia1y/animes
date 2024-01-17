import { Router, Status, z } from "../../deps.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

import { handleRouteErrors } from "../middlewares/handleRouteErrors.ts";
import { API_PREFIX_V1 } from "../constants.ts";
import { UserNotificationsController } from "../controllers/user-notifications.ts";
import { container } from "npm:tsyringe";

const controller = container.resolve<UserNotificationsController>(
  UserNotificationsController.name,
);

export const router = new Router({
  prefix: API_PREFIX_V1 + "/users/notifications",
}).use(authMiddleware());

router.get("/", controller.getUserNotifications.bind(controller));

router.patch(
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
  controller.updateUserNotification.bind(controller),
);

router.delete("/:id", controller.deleteUserNotification.bind(controller));
