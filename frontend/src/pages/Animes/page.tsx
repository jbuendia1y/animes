import {
  Box,
  Container,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import { AnimeCard, Footer, Navbar, SearchInput } from "../../components";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Anime } from "../../models/anime.model";
import { AnimesService } from "../../services/animes.service";
import { usePaginate } from "../../hooks";

const MAX_ITEMS_PER_PAGE = 12;

export function Animes() {
  const location = useLocation();
  const { q: search = "", status } = Object.fromEntries(
    new URLSearchParams(location.search)
  );

  const [{ data, loading }, setData] = useState<{
    data: Anime[] | null;
    loading: boolean;
  }>({ data: null, loading: true });
  const { currentPage, totalPages, changePage, changeTotalItems } = usePaginate(
    {
      pageSize: MAX_ITEMS_PER_PAGE,
      totalItems: 1,
    }
  );

  useEffect(() => {
    setData({ data: null, loading: true });
    const service = new AnimesService();
    const options: { [key: string]: string | number } = {
      offset: (currentPage - 1) * MAX_ITEMS_PER_PAGE,
      limit: MAX_ITEMS_PER_PAGE,
    };
    if (status) options.status = status;
    if (search.length > 0) options.slug = search;
    let subscribe = true;

    service.find(options).then((v) => {
      if (subscribe) {
        changeTotalItems(v.values.meta.total);
        setData({
          data: v.values.data,
          loading: false,
        });
      }
    });

    return () => {
      subscribe = false;
    };
  }, [search, status, currentPage, changeTotalItems]);

  return (
    <>
      <Navbar />
      <Container component="main" sx={{ paddingTop: 1.5, marginBottom: 5 }}>
        <SearchInput fullWidth defaultValue={search} />

        <Pagination
          count={totalPages}
          color="primary"
          size="large"
          defaultValue="1"
          sx={{ display: "flex", justifyContent: "center", marginY: 2 }}
          showFirstButton
          showLastButton
          onChange={(_e, value) => {
            changePage(value);
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
                const values = v.values;
                return (
                  <AnimeCard
                    key={"searched-anime-" + values.slug}
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
                  No se encontraron animes
                </Typography>
              </Box>
            )
          ) : null}
        </Box>
      </Container>
      <Footer />
    </>
  );
}
