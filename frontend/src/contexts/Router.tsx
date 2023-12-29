import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("../pages").then((m) => ({ Component: m.Home })),
  },
  {
    path: "/login",
    lazy: () => import("../pages").then((m) => ({ Component: m.Login })),
  },
  {
    path: "/register",
    lazy: () => import("../pages").then((m) => ({ Component: m.Register })),
  },
  {
    path: "/animes",
    children: [
      {
        path: "",
        lazy: () => import("../pages").then((m) => ({ Component: m.Animes })),
      },
      {
        path: ":slug",
        lazy: () => import("../pages").then((m) => ({ Component: m.Anime })),
      },
    ],
  },
  {
    path: "/watch/:chapterId",
    lazy: () =>
      import("../pages/WatchChapter").then((m) => ({
        Component: m.WatchChapter,
      })),
  },
  {
    path: "/my",
    children: [
      {
        path: "list",
        lazy: () => import("../pages").then((m) => ({ Component: m.MyList })),
      },
      {
        path: "favorites",
        lazy: () =>
          import("../pages").then((m) => ({ Component: m.Favorites })),
      },
    ],
  },
  {
    path: "/notifications",
    lazy: () =>
      import("../pages").then((m) => ({ Component: m.Notifications })),
  },
  {
    path: "/profile",
    lazy: () => import("../pages").then((m) => ({ Component: m.Profile })),
  },
]);
