import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
} from "@testing-library/react";
import { SearchInput } from "./SearchInput";
import { useNavigate } from "react-router-dom";
import { Mock } from "vitest";

describe("SearchInput component", () => {
  let component: RenderResult;

  beforeEach(() => {
    vi.mock("react-router-dom", () => {
      const mockUseNavigate = vi.fn();
      mockUseNavigate.mockReturnValue(vi.fn());
      return {
        useNavigate: mockUseNavigate,
      };
    });
    component = render(<SearchInput />);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should be render", () => {
    component.getByLabelText("Search");
  });

  it("should navigate", () => {
    const field = component.getByPlaceholderText("¿ Estás buscando algo ?");

    // Click and typing in field
    fireEvent.click(field);
    fireEvent.change(field, { target: { value: "My awesome anime" } });
    fireEvent.keyDown(field, { key: "Enter" });

    expect((field as HTMLInputElement).value).equals("My awesome anime");

    // Get mock hook
    const calls: string[][] = (useNavigate() as Mock).mock.calls;
    expect(calls).length(1);
    expect(calls[0]).length(1);

    // Get mock args
    const urlArg = calls[0][0];
    expect(urlArg).equal("/animes?q=my-awesome-anime");
  });
});
