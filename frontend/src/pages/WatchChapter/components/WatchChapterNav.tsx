import { Link, Skeleton, Stack, Typography } from "@mui/material";
import { NextChapterButton, PreviousChapterButton } from ".";
import { Link as ReactLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChaptersService } from "../../../services/chapters.service";
import { AnimesService } from "../../../services/animes.service";

export function WatchChapterNav({ chapterId }: { chapterId?: string }) {
  const [{ loading, ...data }, setData] = useState({
    canNext: false,
    canPrev: false,
    slug: "",
    next: "",
    prev: "",
    loading: true,
  });

  useEffect(() => {
    if (!chapterId) return;

    const service = new ChaptersService();
    service
      .findOne(chapterId)
      .then(async (v) => {
        const animeId = v.values.animeId;
        const animeService = new AnimesService();
        return Promise.all([
          animeService.findOne(animeId),
          service.find({ animeId, number: v.values.number - 1 }),
          service.find({ animeId, number: v.values.number + 1 }),
        ]);
      })
      .then(([anime, prev, next]) => {
        const prevChapters = prev.values.data;
        const nextChapters = next.values.data;

        setData({
          canNext: nextChapters.length > 0,
          canPrev: prevChapters.length > 0,
          loading: false,
          next: nextChapters.length === 0 ? "" : nextChapters[0].values.id,
          prev: prevChapters.length === 0 ? "" : prevChapters[0].values.id,
          slug: anime.values.slug,
        });
      });
  }, [chapterId]);

  if (loading) return <Skeleton variant="rectangular" />;

  return (
    <Stack direction="row" justifyContent="space-around" boxShadow={1}>
      <PreviousChapterButton
        canBack={data.canPrev}
        href={`/watch/${data.prev}`}
      />

      <Link
        component={ReactLink}
        to={`/animes/${data.slug}#episodes`}
        sx={{ display: "flex", gap: 1, alignItems: "center" }}
      >
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3125 10C18.3125 10.2486 18.2137 10.4871 18.0379 10.6629C17.8621 10.8387 17.6236 10.9375 17.375 10.9375H3.625C3.37636 10.9375 3.1379 10.8387 2.96209 10.6629C2.78627 10.4871 2.6875 10.2486 2.6875 10C2.6875 9.75136 2.78627 9.5129 2.96209 9.33709C3.1379 9.16127 3.37636 9.0625 3.625 9.0625H17.375C17.6236 9.0625 17.8621 9.16127 18.0379 9.33709C18.2137 9.5129 18.3125 9.75136 18.3125 10ZM3.625 5.9375H17.375C17.6236 5.9375 17.8621 5.83873 18.0379 5.66291C18.2137 5.4871 18.3125 5.24864 18.3125 5C18.3125 4.75136 18.2137 4.5129 18.0379 4.33709C17.8621 4.16127 17.6236 4.0625 17.375 4.0625H3.625C3.37636 4.0625 3.1379 4.16127 2.96209 4.33709C2.78627 4.5129 2.6875 4.75136 2.6875 5C2.6875 5.24864 2.78627 5.4871 2.96209 5.66291C3.1379 5.83873 3.37636 5.9375 3.625 5.9375ZM17.375 14.0625H3.625C3.37636 14.0625 3.1379 14.1613 2.96209 14.3371C2.78627 14.5129 2.6875 14.7514 2.6875 15C2.6875 15.2486 2.78627 15.4871 2.96209 15.6629C3.1379 15.8387 3.37636 15.9375 3.625 15.9375H17.375C17.6236 15.9375 17.8621 15.8387 18.0379 15.6629C18.2137 15.4871 18.3125 15.2486 18.3125 15C18.3125 14.7514 18.2137 14.5129 18.0379 14.3371C17.8621 14.1613 17.6236 14.0625 17.375 14.0625Z"
            fill="#C81973"
          />
        </svg>

        <Typography variant="h6" component="span" fontWeight="bold">
          Episodios
        </Typography>
      </Link>

      <NextChapterButton canNext={data.canNext} href={`/watch/${data.next}`} />
    </Stack>
  );
}
