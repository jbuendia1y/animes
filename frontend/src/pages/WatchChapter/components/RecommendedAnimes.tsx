import { useEffect, useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import { Anime } from "../../../models/anime.model";
import { Box, Link, Skeleton, Stack } from "@mui/material";
import { AnimesService } from "../../../services/animes.service";

export function RecommendedAnimes() {
  const [{ animes, loading }, setData] = useState<{
    animes: Anime[] | null;
    loading: boolean;
  }>({
    animes: null,
    loading: true,
  });

  useEffect(() => {
    let subscribe = true;
    const service = new AnimesService();
    service.find({ tags: ["shonen"] }).then((v) => {
      if (subscribe) setData({ animes: v.values.data, loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, []);

  return (
    <>
      <Stack direction="row" flexWrap={"wrap"} sx={{ gap: 1 }}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" width={250} height="300px" />
            <Skeleton variant="rectangular" width={250} height="300px" />
            <Skeleton variant="rectangular" width={250} height="300px" />
          </>
        ) : (
          animes?.map((v) => (
            <Link
              key={"anime-recomendaded-" + v.values.id}
              component={ReactLink}
              to={`/animes/${v.values.slug}`}
              sx={{
                position: "relative",
                display: "inline-block",
                width: 125,
                minHeight: "175px",
                maxHeight: "225px",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 2,
                /* filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25))", */
              }}
              aria-label={v.values.canonicalTitle}
            >
              <Box
                sx={{
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={v.values.posterImage || undefined}
                  alt={v.values.canonicalTitle}
                  loading="lazy"
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    filter: "brightness(.9)",
                  }}
                />
              </Box>
            </Link>
          ))
        )}
      </Stack>
    </>
  );
}
