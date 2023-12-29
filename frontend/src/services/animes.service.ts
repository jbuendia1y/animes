import { stringify } from "qs";
import { createAnimeAddapted, createPaginateAddapted } from "../addapters";
import {
  Anime,
  AnimeEndpoint,
  AnimeList,
  CreateAnime,
  UpdateAnime,
} from "../models/anime.model";
import axios from "axios";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import { AuthService } from "./auth.service";
import { ANIME_API_URL } from "../constants";

export interface AnimesFilter {
  tags?: string[];
  status?: string;
  slug?: string;
  limit?: number;
  offset?: number;
  sort?: { createdAt?: number };
}

export class AnimesService {
  private authService = new AuthService();
  private baseURL = ANIME_API_URL + "/animes";

  async find(filter: AnimesFilter = {}): Promise<Paginate<AnimeList>> {
    const query = stringify(filter);
    const res = await axios.get<PaginateEndpoint<Array<AnimeEndpoint>>>(
      this.baseURL + "?" + query
    );

    const data = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createAnimeAddapted(v)),
    });

    return data;
  }

  async findOne(id: string): Promise<Anime> {
    const res = await axios.get<AnimeEndpoint>(this.baseURL + "/" + id);
    const data = createAnimeAddapted(res.data);
    return data;
  }

  async save(data: CreateAnime) {
    await axios.post(this.baseURL, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }

  async update(id: string, data: UpdateAnime) {
    await axios.patch(this.baseURL + "/" + id, data.values, {
      headers: { Authorization: this.authService.authHeader },
    });
  }
}
