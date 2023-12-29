import { Box, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { AnimeCard, Carousel } from "../../../components";
import { TrendingsService } from "../services";
import { Trending } from "../models";

export function TrendingList() {
  const [{ data, loading }, setData] = useState<{
    data: Trending[] | null;
    loading: boolean;
  }>({ data: null, loading: true });

  useEffect(() => {
    let subscribe = true;
    const service = new TrendingsService();
    service.find().then((v) => {
      if (subscribe) setData({ data: v, loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, []);

  if (loading)
    return <Skeleton variant="rectangular" width={"100%"} height="300px" />;

  return (
    <Carousel>
      {data?.map((v) => (
        <Box key={"trending-".concat(v.values.id)} sx={{ flexGrow: 1 }}>
          <AnimeCard
            width={250}
            data={{
              id: v.values.id,
              slug: v.values.slug,
              description: "",
              synopsis: "",
              nsfw: false,
              coverImage: v.values.coverImage,
              posterImage: v.values.posterImage,
              createdAt: new Date(),
              updatedAt: new Date(),
              showType: "TV",
              stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              status: "current",
              tags: [],
              titles: {},
              canonicalTitle: v.values.title,
            }}
          />
        </Box>
      ))}
    </Carousel>
  );
}
