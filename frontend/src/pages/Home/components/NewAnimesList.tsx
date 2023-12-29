import { Box, Skeleton } from "@mui/material";
import { AnimeCard } from "../../../components";
import { useEffect, useState } from "react";
import { AnimesService } from "../../../services/animes.service";
import { Anime } from "../../../models/anime.model";

export function NewAnimesList() {
  const [{ data, loading }, setData] = useState<{
    data: Anime[] | null;
    loading: boolean;
  }>({ data: null, loading: true });

  useEffect(() => {
    let subscribe = true;
    const service = new AnimesService();
    service.find({ limit: 10, sort: { createdAt: -1 } }).then((v) => {
      if (subscribe) setData({ data: v.values.data, loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
      }}
    >
      {loading ? (
        <>
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ minHeight: "250px", maxHeight: "300px", borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ minHeight: "250px", maxHeight: "300px", borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ minHeight: "250px", maxHeight: "300px", borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ minHeight: "250px", maxHeight: "300px", borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ minHeight: "250px", maxHeight: "300px", borderRadius: 2 }}
          />
        </>
      ) : (
        data?.map((v) => {
          const values = v.values;
          return <AnimeCard key={"news-animes-" + values.id} data={values} />;
        })
      )}
    </Box>
  );
}
