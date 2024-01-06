import {
  Anime,
  AnimeFilter,
  AnimeList,
  CreateAnime,
  UpdateAnime,
} from "../../../src/models/anime/index.ts";
import { Paginate } from "../../../src/models/paginate.ts";
import { AnimesRepository } from "../../../src/repositories/animes/animes.repository.ts";
import { generateAnimeMock } from "../data/anime.ts";

export class MockAnimesRepository implements AnimesRepository {
  data: AnimeList = [
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
    generateAnimeMock(),
  ];

  find(_filter: AnimeFilter) {
    return Promise.resolve(
      new Paginate({
        data: this.data,
        meta: { total: this.data.length },
      })
    );
  }
  findOne(id: string) {
    const anime = this.data.find((v) => v.values.id === id);
    return Promise.resolve(anime ?? null);
  }
  save(data: CreateAnime) {
    this.data.push(
      new Anime({
        ...data.values,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
    return Promise.resolve();
  }
  update(id: string, data: UpdateAnime) {
    const idx = this.data.findIndex((v) => v.values.id === id);

    this.data[idx] = new Anime({
      ...this.data[idx].values,
      ...data.values,
      updatedAt: new Date(),
    });

    return Promise.resolve();
  }
}
