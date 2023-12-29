import { Box, Pagination, Skeleton, Typography } from "@mui/material";
import { AnimeCard } from "../../../components";
import { useAuth, usePaginate } from "../../../hooks";
import { useEffect, useState } from "react";
import { Anime } from "../../../models/anime.model";
import { FavoritesService } from "../../../services/favorites.service";
import { AnimesService } from "../../../services/animes.service";

const MAX_ITEMS_PER_PAGE = 12;

export function ProfileFavorites() {
  const { user } = useAuth();
  const [{ list: data, loading }, setData] = useState<{
    list: { anime: Anime; stars: number; userId: string; id: string }[] | null;
    loading: boolean;
  }>({
    list: null,
    loading: true,
  });

  const { changeTotalItems, currentPage, changePage, totalPages } = usePaginate(
    {
      pageSize: MAX_ITEMS_PER_PAGE,
      totalItems: 1,
    }
  );

  useEffect(() => {
    if (!user) return;
    const service = new FavoritesService();
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
              stars: data.values.stars,
              userId: data.values.userId,
              id: data.values.id,
            };
          })
        );
        changeTotalItems(values.meta.total);
        setData({
          list: animeList,
          loading: false,
        });
      });
  }, [changeTotalItems, currentPage, user]);

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
                  key={"favorite-anime-" + values.slug}
                  width={"100%"}
                  data={values}
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
