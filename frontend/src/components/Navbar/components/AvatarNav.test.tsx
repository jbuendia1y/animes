import { cleanup, fireEvent, render } from "@testing-library/react";
import { AvatarNav } from "./AvatarNav";
import { UserLoading, UserNotLogged } from "../../../contexts/auth";
import { User } from "../../../models/user.model";
import { BrowserRouter } from "react-router-dom";
import { NotificationsService } from "../../../services/notifications.service";
import { Paginate } from "../../../models/paginate.model";
import { UserNotification } from "../../../models/notification.model";
import { Mock } from "vitest";

const generateUserMock = (userId: string) => {
  return new User({
    id: userId,
    avatar: null,
    createdAt: new Date(),
    isAdmin: false,
    updatedAt: new Date(),
    username: userId + "-myusername",
  });
};

const generateUserNotificationMock = ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return new UserNotification({
    id: id,
    title: "userNotificationTitle",
    description: "userNotificationDescription",
    imageLink: null,
    link: null,
    viewed: false,
    userId,
  });
};

vi.mock("../../../hooks");
describe("AvatarNav component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should be render without user", async () => {
    const hooks = await import("../../../hooks");
    hooks.useAuth = vi
      .fn()
      .mockReturnValue({ user: UserNotLogged, logout: vi.fn() });

    const component = render(<AvatarNav />);
    expect(component.queryByRole("button")).toBeNull();
  });

  it("should be render with user loading", async () => {
    const hooks = await import("../../../hooks");
    hooks.useAuth = vi
      .fn()
      .mockReturnValue({ user: UserLoading, logout: vi.fn() });

    const component = render(<AvatarNav />);
    component.getByLabelText("loading-account");
  });

  it("should be render with user logged", async () => {
    const hooks = await import("../../../hooks");
    const userMock = generateUserMock("userId");
    hooks.useAuth = vi.fn().mockReturnValue({
      user: userMock,
      logout: vi.fn(),
    });

    const component = render(<AvatarNav />);
    component.getByAltText(userMock.values.username);
  });

  it("should be render menu onClick", async () => {
    const hooks = await import("../../../hooks");
    const userMock = generateUserMock("userId");
    hooks.useAuth = vi.fn().mockReturnValue({
      user: userMock,
      logout: vi.fn(),
    });

    const notificationsServiceMock = vi.spyOn(
      NotificationsService.prototype,
      "find"
    );
    notificationsServiceMock.mockResolvedValue(
      new Paginate<UserNotification[]>({
        data: [
          generateUserNotificationMock({ id: "notify1", userId: "userId" }),
          generateUserNotificationMock({ id: "notify2", userId: "userId" }),
          generateUserNotificationMock({ id: "notify3", userId: "userId" }),
        ],
        meta: { total: 3 },
      })
    );

    const component = render(<AvatarNav />, { wrapper: BrowserRouter });
    const button = component.getByRole("button");
    fireEvent.click(button);

    await component.findAllByRole("menuitem");
  });

  it("should logout onClick button", async () => {
    const hooks = await import("../../../hooks");
    const userMock = generateUserMock("userId");
    hooks.useAuth = vi.fn().mockReturnValue({
      user: userMock,
      logout: vi.fn(),
    });

    const notificationsServiceMock = vi.spyOn(
      NotificationsService.prototype,
      "find"
    );
    notificationsServiceMock.mockResolvedValue(
      new Paginate<UserNotification[]>({
        data: [
          generateUserNotificationMock({ id: "notify1", userId: "userId" }),
          generateUserNotificationMock({ id: "notify2", userId: "userId" }),
          generateUserNotificationMock({ id: "notify3", userId: "userId" }),
        ],
        meta: { total: 3 },
      })
    );

    const component = render(<AvatarNav />, { wrapper: BrowserRouter });
    const avatarButton = component.getByRole("button");
    fireEvent.click(avatarButton);

    const logoutButton = await component.findByText("Cerrar sessión");
    fireEvent.click(logoutButton);

    const calls = (hooks.useAuth().logout as Mock).mock.calls;
    expect(calls.length).toBe(1);
  });
});
