import { RenderResult, cleanup, render } from "@testing-library/react";
import { UserNotLogged } from "../../contexts/auth";
import { Navbar } from "./Navbar";
import { BrowserRouter } from "react-router-dom";
import { User } from "../../models/user.model";

vi.mock("../../hooks");
vi.mock("./components/AvatarNav", () => ({
  AvatarNav: () => "AvatarNavMock",
}));
vi.mock("../SearchInput", () => ({
  SearchInput: () => "SearchInputMock",
}));

describe("Navbar component", () => {
  let component: RenderResult;

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should be render without user", async () => {
    const hooks = await import("../../hooks");
    hooks.useAuth = vi.fn().mockReturnValue({ user: UserNotLogged });

    component = render(<Navbar />, { wrapper: BrowserRouter });
    component.getByText("Sign In");
    component.getByText("Enter now !");
  });

  it("should be render with user logged", async () => {
    const hooks = await import("../../hooks");
    hooks.useAuth = vi.fn().mockReturnValue({ user: {} as User });

    component = render(<Navbar />, { wrapper: BrowserRouter });
    expect(component.queryByText("Sign In")).toBeNull();
    expect(component.queryByText("Enter now !")).toBeNull();
  });
});
