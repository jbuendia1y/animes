import axios from "axios";
import { Tag, TagEndpoint } from "../models/tag.model";
import { Paginate, PaginateEndpoint } from "../models/paginate.model";
import { createPaginateAddapted, createTagAddapted } from "../addapters";
import { stringify } from "qs";
import { ANIME_API_URL } from "../constants";

export interface TagsFilter {
  slug?: string;

  limit?: number;
  offset?: number;
}

export class TagsService {
  private baseUrl = ANIME_API_URL + "/tags";

  async find(
    filter: TagsFilter = { limit: 25, offset: 0 }
  ): Promise<Paginate<Tag[]>> {
    const query = stringify(filter);

    const res = await axios.get<PaginateEndpoint<TagEndpoint[]>>(
      this.baseUrl + "?" + query
    );

    const data = createPaginateAddapted({
      ...res.data,
      data: res.data.data.map((v) => createTagAddapted(v)),
    });

    return data;
  }
}
