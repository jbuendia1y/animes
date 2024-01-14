import {
  CreateAnimeFavoriteEvent,
  DeleteAnimeFavoriteEvent,
  UpdateAnimeFavoriteEvent,
  emitAnimeFavoriteEvent,
  initAnimeFavoriteEvents,
} from "../../src/events/anime-favorite.event.ts";
import {
  CreateAnimeFavorite,
  UpdateAnimeFavorite,
} from "../../src/models/index.ts";
import { assertSpyCalls, spy } from "../../test.deps.ts";
import { generateAnimeFavoriteMock } from "../mocks/data/anime-favorites.ts";
import { MockAnimesRepository } from "../mocks/repositories/animes.repository.ts";
import { generateAnimeMock } from "../mocks/data/anime.ts";

Deno.test({
  name: "Anime favorite events",
  async fn(it) {
    const animesRepo = new MockAnimesRepository();

    initAnimeFavoriteEvents(animesRepo);

    const setup = () => {
      const animeMock = generateAnimeMock();
      animesRepo.data.push(animeMock);

      const favoriteMock = generateAnimeFavoriteMock({
        animeId: animeMock.values.id,
      });

      return { animeMock, favoriteMock };
    };

    const mockDeps = () => {
      const spyUpdate = spy(animesRepo, "update");

      return {
        spyUpdate,
        restoreMocks: () => {
          spyUpdate.restore();
        },
      };
    };

    await it.step("Create event", async () => {
      const { favoriteMock } = setup();
      const payload = new CreateAnimeFavorite({
        ...favoriteMock.values,
      });
      const { spyUpdate, restoreMocks } = mockDeps();
      await emitAnimeFavoriteEvent(CreateAnimeFavoriteEvent, payload);
      assertSpyCalls(spyUpdate, 1);
      restoreMocks();
    });

    await it.step("Update event", async () => {
      const { favoriteMock } = setup();
      const updateStarsMock = favoriteMock.values.stars + 1;
      const toUpdate = new UpdateAnimeFavorite({
        stars: updateStarsMock,
      });
      const payload = { before: favoriteMock, toUpdateData: toUpdate };

      const { spyUpdate, restoreMocks } = mockDeps();
      await emitAnimeFavoriteEvent(UpdateAnimeFavoriteEvent, payload);
      assertSpyCalls(spyUpdate, 2);
      restoreMocks();
    });

    await it.step("Delete event", async () => {
      const { favoriteMock } = setup();
      const payload = { before: favoriteMock };

      const { spyUpdate } = mockDeps();
      await emitAnimeFavoriteEvent(DeleteAnimeFavoriteEvent, payload);
      assertSpyCalls(spyUpdate, 1);
    });
  },
});
