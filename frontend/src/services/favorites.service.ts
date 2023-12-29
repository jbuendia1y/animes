import axios from "axios";
import { stringify } from "qs";
import {
  CreateFavorite,
  DBFavorite,
  Favorite,
  UpdateFavorite,
} from "../models/favorite.model";
import { AuthService } from "./auth.service";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import { createFavoriteAddapted, createPaginateAddapted } from "../addapters";
import { ANIME_API_URL } from "../constants";

interface FavoriteFilter {
  animeId?: string;
  limit?: number;
  offset?: number;
}

export class FavoritesService {
  private baseUrl = ANIME_API_URL + "/animes/favorites";
  private authService = new AuthService();

  async find(filter: FavoriteFilter = {}): Promise<Paginate<Favorite[]>> {
    const query = stringify(filter);

    const res = await axios.get<PaginateEndpoint<DBFavorite[]>>(
      this.baseUrl + "?" + query,
      {
        headers: { Authorization: this.authService.authHeader },
      }
    );

    const data = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createFavoriteAddapted(v)),
    });

    return data;
  }

  async save(data: CreateFavorite) {
    await axios.post(this.baseUrl, data, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async update(id: string, data: UpdateFavorite) {
    await axios.patch(this.baseUrl + "/" + id, data, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async delete(id: string) {
    await axios.delete(this.baseUrl + "/" + id, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
