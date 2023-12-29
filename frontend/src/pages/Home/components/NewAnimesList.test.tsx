import { BrowserRouter } from "react-router-dom";
import { Anime, AnimeList } from "../../../models/anime.model";
import { Paginate } from "../../../models/paginate.model";
import { AnimesService } from "../../../services/animes.service";
import { NewAnimesList } from "./NewAnimesList";
import {
  render,
  cleanup,
  RenderResult,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

const generateMockAnime = (animeId: string) => {
  return new Anime({
    id: animeId,
    canonicalTitle: animeId + "-title",
    coverImage: null,
    posterImage: null,
    createdAt: new Date(),
    description: "My awesome anime description",
    nsfw: false,
    showType: "TV",
    slug: animeId,
    stars: { 1: 10, 2: 11, 3: 20, 4: 0, 5: 1 },
    status: "current",
    synopsis: "My awesome anime synopsis",
    tags: null,
    titles: {},
    updatedAt: new Date(),
  });
};

const mockAnimesList: Paginate<AnimeList> = new Paginate({
  data: [
    generateMockAnime("my-awesome-anime-1"),
    generateMockAnime("my-awesome-anime-2"),
    generateMockAnime("my-awesome-anime-3"),
    generateMockAnime("my-awesome-anime-4"),
    generateMockAnime("my-awesome-anime-5"),
    generateMockAnime("my-awesome-anime-6"),
    generateMockAnime("my-awesome-anime-7"),
    generateMockAnime("my-awesome-anime-8"),
    generateMockAnime("my-awesome-anime-9"),
    generateMockAnime("my-awesome-anime-10"),
  ],
  meta: {
    total: 10,
  },
});

describe("NewAnimesList component", () => {
  let component: RenderResult;
  beforeEach(async () => {
    const mock = vi.spyOn(AnimesService.prototype, "find");
    mock.mockResolvedValue(mockAnimesList);

    component = render(<NewAnimesList />, { wrapper: BrowserRouter });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should be render", async () => {
    const { container, findByText } = component;
    expect(container.querySelector("span")).toBeDefined();

    for (const v of mockAnimesList.values.data) {
      await waitFor(async () => {
        await findByText(v.values.canonicalTitle);
      });
    }
  });

  it("should be navigate", async () => {
    const links = await component.findAllByRole("link");
    const slugDict = mockAnimesList.values.data.reduce(
      (acc: { [key: string]: string }, el) => {
        const pathname = "/animes/" + el.values.slug;
        acc[pathname] = pathname;
        return acc;
      },
      {}
    );
    for (const link of links) {
      act(() => {
        fireEvent.click(link);
      });
      expect(window.location.pathname).toEqual(
        slugDict[window.location.pathname]
      );
    }
  });
});
