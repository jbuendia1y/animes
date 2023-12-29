import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Chapter } from "../../../models/chapter.model";
import { ChaptersService } from "../../../services/chapters.service";

export function WatchHeader({ chapterId }: { chapterId?: string }) {
  const [{ chapter, loading }, setData] = useState<{
    chapter: Chapter | null;
    loading: boolean;
  }>({
    chapter: null,
    loading: true,
  });

  useEffect(() => {
    if (!chapterId) return;
    let subscribe = true;
    const service = new ChaptersService();
    service.findOne(chapterId).then((v) => {
      if (subscribe) setData({ chapter: v, loading: false });
    });

    return () => {
      subscribe = false;
    };
  }, [chapterId]);

  return (
    <Box component="header">
      <Typography fontWeight="bold" variant="h6" component="p">
        {loading ? <Skeleton /> : chapter?.values.canonicalTitle}
      </Typography>
      <Typography fontWeight="bold" variant="h3" component="h1">
        {loading ? <Skeleton /> : `Episodio ${chapter?.values.number}`}
      </Typography>
    </Box>
  );
}
