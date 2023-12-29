import type { Paginate } from "../../models/index.ts";
import type {
  CreateUserAnime,
  DeleteUserAnime,
  UserAnime,
  UserAnimeFilter,
} from "../../models/user-anime/index.ts";

export interface UserAnimesRepository {
  find(filter: UserAnimeFilter): Promise<Paginate<UserAnime[]>>;

  save(data: CreateUserAnime): Promise<void>;

  delete(data: DeleteUserAnime): Promise<void>;
}
