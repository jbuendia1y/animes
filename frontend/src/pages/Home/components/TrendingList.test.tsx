import { BrowserRouter } from "react-router-dom";
import {
  render,
  waitFor,
  cleanup,
  RenderResult,
  fireEvent,
} from "@testing-library/react";
import { TrendingList } from ".";
import { act } from "react-dom/test-utils";
import { Trending } from "../models";
import { TrendingsService } from "../services";

const generateMockTrending = (animeId: string) => {
  return new Trending({
    id: animeId,
    animeId: animeId + "-chapterId",
    coverImage: animeId + "-coverImage",
    posterImage: animeId + "-posterImage",
    slug: animeId + "-slug",
    title: animeId + "-title",
  });
};

const mockTrendingList: Trending[] = [
  generateMockTrending("my-awesome-trending-anime-1"),
  generateMockTrending("my-awesome-trending-anime-2"),
  generateMockTrending("my-awesome-trending-anime-3"),
  generateMockTrending("my-awesome-trending-anime-4"),
  generateMockTrending("my-awesome-trending-anime-5"),
  generateMockTrending("my-awesome-trending-anime-6"),
  generateMockTrending("my-awesome-trending-anime-7"),
  generateMockTrending("my-awesome-trending-anime-8"),
  generateMockTrending("my-awesome-trending-anime-9"),
  generateMockTrending("my-awesome-trending-anime-10"),
];

describe("TrendingList component", () => {
  let component: RenderResult;
  beforeEach(() => {
    const mock = vi.spyOn(TrendingsService.prototype, "find");
    mock.mockReturnValue(Promise.resolve(mockTrendingList));

    vi.mock("react-snap-carousel", () => {
      return {
        useSnapCarousel: () => ({
          next: vi.fn(),
          prev: vi.fn(),
          scrollRef: vi.fn(),
          activePageIndex: 0,
          snapPointIndexes: 0,
        }),
      };
    });

    component = render(<TrendingList />, { wrapper: BrowserRouter });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should be render", async () => {
    const { container, findByText } = component;
    expect(container.querySelector("span")).toBeDefined();
    await waitFor(async () => {
      for (const v of mockTrendingList) {
        await findByText(v.values.title);
      }
    });
  });

  it("should be navigate", async () => {
    await waitFor(async () => {
      const links = await component.findAllByRole("link");
      act(() => {
        const slugDict = mockTrendingList.reduce(
          (acc: { [key: string]: string }, el) => {
            const pathname = "/animes/" + el.values.slug;
            acc[pathname] = pathname;
            return acc;
          },
          {}
        );
        for (const link of links) {
          fireEvent.click(link);
          expect(window.location.pathname).toEqual(
            slugDict[window.location.pathname]
          );
        }
      });
    });
  });
});
