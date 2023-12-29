import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../../hooks";
import { Footer, Navbar } from "../../components";
import { UserLoading } from "../../contexts/auth";
import { ProfileAnimes } from "./views/ProfileAnimes";
import { useEffect, useState } from "react";
import { ProfileFavorites } from "./views/ProfileFavorites";
import { FavoritesService } from "../../services/favorites.service";
import { UserAnimesService } from "../../services/user-animes.service";
import { ProfileHistory } from "./views/ProfileHistory";
import { UserChapterHistoryService } from "../../services/user-chapter-history.service";

const PROFILE_ANIMES_VIEW = "animes";
const PROFILE_FAVORITES_VIEW = "favorites";
const PROFILE_HISTORY_VIEW = "history";

type ProfileViewChoices =
  | typeof PROFILE_ANIMES_VIEW
  | typeof PROFILE_FAVORITES_VIEW
  | typeof PROFILE_HISTORY_VIEW;

export function Profile() {
  const { user } = useAuth();
  const [metadata, setMetadata] = useState({
    animesInList: 0,
    favorites: 0,
    totalPlays: 0,
    loading: true,
  });
  const [currentView, setView] =
    useState<ProfileViewChoices>(PROFILE_ANIMES_VIEW);

  const changeView = (value: ProfileViewChoices) => setView(value);

  const formatDisplayNumber = (value: number) => {
    const formatted = new Intl.NumberFormat("en", {
      notation: "compact",
    }).format(value);
    return formatted;
  };

  useEffect(() => {
    let subscribe = true;
    const favoritesService = new FavoritesService();
    const userAnimesService = new UserAnimesService();
    const historyService = new UserChapterHistoryService();

    setMetadata((v) => ({ ...v, loading: true }));
    Promise.all([
      favoritesService.find(),
      userAnimesService.find(),
      historyService.find(),
    ]).then(([favorites, userAnimes, userHistory]) => {
      if (!subscribe) return;
      setMetadata({
        animesInList: userAnimes.values.meta.total,
        favorites: favorites.values.meta.total,
        totalPlays: userHistory.values.meta.total,
        loading: false,
      });
    });

    return () => {
      subscribe = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <Box>
        <Paper
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.common.white,
            borderRadius: 0,
          }}
        >
          <Container sx={{ paddingY: 2 }}>
            <Stack alignItems="center">
              {user === UserLoading ? (
                <>
                  <Skeleton variant="circular">
                    <Avatar
                      alt="loading avatar"
                      sx={{
                        width: 159,
                        height: 159,
                        border: "2px solid white",
                        backgroundColor: "white",
                      }}
                    />
                  </Skeleton>
                  <Skeleton variant="text">
                    <Typography
                      fontSize="1.8rem"
                      component="h1"
                      fontWeight="bold"
                    >
                      @loading-username
                    </Typography>
                  </Skeleton>
                  <Skeleton variant="text">
                    <Typography
                      variant="body1"
                      maxWidth="30ch"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      noWrap
                    >
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatum, nemo? Ipsam magni molestiae sed, expedita fuga
                      quisquam sapiente voluptate ex nobis temporibus asperiores
                      illum est ipsa ducimus necessitatibus sint cum.
                    </Typography>
                  </Skeleton>
                </>
              ) : (
                <>
                  <Avatar
                    src="/default-avatar.png"
                    alt="andrea1"
                    sx={{
                      width: 159,
                      height: 159,
                      border: "2px solid white",
                      backgroundColor: "white",
                    }}
                  />
                  <Typography
                    fontSize="1.8rem"
                    component="h1"
                    fontWeight="bold"
                  >
                    @{user?.values.username}
                  </Typography>
                  <Typography
                    variant="body1"
                    maxWidth="30ch"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    noWrap
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatum, nemo? Ipsam magni molestiae sed, expedita fuga
                    quisquam sapiente voluptate ex nobis temporibus asperiores
                    illum est ipsa ducimus necessitatibus sint cum.
                  </Typography>
                </>
              )}
            </Stack>
            <Stack direction="row" justifyContent="space-around" marginTop={1}>
              {user === UserLoading ? (
                <>
                  <Skeleton variant="rectangular">
                    <Button
                      startIcon={
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.3125 10C18.3125 10.2486 18.2137 10.4871 18.0379 10.6629C17.8621 10.8387 17.6236 10.9375 17.375 10.9375H3.625C3.37636 10.9375 3.1379 10.8387 2.96209 10.6629C2.78627 10.4871 2.6875 10.2486 2.6875 10C2.6875 9.75136 2.78627 9.5129 2.96209 9.33709C3.1379 9.16127 3.37636 9.0625 3.625 9.0625H17.375C17.6236 9.0625 17.8621 9.16127 18.0379 9.33709C18.2137 9.5129 18.3125 9.75136 18.3125 10ZM3.625 5.9375H17.375C17.6236 5.9375 17.8621 5.83873 18.0379 5.66291C18.2137 5.4871 18.3125 5.24864 18.3125 5C18.3125 4.75136 18.2137 4.5129 18.0379 4.33709C17.8621 4.16127 17.6236 4.0625 17.375 4.0625H3.625C3.37636 4.0625 3.1379 4.16127 2.96209 4.33709C2.78627 4.5129 2.6875 4.75136 2.6875 5C2.6875 5.24864 2.78627 5.4871 2.96209 5.66291C3.1379 5.83873 3.37636 5.9375 3.625 5.9375ZM17.375 14.0625H3.625C3.37636 14.0625 3.1379 14.1613 2.96209 14.3371C2.78627 14.5129 2.6875 14.7514 2.6875 15C2.6875 15.2486 2.78627 15.4871 2.96209 15.6629C3.1379 15.8387 3.37636 15.9375 3.625 15.9375H17.375C17.6236 15.9375 17.8621 15.8387 18.0379 15.6629C18.2137 15.4871 18.3125 15.2486 18.3125 15C18.3125 14.7514 18.2137 14.5129 18.0379 14.3371C17.8621 14.1613 17.6236 14.0625 17.375 14.0625Z"
                            fill="white"
                          />
                        </svg>
                      }
                      sx={{ color: "white", paddingY: "4px" }}
                    >
                      30
                    </Button>
                  </Skeleton>
                  <Skeleton variant="rectangular">
                    <Button
                      startIcon={
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.3125 10C18.3125 10.2486 18.2137 10.4871 18.0379 10.6629C17.8621 10.8387 17.6236 10.9375 17.375 10.9375H3.625C3.37636 10.9375 3.1379 10.8387 2.96209 10.6629C2.78627 10.4871 2.6875 10.2486 2.6875 10C2.6875 9.75136 2.78627 9.5129 2.96209 9.33709C3.1379 9.16127 3.37636 9.0625 3.625 9.0625H17.375C17.6236 9.0625 17.8621 9.16127 18.0379 9.33709C18.2137 9.5129 18.3125 9.75136 18.3125 10ZM3.625 5.9375H17.375C17.6236 5.9375 17.8621 5.83873 18.0379 5.66291C18.2137 5.4871 18.3125 5.24864 18.3125 5C18.3125 4.75136 18.2137 4.5129 18.0379 4.33709C17.8621 4.16127 17.6236 4.0625 17.375 4.0625H3.625C3.37636 4.0625 3.1379 4.16127 2.96209 4.33709C2.78627 4.5129 2.6875 4.75136 2.6875 5C2.6875 5.24864 2.78627 5.4871 2.96209 5.66291C3.1379 5.83873 3.37636 5.9375 3.625 5.9375ZM17.375 14.0625H3.625C3.37636 14.0625 3.1379 14.1613 2.96209 14.3371C2.78627 14.5129 2.6875 14.7514 2.6875 15C2.6875 15.2486 2.78627 15.4871 2.96209 15.6629C3.1379 15.8387 3.37636 15.9375 3.625 15.9375H17.375C17.6236 15.9375 17.8621 15.8387 18.0379 15.6629C18.2137 15.4871 18.3125 15.2486 18.3125 15C18.3125 14.7514 18.2137 14.5129 18.0379 14.3371C17.8621 14.1613 17.6236 14.0625 17.375 14.0625Z"
                            fill="white"
                          />
                        </svg>
                      }
                      sx={{
                        color: "white",
                        paddingY: "4px",
                      }}
                    >
                      30
                    </Button>
                  </Skeleton>
                  <Skeleton variant="rectangular">
                    <Button
                      startIcon={
                        <svg
                          width="21"
                          height="20"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.3125 10C18.3125 10.2486 18.2137 10.4871 18.0379 10.6629C17.8621 10.8387 17.6236 10.9375 17.375 10.9375H3.625C3.37636 10.9375 3.1379 10.8387 2.96209 10.6629C2.78627 10.4871 2.6875 10.2486 2.6875 10C2.6875 9.75136 2.78627 9.5129 2.96209 9.33709C3.1379 9.16127 3.37636 9.0625 3.625 9.0625H17.375C17.6236 9.0625 17.8621 9.16127 18.0379 9.33709C18.2137 9.5129 18.3125 9.75136 18.3125 10ZM3.625 5.9375H17.375C17.6236 5.9375 17.8621 5.83873 18.0379 5.66291C18.2137 5.4871 18.3125 5.24864 18.3125 5C18.3125 4.75136 18.2137 4.5129 18.0379 4.33709C17.8621 4.16127 17.6236 4.0625 17.375 4.0625H3.625C3.37636 4.0625 3.1379 4.16127 2.96209 4.33709C2.78627 4.5129 2.6875 4.75136 2.6875 5C2.6875 5.24864 2.78627 5.4871 2.96209 5.66291C3.1379 5.83873 3.37636 5.9375 3.625 5.9375ZM17.375 14.0625H3.625C3.37636 14.0625 3.1379 14.1613 2.96209 14.3371C2.78627 14.5129 2.6875 14.7514 2.6875 15C2.6875 15.2486 2.78627 15.4871 2.96209 15.6629C3.1379 15.8387 3.37636 15.9375 3.625 15.9375H17.375C17.6236 15.9375 17.8621 15.8387 18.0379 15.6629C18.2137 15.4871 18.3125 15.2486 18.3125 15C18.3125 14.7514 18.2137 14.5129 18.0379 14.3371C17.8621 14.1613 17.6236 14.0625 17.375 14.0625Z"
                            fill="white"
                          />
                        </svg>
                      }
                      sx={{ color: "white", paddingY: "4px" }}
                    >
                      30
                    </Button>
                  </Skeleton>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => changeView(PROFILE_ANIMES_VIEW)}
                    startIcon={
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.3125 10C18.3125 10.2486 18.2137 10.4871 18.0379 10.6629C17.8621 10.8387 17.6236 10.9375 17.375 10.9375H3.625C3.37636 10.9375 3.1379 10.8387 2.96209 10.6629C2.78627 10.4871 2.6875 10.2486 2.6875 10C2.6875 9.75136 2.78627 9.5129 2.96209 9.33709C3.1379 9.16127 3.37636 9.0625 3.625 9.0625H17.375C17.6236 9.0625 17.8621 9.16127 18.0379 9.33709C18.2137 9.5129 18.3125 9.75136 18.3125 10ZM3.625 5.9375H17.375C17.6236 5.9375 17.8621 5.83873 18.0379 5.66291C18.2137 5.4871 18.3125 5.24864 18.3125 5C18.3125 4.75136 18.2137 4.5129 18.0379 4.33709C17.8621 4.16127 17.6236 4.0625 17.375 4.0625H3.625C3.37636 4.0625 3.1379 4.16127 2.96209 4.33709C2.78627 4.5129 2.6875 4.75136 2.6875 5C2.6875 5.24864 2.78627 5.4871 2.96209 5.66291C3.1379 5.83873 3.37636 5.9375 3.625 5.9375ZM17.375 14.0625H3.625C3.37636 14.0625 3.1379 14.1613 2.96209 14.3371C2.78627 14.5129 2.6875 14.7514 2.6875 15C2.6875 15.2486 2.78627 15.4871 2.96209 15.6629C3.1379 15.8387 3.37636 15.9375 3.625 15.9375H17.375C17.6236 15.9375 17.8621 15.8387 18.0379 15.6629C18.2137 15.4871 18.3125 15.2486 18.3125 15C18.3125 14.7514 18.2137 14.5129 18.0379 14.3371C17.8621 14.1613 17.6236 14.0625 17.375 14.0625Z"
                          fill="white"
                        />
                      </svg>
                    }
                    sx={{
                      color: "white",
                      paddingY: "4px",
                      ...(currentView == "animes"
                        ? {
                            backgroundColor: (theme) =>
                              theme.palette.action.focus,
                          }
                        : {}),
                    }}
                  >
                    {formatDisplayNumber(metadata.animesInList)}
                  </Button>
                  <Button
                    onClick={() => changeView(PROFILE_FAVORITES_VIEW)}
                    startIcon={
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.15299 5.408C10.42 3.136 11.053 2 12 2C12.947 2 13.58 3.136 14.847 5.408L15.175 5.996C15.535 6.642 15.715 6.965 15.995 7.178C16.275 7.391 16.625 7.47 17.325 7.628L17.961 7.772C20.421 8.329 21.65 8.607 21.943 9.548C22.235 10.488 21.397 11.469 19.72 13.43L19.286 13.937C18.81 14.494 18.571 14.773 18.464 15.117C18.357 15.462 18.393 15.834 18.465 16.577L18.531 17.254C18.784 19.871 18.911 21.179 18.145 21.76C17.379 22.342 16.227 21.811 13.925 20.751L13.328 20.477C12.674 20.175 12.347 20.025 12 20.025C11.653 20.025 11.326 20.175 10.671 20.477L10.076 20.751C7.77299 21.811 6.62099 22.341 5.85599 21.761C5.08899 21.179 5.21599 19.871 5.46899 17.254L5.53499 16.578C5.60699 15.834 5.64299 15.462 5.53499 15.118C5.42899 14.773 5.18999 14.494 4.71399 13.938L4.27999 13.43C2.60299 11.47 1.76499 10.489 2.05699 9.548C2.34999 8.607 3.57999 8.328 6.03999 7.772L6.67599 7.628C7.37499 7.47 7.72399 7.391 8.00499 7.178C8.28499 6.965 8.46499 6.642 8.82499 5.996L9.15299 5.408Z"
                          fill="white"
                        />
                      </svg>
                    }
                    sx={{
                      color: "white",
                      paddingY: "4px",
                      ...(currentView == "favorites"
                        ? {
                            backgroundColor: (theme) =>
                              theme.palette.action.focus,
                          }
                        : {}),
                    }}
                  >
                    {formatDisplayNumber(metadata.favorites)}
                  </Button>
                  <Button
                    onClick={() => changeView(PROFILE_HISTORY_VIEW)}
                    startIcon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M44.6021 19.4854C45.6027 20.0175 46.4397 20.8119 47.0233 21.7833C47.607 22.7548 47.9154 23.8667 47.9154 25C47.9154 26.1333 47.607 27.2453 47.0233 28.2167C46.4397 29.1881 45.6027 29.9825 44.6021 30.5146L17.9104 45.0292C13.6125 47.3667 8.33331 44.325 8.33331 39.5167V10.4854C8.33331 5.67292 13.6125 2.63334 17.9104 4.96875L44.6021 19.4854Z"
                          fill="white"
                        />
                      </svg>
                    }
                    sx={{
                      color: "white",
                      paddingY: "4px",
                    }}
                  >
                    {formatDisplayNumber(metadata.totalPlays)}
                  </Button>
                </>
              )}
            </Stack>
          </Container>
        </Paper>
        <Paper sx={{ border: 0, boxShadow: 0, marginBottom: 1 }}>
          <Container>
            {currentView == PROFILE_ANIMES_VIEW ? <ProfileAnimes /> : null}
            {currentView == PROFILE_FAVORITES_VIEW ? (
              <ProfileFavorites />
            ) : null}
            {currentView == PROFILE_HISTORY_VIEW ? <ProfileHistory /> : null}
          </Container>
        </Paper>
      </Box>
      <Footer />
    </>
  );
}
