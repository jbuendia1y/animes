import { BrowserRouter } from "react-router-dom";
import { Paginate } from "../../../models/paginate.model";
import {
  render,
  waitFor,
  cleanup,
  RenderResult,
  fireEvent,
} from "@testing-library/react";
import { RecentChaptersList } from ".";
import { Chapter } from "../../../models/chapter.model";
import { ChaptersService } from "../../../services/chapters.service";
import { act } from "react-dom/test-utils";

const generateMockChapter = (chapterId: string) => {
  return new Chapter({
    id: chapterId,
    canonicalTitle: chapterId + "-title",
    thumbnail: chapterId + "-thumbnail",
    createdAt: new Date(),
    description: "My awesome anime description",
    airdate: chapterId + "-airdate",
    synopsis: "My awesome anime synopsis",
    titles: {},
    updatedAt: new Date(),
    animeId: chapterId + "-chapterId",
    number: Math.round(Math.random() * 10),
  });
};

const mockChapterList: Paginate<Chapter[]> = new Paginate({
  data: [
    generateMockChapter("my-awesome-chapter-anime-1"),
    generateMockChapter("my-awesome-chapter-anime-2"),
    generateMockChapter("my-awesome-chapter-anime-3"),
    generateMockChapter("my-awesome-chapter-anime-4"),
    generateMockChapter("my-awesome-chapter-anime-5"),
    generateMockChapter("my-awesome-chapter-anime-6"),
    generateMockChapter("my-awesome-chapter-anime-7"),
    generateMockChapter("my-awesome-chapter-anime-8"),
    generateMockChapter("my-awesome-chapter-anime-9"),
    generateMockChapter("my-awesome-chapter-anime-10"),
  ],
  meta: {
    total: 10,
  },
});

describe("RecentChaptersList component", () => {
  let component: RenderResult;
  beforeEach(() => {
    const mock = vi.spyOn(ChaptersService.prototype, "find");
    mock.mockReturnValue(Promise.resolve(mockChapterList));

    act(() => {
      component = render(<RecentChaptersList />, { wrapper: BrowserRouter });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("should be render", async () => {
    const { container, findByText } = component;
    expect(container.querySelector("span")).toBeDefined();

    await waitFor(async () => {
      for (const v of mockChapterList.values.data) {
        await findByText(v.values.canonicalTitle);
      }
    });
  });

  it("should be navigate", async () => {
    await waitFor(async () => {
      const links = await component.findAllByRole("link");
      act(() => {
        const slugDict = mockChapterList.values.data.reduce(
          (acc: { [key: string]: string }, el) => {
            const pathname = "/watch/" + el.values.id;
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
