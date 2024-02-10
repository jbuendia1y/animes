import "npm:reflect-metadata";
import { createMockContext } from "$oak/testing.ts";

import { MockTagsRepository } from "../mocks/repositories/tags.repository.ts";
import { TagsController } from "../../src/controllers/tags.ts";
import { API_PREFIX_V1 } from "../../src/constants.ts";
import {
  assertEquals,
  assertRejects,
  assertSpyCalls,
  spy,
} from "../../test.deps.ts";
import { mockRequestBody } from "../utils.ts";
import { generateTagMock } from "../mocks/data/tag.ts";
import { Status } from "../../deps.ts";

const setup = () => {
  const tagsRepo = new MockTagsRepository();
  const controller = new TagsController(tagsRepo);
  return { tagsRepo, controller };
};

Deno.test({
  name: "Tags routes",
  async fn(it) {
    const { controller, tagsRepo } = setup();

    await it.step("Get tags", async () => {
      const ctx = createMockContext<"/">({
        path: API_PREFIX_V1 + "/tags",
      });

      await controller.getTags(ctx);
      const body = ctx.response.body as {
        data: (typeof tagsRepo)["data"];
        meta: { total: number };
      };
      assertEquals(body.meta.total, tagsRepo.data.length);
    });
    await it.step("Post tags", async (it) => {
      await it.step("Should success", async () => {
        const mockCreateTagBody = {
          ...generateTagMock().values,
        };

        const ctx = mockRequestBody(
          createMockContext<"/">({
            path: API_PREFIX_V1 + "/tags",
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(mockCreateTagBody),
          }
        );

        const spySave = spy(tagsRepo, "save");
        await controller.createTag(ctx);
        assertEquals(ctx.response.status, Status.Created);
        assertSpyCalls(spySave, 1);
        spySave.restore();
      });

      await it.step("Should fail", async () => {
        const mockCreateTagBody = {
          badField: 1,
          slug: "badField",
        };

        const ctx = mockRequestBody(
          createMockContext<"/">({
            path: API_PREFIX_V1 + "/tags",
            method: "POST",
          }),
          {
            type: "json",
            value: Promise.resolve(mockCreateTagBody),
          }
        );

        await assertRejects(() => controller.createTag(ctx));
      });
    });
  },
});
