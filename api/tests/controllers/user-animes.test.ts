import "npm:reflect-metadata";
import { UserAnimesController } from "../../src/controllers/user-animes.ts";
import { MockUserAnimesRepository } from "../mocks/repositories/user-anime.repository.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { mockRequestBody } from "../utils.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { generateUserAnimeMock } from "../mocks/data/user-anime.ts";
import { Status } from "../../deps.ts";
import { AuthUtils } from "../../src/utils/index.ts";

const TEST_BASE_PATH = API_PREFIX_V1 + "/users/animes";

const setup = () => {
  const userAnimesRepo = new MockUserAnimesRepository();
  const controller = new UserAnimesController(userAnimesRepo);
  return { controller, userAnimesRepo };
};

Deno.test({
  name: "User animes routes",
  async fn(it) {
    let userIdMock = crypto.randomUUID();
    const mockAuthHeader = stub(AuthUtils, "getUserIdFromHeaders", () =>
      Promise.resolve(userIdMock)
    );

    await it.step("Get user animes", async () => {
      const { controller, userAnimesRepo } = setup();
      const userAnimesMock = [
        generateUserAnimeMock({ userId: userIdMock }),
        generateUserAnimeMock({ userId: userIdMock }),
        generateUserAnimeMock({ userId: userIdMock }),
        generateUserAnimeMock({ userId: userIdMock }),
      ];
      userAnimesRepo.data.push(...userAnimesMock);

      const findMock = stub(userAnimesRepo, "find", ({ values: filter }) => {
        const data = userAnimesRepo.data.filter(
          (v) => v.values.userId === filter.options.userId
        );
        return Promise.resolve({
          values: {
            data: data,
            meta: { total: data.length },
          },
          // deno-lint-ignore no-explicit-any
        } as any);
      });

      const ctx = testing.createMockContext<"/">({
        path: TEST_BASE_PATH,
      });
      await controller.getUserAnimes(ctx);
      const body = ctx.response.body as {
        data: unknown[];
        meta: { total: number };
      };
      assertEquals(ctx.response.status, Status.OK);
      assertEquals(body.meta.total, userAnimesMock.length);
      assertEquals(body.data.length, userAnimesMock.length);
      findMock.restore();
    });
    await it.step("Create user animes", async (it) => {
      userIdMock = crypto.randomUUID();
      const { controller } = setup();

      const setupCtx = (data: { body: unknown }) => {
        const { body = null } = data;
        return mockRequestBody(
          testing.createMockContext<"/">({
            path: TEST_BASE_PATH,
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(body),
          }
        );
      };

      await it.step("Should fail", async () => {
        const ctx = setupCtx({ body: {} });
        await assertRejects(() => controller.createUserAnimes(ctx));
      });

      await it.step("Should success", async () => {
        const mock = generateUserAnimeMock();
        const ctx = setupCtx({ body: { ...mock } });
        await controller.createUserAnimes(ctx);

        assertEquals(ctx.response.status, Status.Created);
      });
    });
    await it.step("Delete user anime", async () => {
      const { controller, userAnimesRepo } = setup();
      const mock = generateUserAnimeMock();
      userIdMock = mock.values.userId;
      userAnimesRepo.data.push(mock);

      const ctx = testing.createMockContext<"/:id">({
        path: TEST_BASE_PATH + "/:id",
        params: {
          id: mock.values.id,
        },
      });

      await controller.deleteUserAnimes(ctx);
      assertEquals(ctx.response.status, Status.OK);
    });
    mockAuthHeader.restore();
  },
});
