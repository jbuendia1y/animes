import "npm:reflect-metadata";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import { ChapterVideosController } from "../../src/controllers/chapter-videos.ts";
import { assertEquals, assertRejects, stub, testing } from "../../test.deps.ts";
import { MockChapterVideosRepository } from "../mocks/repositories/chapter-videos.repository.ts";
import { mockRequestBody } from "../utils.ts";
import { Status } from "../../deps.ts";
import { generateChapterVideoMock } from "../mocks/data/chapter-videos.ts";

const TEST_BASE_PATH = API_PREFIX_V1 + "/chapters/videos";
const setup = () => {
  const chapterVideosRepo = new MockChapterVideosRepository();
  const controller = new ChapterVideosController(chapterVideosRepo);
  return { chapterVideosRepo, controller };
};

type MockGetAllBodyResponse = ReturnType<
  typeof generateChapterVideoMock
>["values"][];

Deno.test({
  name: "Chapter videos routes",
  async fn(it) {
    await it.step("Get videos", async (it) => {
      const { chapterVideosRepo, controller } = setup();

      const setupCtx = (query?: Record<string, string>) => {
        const q = new URLSearchParams(query);
        return testing.createMockContext<"/">({
          path: TEST_BASE_PATH + "?" + q.toString(),
          method: "GET",
        });
      };

      await it.step("Get all", async () => {
        const ctx = setupCtx();
        await controller.getChapterVideos(ctx);
        assertEquals(
          (ctx.response.body as MockGetAllBodyResponse).length,
          chapterVideosRepo.data.length
        );
        assertEquals(ctx.response.status, Status.OK);
      });
      await it.step("Get by chapterId", async () => {
        const chapterIdMock = crypto.randomUUID();
        const chapterVideosMock = [
          generateChapterVideoMock({ chapterId: chapterIdMock }),
          generateChapterVideoMock({ chapterId: chapterIdMock }),
          generateChapterVideoMock({ chapterId: chapterIdMock }),
          generateChapterVideoMock({ chapterId: chapterIdMock }),
        ];
        chapterVideosRepo.data.push(...chapterVideosMock);

        const mockFind = stub(chapterVideosRepo, "find", (filter) => {
          const data = chapterVideosRepo.data.filter(
            ({ values: v }) => v.chapterId === filter.values.options.chapterId
          );
          return Promise.resolve(data);
        });

        const ctx = setupCtx({ chapterId: chapterIdMock });
        await controller.getChapterVideos(ctx);

        assertEquals(ctx.response.status, Status.OK);
        assertEquals(
          (ctx.response.body as MockGetAllBodyResponse).length,
          chapterVideosMock.length
        );
        mockFind.restore();
      });
    });

    await it.step("Get one video", async () => {});

    await it.step("Create video", async (it) => {
      const { controller } = setup();
      const setupCtx = (data: { body: unknown }) => {
        return mockRequestBody(
          testing.createMockContext<"/">({
            path: TEST_BASE_PATH,
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(data.body),
          }
        );
      };

      await it.step("Should fail", async () => {
        const ctx = setupCtx({ body: {} });
        await assertRejects(() => controller.createChapterVideo(ctx));
      });
      await it.step("Should success", async () => {
        const mockChapterVideo = generateChapterVideoMock();
        const ctx = setupCtx({ body: mockChapterVideo });
        await controller.createChapterVideo(ctx);
        assertEquals(ctx.response.status, Status.Created);
      });
    });

    await it.step("Update video", async (it) => {
      const { controller, chapterVideosRepo } = setup();
      const setupCtx = (data: { id: string; body: unknown }) => {
        return mockRequestBody(
          testing.createMockContext<"/:id">({
            path: TEST_BASE_PATH + "/:id",
            params: {
              id: data.id,
            },
            method: "PATCH",
          }),
          {
            type: "json",
            value: Promise.resolve(data.body),
          }
        );
      };

      const chapterVideoInRepo = generateChapterVideoMock();
      chapterVideosRepo.data.push(chapterVideoInRepo);

      await it.step("Should fail", async () => {
        const ctx = setupCtx({ id: "BAD_ID", body: {} });
        await assertRejects(() => controller.updateChapterVideo(ctx));
      });

      await it.step("Should success", async () => {
        const ctx = setupCtx({
          id: chapterVideoInRepo.values.id,
          body: {
            ...chapterVideoInRepo.values,
            player: generateChapterVideoMock().values.player,
          },
        });
        await controller.updateChapterVideo(ctx);
        assertEquals(ctx.response.status, Status.OK);
      });
    });

    await it.step("Delete videos", async (it) => {
      const { controller, chapterVideosRepo } = setup();
      const setupCtx = (data: { id: string }) => {
        return testing.createMockContext<"/:id">({
          path: TEST_BASE_PATH + "/:id",
          params: {
            id: data.id,
          },
          method: "DELETE",
        });
      };

      const mockChapterVideo = generateChapterVideoMock();
      chapterVideosRepo.data.push(mockChapterVideo);

      await it.step("Should success", () => {
        const ctx = setupCtx({ id: crypto.randomUUID() });
        controller.deleteChapterVideo(ctx);
      });
    });
  },
});
