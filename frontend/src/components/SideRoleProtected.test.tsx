import { cleanup, render } from "@testing-library/react";
import { SideRoleProtected } from "./SideRoleProtected";
import { User } from "../models/user.model";

vi.mock("../hooks");

const generateUserMock = ({ isAdmin }: { isAdmin: boolean }) => {
  return new User({
    id: "userId",
    avatar: null,
    createdAt: new Date(),
    isAdmin: isAdmin,
    updatedAt: new Date(),
    username: "username",
  });
};

describe("SideRoleProtected component", () => {
  const textProtected = "Only with auth";

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("can't render with unregister user", async () => {
    const hooks = await import("../hooks");
    hooks.useAuth = vi.fn().mockReturnValue({ user: null });

    const component = render(
      <SideRoleProtected children={<p>{textProtected}</p>} />
    );

    expect(component.queryByText(textProtected)).toBeNull();
  });

  it("can't render with unauthorizate user", async () => {
    const hooks = await import("../hooks");
    hooks.useAuth = vi
      .fn()
      .mockReturnValue({ user: generateUserMock({ isAdmin: false }) });

    const component = render(
      <SideRoleProtected role="isAdmin" children={<p>{textProtected}</p>} />
    );

    expect(component.queryByText(textProtected)).toBeNull();
  });

  it("can render with authorizate user", async () => {
    const hooks = await import("../hooks");
    hooks.useAuth = vi
      .fn()
      .mockReturnValue({ user: generateUserMock({ isAdmin: true }) });

    const component = render(
      <SideRoleProtected role="isAdmin" children={<p>{textProtected}</p>} />
    );
    component.getByText(textProtected);
  });

  it("can render with logged user", async () => {
    const hooks = await import("../hooks");
    hooks.useAuth = vi
      .fn()
      .mockReturnValue({ user: generateUserMock({ isAdmin: false }) });

    const component = render(
      <SideRoleProtected children={<p>{textProtected}</p>} />
    );

    component.getByText(textProtected);
  });
});
