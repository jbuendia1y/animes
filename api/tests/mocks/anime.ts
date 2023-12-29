import { Anime } from "../../src/models/index.ts";

export const generateAnimeMock = (id: string) =>
  new Anime({
    id: "MY_ANIME_ID" + id,
    canonicalTitle: "CANONICAL_TITLE",
    coverImage: "COVER_IMAGE",
    description: "DESCRIPTION",
    nsfw: false,
    posterImage: "POSTER_IMAGE",
    showType: "TV",
    slug: "awesome-slug-" + id,
    stars: {
      1: 5,
      2: 3,
      3: 7,
      4: 0,
      5: 10,
    },
    status: "Emision",
    synopsis: "SYNOPSIS",
    tags: [],
    titles: {
      en: "ANIME_TITLE",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });
