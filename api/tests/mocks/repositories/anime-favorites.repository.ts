import {
  AnimeFavoriteFilter,
  AnimeFavorite,
} from "../../../src/models/anime-favorite/anime-favorite.model.ts";
import { CreateAnimeFavorite } from "../../../src/models/anime-favorite/create-anime-favorite.model.ts";
import { UpdateAnimeFavorite } from "../../../src/models/anime-favorite/update-anime-favorite.model.ts";
import { Paginate } from "../../../src/models/paginate.ts";
import { AnimeFavoritesRepository } from "../../../src/repositories/anime-favorites/anime-favorites.repository.ts";
import { generateAnimeFavoriteMock } from "../data/anime-favorites.ts";

export class MockAnimeFavoritesRepository implements AnimeFavoritesRepository {
  data: AnimeFavorite[] = [
    generateAnimeFavoriteMock(),
    generateAnimeFavoriteMock(),
    generateAnimeFavoriteMock(),
    generateAnimeFavoriteMock(),
    generateAnimeFavoriteMock(),
    generateAnimeFavoriteMock(),
  ];

  find(_filter: AnimeFavoriteFilter): Promise<Paginate<AnimeFavorite[]>> {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      })
    );
  }
  findOne(id: string): Promise<AnimeFavorite | null> {
    const anime = this.data.find((v) => v.values.id === id);
    return Promise.resolve(anime ?? null);
  }
  update(id: string, data: UpdateAnimeFavorite): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);

    this.data[idx] = new AnimeFavorite({
      ...this.data[idx].values,
      ...data.values,
    });

    return Promise.resolve();
  }
  save(data: CreateAnimeFavorite): Promise<void> {
    this.data.push(
      new AnimeFavorite({
        ...data.values,
        id: crypto.randomUUID(),
      })
    );
    return Promise.resolve();
  }
  delete(id: string): Promise<void> {
    const idx = this.data.findIndex((v) => v.values.id === id);
    this.data.splice(idx, 1);
    return Promise.resolve();
  }
}
