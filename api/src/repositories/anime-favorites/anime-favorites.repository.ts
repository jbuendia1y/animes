import type {
  AnimeFavorite,
  AnimeFavoriteFilter,
  CreateAnimeFavorite,
  Paginate,
  UpdateAnimeFavorite,
} from "../../models/index.ts";

export interface AnimeFavoritesRepository {
  find(filter: AnimeFavoriteFilter): Promise<Paginate<AnimeFavorite[]>>;

  findOne(id: string): Promise<AnimeFavorite | null>;

  update(id: string, data: UpdateAnimeFavorite): Promise<void>;

  save(data: CreateAnimeFavorite): Promise<void>;

  delete(id: string): Promise<void>;
}
