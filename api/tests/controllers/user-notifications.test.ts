import "npm:reflect-metadata";
import { UserNotificationsController } from "../../src/controllers/user-notifications.ts";
import { MockUserNotificationsRepository } from "../mocks/repositories/user-notifications.repository.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { AuthUtils } from "../../src/utils/index.ts";
import { generateUserNoticiationMock } from "../mocks/data/user-notification.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { Status } from "../../deps.ts";
import { mockRequestBody } from "../utils.ts";

type GETResponseBody = { data: unknown[]; meta: { total: number } };
const TEST_BASE_PATH = API_PREFIX_V1 + "/animes/history";

const setup = ({ mockUserId }: { mockUserId?: string | null } = {}) => {
  const userNotificationsRepo = new MockUserNotificationsRepository();
  const controller = new UserNotificationsController(userNotificationsRepo);

  const userIdAuthMock = mockUserId !== undefined
    ? stub(AuthUtils, "getUserIdFromHeaders", () => Promise.resolve(mockUserId))
    : undefined;

  return {
    controller,
    userNotificationsRepo,
    restoreMocks: () => {
      userIdAuthMock?.restore();
    },
  };
};

Deno.test({
  name: "User notifications routes",
  async fn(it) {
    await it.step("Get notifications", async (it) => {
      const userIdMock = crypto.randomUUID();
      const { controller, restoreMocks, userNotificationsRepo } = setup({
        mockUserId: userIdMock,
      });

      const setupCtx = (query: Record<string, string>) =>
        testing.createMockContext<"/">({
          path: TEST_BASE_PATH + "?" + new URLSearchParams(query).toString(),
        });

      const findMock = stub(
        userNotificationsRepo,
        "find",
        ({ values: filter }) => {
          const data = userNotificationsRepo.data.filter(
            (v) =>
              v.values.viewed === filter.options.viewed &&
              v.values.userId === filter.options.userId,
          );
          return Promise.resolve({
            values: {
              data,
              meta: { total: data.length },
            },
            // deno-lint-ignore no-explicit-any
          } as any);
        },
      );

      await it.step("Should return viewed resources", async () => {
        const ctx = setupCtx({ viewed: "true" });
        const notificationsMock = Array(4)
          .fill(0)
          .map(() =>
            generateUserNoticiationMock({ userId: userIdMock, viewed: true })
          );
        userNotificationsRepo.data.push(...notificationsMock);

        await controller.getUserNotifications(ctx);
        const body = ctx.response.body as GETResponseBody;
        assertEquals(ctx.response.status, Status.OK);
        assertEquals(body.data.length, notificationsMock.length);
        assertEquals(body.meta.total, notificationsMock.length);
      });

      await it.step("Should return no viewed resources", async () => {
        const ctx = setupCtx({ viewed: "false" });
        const notificationsMock = Array(4)
          .fill(0)
          .map(() =>
            generateUserNoticiationMock({ userId: userIdMock, viewed: false })
          );

        userNotificationsRepo.data.push(...notificationsMock);

        await controller.getUserNotifications(ctx);
        const body = ctx.response.body as GETResponseBody;
        assertEquals(ctx.response.status, Status.OK);
        assertEquals(body.data.length, notificationsMock.length);
        assertEquals(body.meta.total, notificationsMock.length);
      });

      findMock.restore();
      restoreMocks();
    });
    await it.step("Update notifications", async (it) => {
      const setupCtx = ({ id, body }: { id: string; body: unknown }) =>
        mockRequestBody(
          testing.createMockContext<"/:id">({
            path: TEST_BASE_PATH + "/:id",
            params: { id },
          }),
          { type: "json", value: Promise.resolve(body) },
        );

      const userIdMock = crypto.randomUUID();
      await it.step("Should success", async () => {
        const { controller, restoreMocks, userNotificationsRepo } = setup({
          mockUserId: userIdMock,
        });
        const notificationMock = generateUserNoticiationMock({
          userId: userIdMock,
          viewed: false,
        });
        const ctx = setupCtx({
          id: notificationMock.values.id,
          body: { viewed: true },
        });

        userNotificationsRepo.data.push(notificationMock);

        await controller.updateUserNotification(ctx);
        restoreMocks();
      });
      await it.step("Should fail", async () => {
        const { controller, restoreMocks, userNotificationsRepo } = setup({
          mockUserId: userIdMock,
        });
        const notificationMock = generateUserNoticiationMock({
          userId: userIdMock,
          viewed: false,
        });
        const ctx = setupCtx({
          id: notificationMock.values.id,
          body: { BAD_FIELD: true },
        });

        userNotificationsRepo.data.push(notificationMock);

        await assertRejects(() => controller.updateUserNotification(ctx));
        restoreMocks();
      });
    });
    await it.step("Delete notifications", async () => {
      const userIdMock = crypto.randomUUID();
      const { controller, restoreMocks, userNotificationsRepo } = setup({
        mockUserId: userIdMock,
      });

      const notificationMock = generateUserNoticiationMock({
        userId: userIdMock,
      });

      userNotificationsRepo.data.push(notificationMock);

      const ctx = testing.createMockContext<"/:id">({
        path: TEST_BASE_PATH + "/:id",
        params: {
          id: notificationMock.values.id,
        },
      });

      await controller.deleteUserNotification(ctx);
      assertEquals(ctx.response.status, Status.OK);
      restoreMocks();
    });
  },
});
