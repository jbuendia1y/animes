import "npm:reflect-metadata";
import { container } from "npm:tsyringe";
import { authMiddleware } from "../../src/middlewares/auth.middleware.ts";
import { AuthUtils } from "../../src/utils/index.ts";
import { assertEquals, stub, testing } from "../../test.deps.ts";
import { MockUsersRepository } from "../mocks/repositories/users.repository.ts";
import { DI_TOKEN } from "../../src/di.ts";
import { generateUserMock } from "../mocks/data/user.ts";
import { assertNotEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { Status } from "../../deps.ts";

const setupCtx = () =>
  testing.createMockContext({
    path: "/",
  });

const mockMiddlewareDeps = (
  {
    userIdMock,
    findOneMock,
  }: {
    userIdMock: string | null;
    findOneMock: ReturnType<typeof generateUserMock> | null;
  } = { userIdMock: null, findOneMock: null }
) => {
  const usersRepo = new MockUsersRepository();
  container.registerInstance(DI_TOKEN.USERS_REPO, usersRepo);

  const findOneUserMock = stub(usersRepo, "findOne", () =>
    Promise.resolve(findOneMock)
  );
  const userIdFromHeadersMock = stub(AuthUtils, "getUserIdFromHeaders", () =>
    Promise.resolve(userIdMock)
  );

  return {
    restoreMocks: () => {
      userIdFromHeadersMock.restore();
      findOneUserMock.restore();
      container.clearInstances();
    },
  };
};

Deno.test({
  name: "Auth middleware",
  async fn(it) {
    const next = testing.createMockNext();

    await it.step("Should pass as admin", async () => {
      const ctx = setupCtx();
      const userMock = generateUserMock({ isAdmin: true });
      const { restoreMocks } = mockMiddlewareDeps({
        findOneMock: userMock,
        userIdMock: userMock.values.id,
      });
      await authMiddleware({ role: "isAdmin" })(ctx, next);
      assertNotEquals(ctx.response.status, Status.Unauthorized);
      restoreMocks();
    });

    await it.step("Should pass as common user", async () => {
      const ctx = setupCtx();
      const userMock = generateUserMock({ isAdmin: false });
      const { restoreMocks } = mockMiddlewareDeps({
        findOneMock: userMock,
        userIdMock: userMock.values.id,
      });
      await authMiddleware()(ctx, next);
      assertNotEquals(ctx.response.status, Status.Unauthorized);
      restoreMocks();
    });

    await it.step("Common user shouldn't pass to admin side", async () => {
      const ctx = setupCtx();
      const userMock = generateUserMock({ isAdmin: false });
      const { restoreMocks } = mockMiddlewareDeps({
        findOneMock: userMock,
        userIdMock: userMock.values.id,
      });
      await authMiddleware({ role: "isAdmin" })(ctx, next);
      assertEquals(ctx.response.status, Status.Unauthorized);
      restoreMocks();
    });

    await it.step("Admin user should pass to common user side", async () => {
      const ctx = setupCtx();
      const userMock = generateUserMock({ isAdmin: true });
      const { restoreMocks } = mockMiddlewareDeps({
        findOneMock: userMock,
        userIdMock: userMock.values.id,
      });
      await authMiddleware({ role: "isAdmin" })(ctx, next);
      assertNotEquals(ctx.response.status, Status.Unauthorized);
      restoreMocks();
    });

    await it.step(
      "User not logged shouldn't pass to common auth side",
      async () => {
        const ctx = setupCtx();
        const userMock = null;
        const { restoreMocks } = mockMiddlewareDeps({
          findOneMock: userMock,
          userIdMock: null,
        });
        await authMiddleware()(ctx, next);
        assertEquals(ctx.response.status, Status.Unauthorized);
        restoreMocks();
      }
    );

    await it.step(
      "User not logged shouldn't pass to admin auth side",
      async () => {
        const ctx = setupCtx();
        const userMock = null;
        const { restoreMocks } = mockMiddlewareDeps({
          findOneMock: userMock,
          userIdMock: null,
        });
        await authMiddleware({ role: "isAdmin" })(ctx, next);
        assertEquals(ctx.response.status, Status.Unauthorized);
        restoreMocks();
      }
    );
  },
});
