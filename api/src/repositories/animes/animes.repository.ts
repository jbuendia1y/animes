import type {
  Anime,
  CreateAnime,
  UpdateAnime,
  AnimeList,
  AnimeFilter,
  Paginate,
} from "../../models/index.ts";

export interface AnimesRepository {
  find(filter: AnimeFilter): Promise<Paginate<AnimeList>>;

  findOne(id: string): Promise<Anime | null>;

  save(data: CreateAnime): Promise<void>;

  update(id: string, data: UpdateAnime): Promise<void>;
}
