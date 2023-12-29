import { Box, IconButton, Stack } from "@mui/material";
import { ProvidersList } from "./ProvidersList";
import { useState } from "react";
import { usePlayer } from "../contexts";
import { EditProvidersButton } from "./EditProvidersButton";
import { SideRoleProtected } from "../../../components";

export function WatchPlayer() {
  const [play, setPlay] = useState(false);
  const { player, selectPlayer, videos, chapter } = usePlayer();

  const handlePlay = () => {
    if (!videos) return;
    if (!player && videos.length > 0) selectPlayer(videos[0].players[0]);
    if (!player) return;
    setPlay(true);
  };

  return (
    <Box>
      <Box position="relative" display="inline-block" width="100%">
        {play && player ? (
          <Box
            component="iframe"
            src={player.embedURL}
            allowFullScreen
            width="100%"
            height={{ xs: "300px", md: "500px", border: 0 }}
          ></Box>
        ) : (
          <>
            <Box
              sx={{
                position: "absolute",

                top: 0,
                left: 0,
                zIndex: 1,
                display: "grid",
                placeContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <IconButton onClick={handlePlay} aria-label="play video">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44.6021 19.4854C45.6027 20.0175 46.4397 20.8119 47.0233 21.7833C47.607 22.7548 47.9154 23.8667 47.9154 25C47.9154 26.1333 47.607 27.2453 47.0233 28.2167C46.4397 29.1881 45.6027 29.9825 44.6021 30.5146L17.9104 45.0292C13.6125 47.3667 8.33331 44.325 8.33331 39.5167V10.4854C8.33331 5.67292 13.6125 2.63334 17.9104 4.96875L44.6021 19.4854Z"
                    fill="white"
                  />
                </svg>
              </IconButton>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: { xs: "300px", md: "500px" },
                background: `url(${
                  chapter?.values.thumbnail ??
                  "https://picsum.photos/700/500.jpg"
                })`,
                filter: "brightness(.5)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </>
        )}
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <ProvidersList />
        {chapter ? (
          <SideRoleProtected role="isAdmin">
            <EditProvidersButton chapterId={chapter.values.id} />
          </SideRoleProtected>
        ) : null}
      </Stack>
    </Box>
  );
}
