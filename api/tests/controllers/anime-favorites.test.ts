import "npm:reflect-metadata";
import { AnimeFavoritesController } from "../../src/controllers/anime-favorites.ts";
import { generateUserMock } from "../mocks/data/user.ts";
import { MockAnimeFavoritesRepository } from "../mocks/repositories/anime-favorites.repository.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { AuthUtils } from "../../src/utils/index.ts";
import { IAnimeFavorite } from "../../src/models/index.ts";
import { generateAnimeFavoriteMock } from "../mocks/data/anime-favorites.ts";
import { mockRequestBody } from "../utils.ts";
import { Status } from "../../deps.ts";

const setup = () => {
  const animeFavoritesRepo = new MockAnimeFavoritesRepository();
  const controller = new AnimeFavoritesController(animeFavoritesRepo);

  return { animeFavoritesRepo, controller };
};

Deno.test({
  name: "Anime favorites routes",
  async fn(it) {
    const { animeFavoritesRepo, controller } = setup();
    const commonUser = generateUserMock();
    let userIdMock = commonUser.values.id;
    const mockHeadersId = stub(AuthUtils, "getUserIdFromHeaders", () =>
      Promise.resolve(userIdMock)
    );

    await it.step("Find anime favorites", async (it) => {
      userIdMock = commonUser.values.id;
      const ctx = testing.createMockContext<"/">({
        path: API_PREFIX_V1 + "/animes/favorites",
      });

      const mockFind = stub(animeFavoritesRepo, "find", function () {
        const data = this.data.filter(
          (v) => v.values.userId === commonUser.values.id
        );
        return Promise.resolve({
          values: {
            data,
            meta: { total: data.length },
          },
          // deno-lint-ignore no-explicit-any
        } as any);
      });

      await it.step("Should be empty body response", async () => {
        await controller.getAnimeFavorites(ctx);
        const body = ctx.response.body as {
          data: IAnimeFavorite[];
          meta: { total: number };
        };
        assertEquals(body.data.length, 0);
        assertEquals(body.meta.total, 0);
      });

      await it.step("Should return items", async () => {
        animeFavoritesRepo.data.push(
          generateAnimeFavoriteMock({ userId: commonUser.values.id }),
          generateAnimeFavoriteMock({ userId: commonUser.values.id }),
          generateAnimeFavoriteMock({ userId: commonUser.values.id })
        );

        await controller.getAnimeFavorites(ctx);
        const body = ctx.response.body as {
          data: IAnimeFavorite[];
          meta: { total: number };
        };
        assertEquals(body.data.length, 3);
        assertEquals(body.meta.total, 3);
      });

      mockFind.restore();
    });
    await it.step("Create anime favorites", async (it) => {
      userIdMock = commonUser.values.id;
      await it.step("Should fail", async () => {
        const mockCreateAnimeBody = {
          badField: 1,
        };

        const ctx = mockRequestBody(
          testing.createMockContext<"/">({
            path: API_PREFIX_V1 + "/animes/favorites",
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(mockCreateAnimeBody),
          }
        );
        await assertRejects(() => controller.createAnimeFavorite(ctx));
      });
      await it.step("Should success", async () => {
        const mockCreateAnimeBody = {
          ...generateAnimeFavoriteMock(),
        };

        const ctx = mockRequestBody(
          testing.createMockContext<"/">({
            path: API_PREFIX_V1 + "/animes/favorites",
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(mockCreateAnimeBody),
          }
        );
        await controller.createAnimeFavorite(ctx);
        assertEquals(ctx.response.status, Status.Created);
      });
    });
    await it.step("Update anime favorites", async (it) => {
      const setupCtx = (data: {
        favoriteId: string;
        body: Record<string, string | number>;
      }) => {
        return mockRequestBody(
          testing.createMockContext<"/:id">({
            headers: [["Authorization", "Bearer JWT_TOKEN"]],
            method: "PUT",
            path: API_PREFIX_V1 + "/animes/favorites/:id",
            params: {
              id: data.favoriteId,
            },
          }),
          {
            type: "json",
            value: Promise.resolve(data.body),
          }
        );
      };

      userIdMock = crypto.randomUUID();

      await it.step("Should not found the resource", async () => {
        const ctx = setupCtx({ favoriteId: "BAD_ID", body: { stars: 5 } });
        await controller.updateAnimeFavorite(ctx);
        assertEquals(ctx.response.status, Status.BadRequest);
      });
      await it.step(
        "Should user no has authorization to update it",
        async () => {
          userIdMock = commonUser.values.id;
          const favoriteMock = generateAnimeFavoriteMock({
            userId: crypto.randomUUID(),
          });
          animeFavoritesRepo.data.push(favoriteMock);

          const ctx = setupCtx({
            favoriteId: favoriteMock.values.id,
            body: { stars: 5 },
          });
          await controller.updateAnimeFavorite(ctx);
          assertEquals(ctx.response.status, Status.Unauthorized);
        }
      );
      await it.step("Should success", async () => {
        const favoriteMock = generateAnimeFavoriteMock({
          userId: commonUser.values.id,
        });
        userIdMock = commonUser.values.id;
        animeFavoritesRepo.data.push(favoriteMock);
        const bodyMock = { stars: 5 };
        const ctx = setupCtx({
          body: bodyMock,
          favoriteId: favoriteMock.values.id,
        });
        await controller.updateAnimeFavorite(ctx);
        assertEquals(ctx.response.status, Status.OK);
      });
      await it.step("Should fail by body schema", async () => {
        const favoriteMock = generateAnimeFavoriteMock({
          userId: commonUser.values.id,
        });
        userIdMock = commonUser.values.id;
        const ctx = setupCtx({
          favoriteId: favoriteMock.values.id,
          body: { badField: 1 },
        });
        await assertRejects(() => controller.updateAnimeFavorite(ctx));
      });
    });
    await it.step("Delete anime favorites", async () => {});
    mockHeadersId.restore();
  },
});
