import "npm:reflect-metadata";
import { Status } from "../../deps.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { ChaptersController } from "../../src/controllers/chapters.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { generateChapterMock } from "../mocks/data/chapter.ts";
import { MockChaptersRepository } from "../mocks/repositories/chapters.repository.ts";
import { mockRequestBody } from "../utils.ts";

const setup = () => {
  const chaptersRepo = new MockChaptersRepository();
  const controller = new ChaptersController(chaptersRepo);

  return { chaptersRepo, controller };
};

const TEST_BASE_PATH = API_PREFIX_V1 + "/chapters";

Deno.test({
  name: "Chapters routes",
  async fn(it) {
    await it.step("Get chapters", async () => {
      const { chaptersRepo, controller } = setup();

      const ctx = testing.createMockContext<"/">({
        path: TEST_BASE_PATH,
      });

      await controller.getChapters(ctx);
      const body = ctx.response.body as {
        data: unknown[];
        meta: { total: number };
      };

      assertEquals(ctx.response.status, Status.OK);
      assertEquals(body.data.length, chaptersRepo.data.length);
    });

    await it.step("Get chapters with animeId", async () => {
      const { chaptersRepo, controller } = setup();
      const animeId = crypto.randomUUID();

      const ctx = testing.createMockContext<"/">({
        path:
          TEST_BASE_PATH + "?" + new URLSearchParams({ animeId }).toString(),
      });

      const mockChapters = [
        generateChapterMock({ animeId, number: 1 }),
        generateChapterMock({ animeId, number: 2 }),
        generateChapterMock({ animeId, number: 3 }),
        generateChapterMock({ animeId, number: 4 }),
        generateChapterMock({ animeId, number: 5 }),
      ];

      chaptersRepo.data.push(...mockChapters);

      const mockFind = stub(chaptersRepo, "find", function (filter) {
        const data = this.data.filter(
          (v) => v.values.animeId === filter.values.options.animeId
        );
        return Promise.resolve({
          values: {
            data: data,
            meta: { total: data.length },
          },
          // deno-lint-ignore no-explicit-any
        } as any);
      });

      await controller.getChapters(ctx);
      const body = ctx.response.body as {
        data: unknown[];
        meta: { total: number };
      };

      assertEquals(ctx.response.status, Status.OK);
      assertEquals(body.data.length, mockChapters.length);
      assertEquals(body.meta.total, mockChapters.length);

      mockFind.restore();
    });

    await it.step("Get one chapter", async (it) => {
      const { chaptersRepo, controller } = setup();
      await it.step("Should no found resource", async () => {
        const ctx = testing.createMockContext<"/:id">({
          path: TEST_BASE_PATH + "/:id",
          params: { id: "BAD_ID" },
        });
        await controller.getOneChapter(ctx);
        assertEquals(ctx.response.status, Status.NotFound);
      });
      await it.step("Should return chapter", async () => {
        const mockChapter = generateChapterMock();
        chaptersRepo.data.push(mockChapter);

        const ctx = testing.createMockContext<"/:id">({
          path: TEST_BASE_PATH + "/:id",
          params: { id: mockChapter.values.id },
        });
        await controller.getOneChapter(ctx);

        assertEquals(ctx.response.status, Status.OK);
        assertEquals(ctx.response.body, mockChapter.values);
      });
    });

    await it.step("Update one chapter", async (it) => {
      const { chaptersRepo, controller } = setup();

      const setupCtx = (data: { body: unknown; id: string }) => {
        return mockRequestBody(
          testing.createMockContext<"/:id">({
            path: TEST_BASE_PATH + "/:id",
            method: "PATCH",
            params: { id: data.id },
          }),
          {
            type: "json",
            value: Promise.resolve(data.body),
          }
        );
      };

      await it.step("Should no found the resource", async () => {
        const ctx = setupCtx({ id: "BAD_ID", body: { number: 5 } });
        await controller.updateChapter(ctx);
        assertEquals(ctx.response.status, Status.BadRequest);
      });
      await it.step("Should reject", async () => {
        const mockUpdateBody = { titles: "BAD_FIELD" };
        const chapter = generateChapterMock();
        chaptersRepo.data.push(chapter);

        const ctx = setupCtx({ id: chapter.values.id, body: mockUpdateBody });
        await assertRejects(() => controller.updateChapter(ctx));
      });
      await it.step("Should success", async () => {
        const mockUpdateBody = { number: 5 };
        const chapter = generateChapterMock();
        chaptersRepo.data.push(chapter);

        const ctx = setupCtx({ id: chapter.values.id, body: mockUpdateBody });
        await controller.updateChapter(ctx);

        assertEquals(ctx.response.status, Status.OK);
      });
    });
  },
});
