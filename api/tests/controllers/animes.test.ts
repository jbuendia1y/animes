import "npm:reflect-metadata";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { AnimesContoller } from "../../src/controllers/animes.ts";
import {
  assert,
  assertEquals,
  assertSpyCalls,
  spy,
  testing,
} from "../../test.deps.ts";
import { mockRequestBody } from "../utils.ts";
import { Status } from "../../deps.ts";
import { STATUS_TEXT } from "https://deno.land/std@0.140.0/http/http_status.ts";
import { MockAnimesRepository } from "../mocks/repositories/animes.repository.ts";

Deno.test({
  name: "Animes routes",
  async fn(it) {
    const animesRepo = new MockAnimesRepository();
    const controller = new AnimesContoller(animesRepo);

    await it.step("Get animes", async () => {
      const ctx = testing.createMockContext<"/">({
        path: API_PREFIX_V1 + "/animes",
      });
      await controller.getAnimes(ctx);
      assertEquals(ctx.response.body, {
        data: animesRepo.data.map((v) => v.values),
        meta: { total: animesRepo.data.length },
      });
    });

    await it.step("Get one anime", async () => {
      const ctx = testing.createMockContext<"/:id">({
        path: API_PREFIX_V1 + "/animes/:id",
        params: { id: animesRepo.data[0].values.id },
      });
      await controller.getOneAnime(ctx);
      assertEquals(ctx.response.body, animesRepo.data[0].values);
    });

    await it.step("Create anime", async () => {
      const ctx = testing.createMockContext<"/">({
        path: API_PREFIX_V1 + "/animes",
      });

      const mockCreateAnime = {
        slug: "my-create-anime",
        titles: { en: "My create anime" },
        canonicalTitle: "My Create Anime",
        description: "My create anime description",
        synopsis: "My create anime synopsis",
        stars: {},
        tags: [],
        nsfw: false,
        showType: "TV",
        status: "finished",
        posterImage:
          "https://media.kitsu.io/anime/44107/poster_image/265bcd076f07986aecb6ec62e769c5d2.jpg",
        coverImage:
          "https://media.kitsu.io/anime/44107/cover_image/5cf3c261bc51eb0b2c3376aa4893ad49.png",
      };

      const spySaveMethod = spy(animesRepo, "save");

      await controller.createAnime(
        mockRequestBody(ctx, {
          type: "json",
          value: Promise.resolve(mockCreateAnime),
        })
      );
      assert(ctx.response.status, STATUS_TEXT.get(Status.Created));
      assertSpyCalls(spySaveMethod, 1);
    });
  },
});
