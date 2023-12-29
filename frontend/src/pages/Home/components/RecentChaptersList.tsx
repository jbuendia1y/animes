import { Box, Skeleton } from "@mui/material";
import { ChapterCard } from "../../../components";
import { useEffect, useState } from "react";
import { ChaptersService } from "../../../services/chapters.service";
import { Chapter } from "../../../models/chapter.model";

export function RecentChaptersList() {
  const [{ data, loading }, setData] = useState<{
    data: Chapter[] | null;
    loading: boolean;
  }>({ data: null, loading: true });

  useEffect(() => {
    let subscribe = true;
    const service = new ChaptersService();
    service.find({ sort: { createdAt: -1 }, limit: 10 }).then((v) => {
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
        boxSizing: "border-box",
        gap: 1.5,
        gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
        maxWidth: "100%",
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
          return (
            <ChapterCard
              key={"recent-chapter-" + values.id}
              chapter={values.number}
              image={values.thumbnail}
              chapterId={values.id}
              title={values.canonicalTitle}
            />
          );
        })
      )}
    </Box>
  );
}
