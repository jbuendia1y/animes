import "npm:reflect-metadata";
import { UserChapterHistoryController } from "../../src/controllers/user-chapter-history.ts";
import { MockUserChapterHistoryRepository } from "../mocks/repositories/user-chapter-history.repository.ts";
import { generateUserChapterHistoryMock } from "../mocks/data/user-chapter-history.ts";
import { AuthUtils } from "../../src/utils/index.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { Status } from "../../deps.ts";
import { mockRequestBody } from "../utils.ts";

type GETResponseBody = { data: unknown[]; meta: { total: number } };
const TEST_BASE_PATH = API_PREFIX_V1 + "/animes/history";

const setup = (data: { mockUserId?: string | null } = {}) => {
  const mockGetUserIdFromHeader =
    data.mockUserId !== undefined
      ? stub(AuthUtils, "getUserIdFromHeaders", () =>
          Promise.resolve(data.mockUserId as string | null)
        )
      : undefined;

  const userChapterHistoryRepo = new MockUserChapterHistoryRepository();
  const controller = new UserChapterHistoryController(userChapterHistoryRepo);
  return {
    controller,
    userChapterHistoryRepo,
    restoreMocks: () => {
      mockGetUserIdFromHeader?.restore();
    },
  };
};

Deno.test({
  name: "User chapter history routes",
  async fn(it) {
    await it.step("Get user chapter history", async () => {
      const userIdMock = crypto.randomUUID();
      const { controller, userChapterHistoryRepo, restoreMocks } = setup({
        mockUserId: userIdMock,
      });

      const historyMock = [
        generateUserChapterHistoryMock({ userId: userIdMock }),
        generateUserChapterHistoryMock({ userId: userIdMock }),
        generateUserChapterHistoryMock({ userId: userIdMock }),
        generateUserChapterHistoryMock({ userId: userIdMock }),
      ];

      userChapterHistoryRepo.data.push(...historyMock);

      const mockFind = stub(
        userChapterHistoryRepo,
        "find",
        ({ values: filter }) => {
          const data = userChapterHistoryRepo.data.filter(
            (v) => v.values.userId === filter.options.userId
          );

          return Promise.resolve({
            values: {
              data,
              meta: { total: data.length },
            },
            // deno-lint-ignore no-explicit-any
          } as any);
        }
      );

      const ctx = testing.createMockContext<"/">({
        path: TEST_BASE_PATH,
      });

      await controller.getUserChapterHistory(ctx);
      const body = ctx.response.body as GETResponseBody;
      assertEquals(ctx.response.status, Status.OK);
      assertEquals(body.data.length, historyMock.length);
      assertEquals(body.meta.total, historyMock.length);

      restoreMocks();
      mockFind.restore();
    });

    await it.step("Create user chapter history", async (it) => {
      const { controller, restoreMocks } = setup({
        mockUserId: crypto.randomUUID(),
      });
      const setupCtx = (data: { body: unknown } = { body: {} }) =>
        mockRequestBody(
          testing.createMockContext<"/">({
            path: TEST_BASE_PATH,
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(data.body),
          }
        );

      await it.step("Should fail", async () => {
        const ctx = setupCtx();
        await assertRejects(() => controller.createUserChapterHistory(ctx));
      });
      await it.step("Should success", async () => {
        const ctx = setupCtx({
          body: generateUserChapterHistoryMock(),
        });
        await controller.createUserChapterHistory(ctx);
        assertEquals(ctx.response.status, Status.Created);
      });
      restoreMocks();
    });

    await it.step("Delete user chapter history", async () => {
      const { controller, restoreMocks, userChapterHistoryRepo } = setup();
      const ctx = testing.createMockContext<"/:id">({
        path: TEST_BASE_PATH + "/:id",
        method: "DELETE",
        params: {
          id: "",
        },
      });
      userChapterHistoryRepo.data.push(generateUserChapterHistoryMock());

      await controller.deleteUserChapterHistory(ctx);
      assertEquals(ctx.response.status, Status.OK);
      restoreMocks();
    });
  },
});
