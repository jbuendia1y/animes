import { Box, Container, Typography } from "@mui/material";
import { Navbar, SideRoleProtected } from "../../components";
import {
  RecommendedAnimes,
  WatchHeader,
  WatchPlayer,
  WatchChapterNav,
  ChapterOptionsButton,
} from "./components";
import { useParams } from "react-router-dom";
import { PlayerProvider } from "./contexts";
import { useEffect } from "react";

export function WatchChapter() {
  const { chapterId } = useParams();

  useEffect(() => {
    if (!chapterId) return;
    let subscribe = true;
    setTimeout(async () => {
      const service = await import(
        "../../services/user-chapter-history.service"
      ).then((m) => new m.UserChapterHistoryService());

      if (subscribe) await service.create({ chapterId });
    }, 60_000);

    return () => {
      subscribe = false;
    };
  }, [chapterId]);

  return (
    <>
      <Navbar />
      <Container
        component="main"
        sx={{
          display: { xs: "block", md: "flex" },
          gap: { md: 2 },
          flexDirection: "column",
          marginTop: 1,
        }}
      >
        <WatchHeader chapterId={chapterId} />
        <Box sx={{ display: { md: "flex" }, gap: { md: 2 } }}>
          <Box flexGrow={1}>
            <WatchChapterNav chapterId={chapterId} />
            <PlayerProvider chapterId={chapterId}>
              <WatchPlayer />
            </PlayerProvider>
          </Box>
          <Box minWidth={250} maxWidth={300}>
            <Typography component="h3" variant="h6" fontWeight="bold">
              Recomendados
            </Typography>
            <RecommendedAnimes />
          </Box>
        </Box>
        {chapterId ? (
          <SideRoleProtected role="isAdmin">
            <ChapterOptionsButton chapterId={chapterId} />
          </SideRoleProtected>
        ) : null}
      </Container>
    </>
  );
}
