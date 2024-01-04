// deno-lint-ignore-file no-explicit-any
import "npm:reflect-metadata";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { AnimesContoller } from "../../src/controllers/animes.ts";
import { Paginate } from "../../src/models/index.ts";
import {
  assert,
  assertEquals,
  assertSpyCalls,
  spy,
  testing,
} from "../../test.deps.ts";
import { generateAnimeMock } from "../mocks/anime.ts";
import { mockRequestBody } from "../utils.ts";
import { Status } from "../../deps.ts";
import { STATUS_TEXT } from "https://deno.land/std@0.140.0/http/http_status.ts";

const animesMock = [
  generateAnimeMock("1"),
  generateAnimeMock("2"),
  generateAnimeMock("3"),
  generateAnimeMock("4"),
  generateAnimeMock("5"),
];

const AnimesRepoMock = {
  find(_filter: unknown) {
    return Promise.resolve(
      new Paginate({
        data: animesMock,
        meta: { total: animesMock.length },
      }),
    );
  },
  findOne(id: string) {
    const data = animesMock[0];
    if (id === data.values.id) return animesMock[0];
    return null;
  },
  update(_data: unknown) {},
  save(_data: unknown) {},
};

Deno.test({
  name: "Animes routes",
  async fn(it) {
    const controller = new AnimesContoller(AnimesRepoMock as any);

    await it.step("Get animes", async () => {
      const ctx = testing.createMockContext<"/">({
        path: API_PREFIX_V1 + "/animes",
      });
      await controller.getAnimes(ctx);
      assertEquals(ctx.response.body, {
        data: animesMock.map((v) => v.values),
        meta: { total: animesMock.length },
      });
    });

    await it.step("Get one anime", async () => {
      const ctx = testing.createMockContext<"/:id">({
        path: API_PREFIX_V1 + "/animes/:id",
        params: { id: animesMock[0].values.id },
      });
      await controller.getOneAnime(ctx);
      assertEquals(ctx.response.body, animesMock[0].values);
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

      const spySaveMethod = spy(AnimesRepoMock, "save");

      await controller.createAnime(
        mockRequestBody(ctx, {
          type: "json",
          value: Promise.resolve(mockCreateAnime),
        }),
      );
      assert(ctx.response.status, STATUS_TEXT.get(Status.Created));
      assertSpyCalls(spySaveMethod, 1);
    });
  },
});
