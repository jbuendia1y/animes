import { Box, Pagination, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AnimeCard } from "../../../components";
import { UserAnimesService } from "../../../services/user-animes.service";
import { useAuth, usePaginate } from "../../../hooks";
import { Anime } from "../../../models/anime.model";
import { AnimesService } from "../../../services/animes.service";

const MAX_ITEMS_PER_PAGE = 12;

export function ProfileAnimes() {
  const { user } = useAuth();
  const [{ list: data, loading }, setData] = useState<{
    list: { anime: Anime; id: string }[] | null;
    loading: boolean;
  }>({
    list: null,
    loading: true,
  });
  const { currentPage, changeTotalItems, totalPages, changePage } = usePaginate(
    {
      totalItems: 1,
      pageSize: MAX_ITEMS_PER_PAGE,
    }
  );

  useEffect(() => {
    if (!user) return;
    setData((v) => ({ ...v, loading: true }));
    const service = new UserAnimesService();
    service
      .find({
        limit: MAX_ITEMS_PER_PAGE,
        offset: (currentPage - 1) * MAX_ITEMS_PER_PAGE,
      })
      .then(async (v) => {
        const values = v.values;
        const animesService = new AnimesService();
        const animeList = await Promise.all(
          values.data.map(async (data) => {
            const anime = await animesService.findOne(data.values.animeId);
            return {
              anime,
              id: data.values.id,
            };
          })
        );

        changeTotalItems(values.meta.total);
        setData(() => ({
          list: animeList,
          loading: false,
        }));
      });
  }, [user, currentPage, changeTotalItems]);

  return (
    <>
      <Pagination
        count={totalPages}
        color="primary"
        size="large"
        defaultValue="1"
        sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
        showFirstButton
        showLastButton
        onChange={(_event, page) => {
          changePage(page);
        }}
      />
      <Box
        sx={{
          display: loading
            ? "grid"
            : data
            ? data.length > 0
              ? "grid"
              : "block"
            : "block",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="rectangular" height="300px" />
            <Skeleton variant="rectangular" height="300px" />
            <Skeleton variant="rectangular" height="300px" />
            <Skeleton variant="rectangular" height="300px" />
          </>
        ) : data ? (
          data.length > 0 ? (
            data.map((v) => {
              const values = v.anime.values;
              return (
                <AnimeCard
                  key={"my-saved-anime-" + values.slug}
                  width={"100%"}
                  data={v.anime.values}
                />
              );
            })
          ) : (
            <Box
              display="grid"
              sx={{ placeContent: "center", minHeight: "50vh" }}
            >
              <Box
                component="img"
                src="/sleep-cat.png"
                alt="sleeping cat"
                sx={{ transform: "translateY(70px) translateX(-26px)" }}
              />
              <Typography
                component="p"
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                zIndex={1}
              >
                No se encontraron animes en tu lista
              </Typography>
            </Box>
          )
        ) : null}
      </Box>
    </>
  );
}
