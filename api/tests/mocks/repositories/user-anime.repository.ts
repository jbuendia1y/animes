import { Paginate } from "../../../src/models/paginate.ts";
import { CreateUserAnime } from "../../../src/models/user-anime/create-user-anime.model.ts";
import { DeleteUserAnime } from "../../../src/models/user-anime/delete-user-anime.model.ts";
import {
  UserAnime,
  UserAnimeFilter,
} from "../../../src/models/user-anime/user-anime.model.ts";
import { UserAnimesRepository } from "../../../src/repositories/user-anime/user-anime.repository.ts";
import { generateUserAnimeMock } from "../data/user-anime.ts";

export class MockUserAnimesRepository implements UserAnimesRepository {
  data: UserAnime[] = [
    generateUserAnimeMock(),
    generateUserAnimeMock(),
    generateUserAnimeMock(),
  ];

  find(_filter: UserAnimeFilter): Promise<Paginate<UserAnime[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      }),
    );
  }
  save(data: CreateUserAnime): Promise<void> {
    this.data.push(
      new UserAnime({
        ...data.values,
        id: crypto.randomUUID(),
      }),
    );
    return Promise.resolve();
  }
  delete(data: DeleteUserAnime): Promise<void> {
    const idx = this.data.findIndex(
      (v) =>
        v.values.id === data.values.id &&
        v.values.userId === data.values.userId,
    );
    this.data.splice(idx, 1);
    return Promise.resolve();
  }
}
