import "npm:reflect-metadata";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { AnimesContoller } from "../../src/controllers/animes.ts";
import {
  assertEquals,
  assertSpyCalls,
  spy,
  stub,
  testing,
} from "../../test.deps.ts";
import { mockRequestBody } from "../utils.ts";
import { Status } from "../../deps.ts";
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

    await it.step("Create anime", async (it) => {
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

      await it.step("Post create anime", async () => {
        const ctx = testing.createMockContext<"/">({
          path: API_PREFIX_V1 + "/animes",
        });

        const spySaveMethod = spy(animesRepo, "save");

        await controller.createAnime(
          mockRequestBody(ctx, {
            type: "json",
            value: Promise.resolve(mockCreateAnime),
          }),
        );
        assertEquals(ctx.response.status, Status.Created);
        assertSpyCalls(spySaveMethod, 1);

        spySaveMethod.restore();
      });

      await it.step("Get created anime", async () => {
        const ctx = testing.createMockContext<"/">({
          path: API_PREFIX_V1 +
            "/animes" +
            "?" +
            new URLSearchParams({ slug: mockCreateAnime.slug }).toString(),
        });

        const anime = animesRepo.data.find(
          (v) => v.values.slug === mockCreateAnime.slug,
        );

        const mockFind = stub(animesRepo, "find", (_filter) => {
          return Promise.resolve({
            values: {
              data: anime ? [anime] : [],
              meta: { total: animesRepo.data.length },
            },
            // deno-lint-ignore no-explicit-any
          } as any);
        });
        await controller.getAnimes(ctx);
        const response = (
          ctx.response.body as { data: Array<{ slug: string }> }
        ).data[0].slug;
        assertEquals(response, mockCreateAnime.slug);
        mockFind.restore();
      });
    });
  },
});
