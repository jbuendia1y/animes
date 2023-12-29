import axios from "axios";
import { AuthService } from "./auth.service";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import {
  CreateUserAnime,
  DBUserAnime,
  UserAnime,
} from "../models/user-anime.model";
import { createPaginateAddapted, createUserAnimeAddapted } from "../addapters";
import { stringify } from "qs";
import { ANIME_API_URL } from "../constants";

interface UserAnimeFilter {
  animeId?: string;
  limit?: number;
  offset?: number;
}

export class UserAnimesService {
  private baseUrl = ANIME_API_URL + "/users/animes";
  private authService = new AuthService();

  async find(filter: UserAnimeFilter = {}): Promise<Paginate<UserAnime[]>> {
    const query = stringify(filter);

    const res = await axios.get<PaginateEndpoint<DBUserAnime[]>>(
      this.baseUrl + "?" + query,
      {
        headers: { Authorization: this.authService.authHeader },
      }
    );

    const data = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createUserAnimeAddapted(v)),
    });

    return data;
  }

  async save(data: CreateUserAnime): Promise<void> {
    await axios.post(this.baseUrl, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async delete(id: string): Promise<void> {
    await axios.delete(this.baseUrl + "/" + id, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
