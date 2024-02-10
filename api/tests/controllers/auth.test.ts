import "npm:reflect-metadata";
import { AuthController } from "../../src/controllers/auth.ts";
import { MockUsersRepository } from "../mocks/repositories/users.repository.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { generateUserMock } from "../mocks/data/user.ts";
import { mockRequestBody } from "../utils.ts";
import { Status } from "../../deps.ts";
import { container } from "tsyringe";
import { DI_TOKEN } from "../../src/di.ts";
import { AuthUtils } from "../../src/utils/index.ts";

const setup = () => {
  container.clearInstances();
  const usersRepo = new MockUsersRepository();
  container.registerInstance(DI_TOKEN.USERS_REPO, usersRepo);
  const controller = new AuthController(usersRepo);
  return {
    usersRepo,
    controller,
  };
};

Deno.test({
  name: "Auth routes",
  async fn(it) {
    const commonUser = generateUserMock();
    await it.step("Login", async (it) => {
      const ctx = testing.createMockContext<"/login">({
        path: API_PREFIX_V1 + "/auth/login",
      });

      const ctxWithBody = mockRequestBody(ctx, {
        type: "json",
        value: Promise.resolve({
          username: commonUser.values.username,
          password: commonUser.values.password,
        }),
      });
      const mockComparePassword = stub(
        AuthUtils,
        "comparePasswords",
        (hashed, input) => Promise.resolve(hashed === input),
      );

      await it.step("Should fail", async () => {
        const { controller } = setup();
        await controller.login(ctxWithBody);
        assertEquals(ctxWithBody.response.status, Status.BadRequest);
      });

      await it.step("Should success", async () => {
        const { controller, usersRepo } = setup();
        usersRepo.data.push(commonUser);
        await controller.login(ctxWithBody);
        assertEquals(ctxWithBody.response.status, Status.OK);
      });
      mockComparePassword.restore();
    });
    await it.step("Register", async (it) => {
      const ctx = testing.createMockContext<"/register">({
        path: API_PREFIX_V1 + "/auth/register",
      });

      const { controller } = setup();
      await it.step("Should success", async () => {
        const ctxWithBody = mockRequestBody(ctx, {
          type: "json",
          value: Promise.resolve({
            username: commonUser.values.username,
            password: commonUser.values.password,
          }),
        });
        await controller.register(ctxWithBody);
        assertEquals(ctxWithBody.response.status, Status.Created);
      });
      await it.step("Should fail", async () => {
        const ctxWithBody = mockRequestBody(ctx, {
          type: "json",
          value: Promise.resolve({
            username: commonUser.values.username,
            [Symbol.for("password")]: crypto.randomUUID(),
          }),
        });
        await assertRejects(() => {
          return controller.register(ctxWithBody);
        });
      });
    });
    await it.step("Profile", async (it) => {
      const { usersRepo, controller } = setup();
      usersRepo.data.push(commonUser);

      await it.step("Should success", async () => {
        const mockComparePassword = stub(
          AuthUtils,
          "comparePasswords",
          (hashed, input) => Promise.resolve(hashed === input),
        );

        // Getting token
        const loginCtx = mockRequestBody(
          testing.createMockContext<"/login">({
            path: API_PREFIX_V1 + "/auth/login",
          }),
          {
            type: "json",
            value: Promise.resolve({
              username: commonUser.values.username,
              password: commonUser.values.password,
            }),
          },
        );
        await controller.login(loginCtx);
        const loginResBody = loginCtx.response.body as { access_token: string };

        const ctx = testing.createMockContext<"/profile">({
          path: API_PREFIX_V1 + "/auth/profile",
          headers: [["Authorization", "Bearer " + loginResBody.access_token]],
        });

        await controller.profile(ctx);
        const body = ctx.response.body as ReturnType<
          typeof generateUserMock
        >["values"];

        assertEquals(body.id, commonUser.values.id);
        assertEquals(body.avatar, commonUser.values.avatar);
        assertEquals(body.username, commonUser.values.username);
        assertEquals(body.isAdmin, commonUser.values.isAdmin);
        mockComparePassword.restore();
      });
      await it.step("Should fail with bad_token", async () => {
        const ctx = testing.createMockContext<"/profile">({
          path: API_PREFIX_V1 + "/auth/profile",
          headers: [["Authorization", "Bearer " + "BAD_TOKEN"]],
        });
        await controller.profile(ctx);
        assertEquals(ctx.response.status, Status.Unauthorized);
      });

      await it.step("Should fail without token", async () => {
        const ctx = testing.createMockContext<"/profile">({
          path: API_PREFIX_V1 + "/auth/profile",
        });
        await controller.profile(ctx);
        assertEquals(ctx.response.status, Status.Unauthorized);
      });
    });
  },
});
