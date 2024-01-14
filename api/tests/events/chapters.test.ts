import {
  CreateChapterEvent,
  emitChapterEvent,
  initChapterEvents,
} from "../../src/events/chapters.event.ts";
import { CreateChapter, DBAnimeFavorite } from "../../src/models/index.ts";
import { assertSpyCalls, spy } from "../../test.deps.ts";
import { generateAnimeFavoriteMock } from "../mocks/data/anime-favorites.ts";
import { generateAnimeMock } from "../mocks/data/anime.ts";
import { generateChapterMock } from "../mocks/data/chapter.ts";
import { MockAnimesRepository } from "../mocks/repositories/animes.repository.ts";
import { MockUserNotificationsRepository } from "../mocks/repositories/user-notifications.repository.ts";

Deno.test({
  name: "Chapter events",
  async fn() {
    const userIdMock = crypto.randomUUID();
    const mockDB = {
      collection: () => {
        return {
          *find() {
            const mock = generateAnimeFavoriteMock({ userId: userIdMock });
            const favorite = {
              ...mock.values,
              // deno-lint-ignore no-explicit-any
              _id: mock.values.id as any,
            } as DBAnimeFavorite;
            yield favorite;
          },
        };
      },
      // deno-lint-ignore no-explicit-any
    } as any;
    const userNotificationsRepo = new MockUserNotificationsRepository();
    const animesRepo = new MockAnimesRepository();

    initChapterEvents(mockDB, userNotificationsRepo, animesRepo);

    const animeMock = generateAnimeMock();
    animesRepo.data.push(animeMock);

    const chapterMock = generateChapterMock({ animeId: animeMock.values.id });
    const payload = new CreateChapter({ ...chapterMock.values });

    const spySave = spy(userNotificationsRepo, "save");
    await emitChapterEvent(CreateChapterEvent, payload);
    assertSpyCalls(spySave, 1);
    spySave.restore();
  },
});
