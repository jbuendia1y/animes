import { DBTag } from "../models/tag/dbtag.model.ts";
import { Tag } from "../models/tag/tag.model.ts";

export const createTagAddapted = (data: DBTag): Tag => {
  return new Tag({
    id: data._id.toString(),
    slug: data.slug,
    name: data.name,
    description: data.description,
    nsfw: data.nsfw,
  });
};
