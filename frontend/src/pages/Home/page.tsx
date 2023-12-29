import { Box, Container, Typography } from "@mui/material";
import {
  Footer,
  Navbar,
  SearchInput,
  SideRoleProtected,
} from "../../components";
import { NewAnimesList, RecentChaptersList, TrendingList } from "./components";
import { NewAnimeButton } from "../../components/NewAnime";

export function Home() {
  return (
    <>
      <Navbar />
      <Container component="main" sx={{ marginBottom: 5 }}>
        <SideRoleProtected role="isAdmin">
          <NewAnimeButton />
        </SideRoleProtected>

        <Box marginY={2}>
          <SearchInput fullWidth />
        </Box>
        <Box component="section">
          <Typography
            variant="h5"
            fontWeight={"bold"}
            component="h2"
            marginBottom={1.5}
          >
            Populares
          </Typography>
          <TrendingList />
        </Box>
        <Box component="section" marginY={2.5} maxWidth="100%">
          <Typography
            variant="h5"
            fontWeight={"bold"}
            component="h2"
            marginBottom={1.5}
          >
            Recientes
          </Typography>
          <RecentChaptersList />
        </Box>
        <Box component="section">
          <Typography
            variant="h5"
            fontWeight={"bold"}
            component="h2"
            marginBottom={1.5}
          >
            Nuevos animes
          </Typography>
          <NewAnimesList />
        </Box>
      </Container>
      <Footer />
    </>
  );
}
