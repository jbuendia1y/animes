// deno-lint-ignore-file no-explicit-any
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { AnimesContoller } from "../../src/controllers/animes.ts";
import { Paginate } from "../../src/models/index.ts";
import { assertEquals, testing } from "../../test.deps.ts";
import { generateAnimeMock } from "../mocks/anime.ts";

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
      })
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

      await controller.createAnime(ctx);
      console.log(ctx.response.body);
    });
  },
});
