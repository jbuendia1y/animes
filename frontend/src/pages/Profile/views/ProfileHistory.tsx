import { useEffect, useState } from "react";
import { useAuth, usePaginate } from "../../../hooks";
import { UserChapterHistoryService } from "../../../services/user-chapter-history.service";
import {
  Box,
  Divider,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Chapter } from "../../../models/chapter.model";
import { ChaptersService } from "../../../services/chapters.service";
import { Link } from "react-router-dom";

interface UserChapterHistoryData {
  id: string;
  createdAt: Date;
  chapter: Chapter;
}
const MAX_ITEMS_PER_PAGE = 12;

export function ProfileHistory() {
  const { user } = useAuth();
  const [{ list: data, loading }, setData] = useState<{
    list: UserChapterHistoryData[] | null;
    loading: boolean;
  }>({
    list: null,
    loading: true,
  });

  const { totalPages, currentPage, changeTotalItems, changePage } = usePaginate(
    { pageSize: MAX_ITEMS_PER_PAGE, totalItems: 1 }
  );

  useEffect(() => {
    if (!user) return;
    setData((v) => ({ ...v, loading: true }));

    const service = new UserChapterHistoryService();
    service
      .find({
        limit: MAX_ITEMS_PER_PAGE,
        offset: (currentPage - 1) * MAX_ITEMS_PER_PAGE,
      })
      .then(async (v) => {
        const chapterService = new ChaptersService();
        const history = await Promise.all(
          v.values.data.map(async (h) => {
            const chapter = await chapterService.findOne(h.values.chapterId);
            return {
              id: h.values.id,
              chapter,
              createdAt: h.values.createdAt,
            };
          })
        );

        changeTotalItems(v.values.meta.total);
        setData({
          list: history,
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
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
          </>
        ) : data ? (
          data.length > 0 ? (
            data.map((v) => {
              const chapter = v.chapter.values;
              return (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  maxWidth="100%"
                  component={Link}
                  to={`/watch/${chapter.id}`}
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    ":hover": {
                      backgroundColor: "#dbdbdb",
                    },
                  }}
                >
                  <Box
                    component="img"
                    sx={{ width: 100, height: 56 }}
                    src={chapter.thumbnail}
                    alt={chapter.canonicalTitle}
                    loading="lazy"
                  />
                  <Divider orientation="vertical" sx={{ height: "45px" }} />
                  <Box>
                    <Typography variant="h6" component="h3" fontWeight="bold">
                      Episodio {chapter.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="p"
                      color={(theme) => theme.palette.text.secondary}
                    >
                      {chapter.airdate}
                    </Typography>
                  </Box>
                </Stack>
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
                No se encontraron animes en tu historial
              </Typography>
            </Box>
          )
        ) : null}
      </Box>
    </>
  );
}
