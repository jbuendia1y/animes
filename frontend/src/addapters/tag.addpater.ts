import { Tag, TagEndpoint } from "../models/tag.model";

export const createTagAddapted = (ed: TagEndpoint): Tag => {
  return new Tag({
    id: ed.id,
    name: ed.name,
    description: ed.description,
    nsfw: ed.nsfw,
    slug: ed.slug,
  });
};
