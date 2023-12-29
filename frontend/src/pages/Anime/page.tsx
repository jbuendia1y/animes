import {
  Box,
  Container,
  Divider,
  Rating,
  Skeleton,
  Typography,
} from "@mui/material";
import { Footer, Navbar, SideRoleProtected } from "../../components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Anime as AnimeModel } from "../../models/anime.model";
import {
  NewChapterButton,
  AddToListButton,
  ChaptersList,
  FavoriteButton,
  TagsList,
} from "./components";
import { AnimesService } from "../../services/animes.service";
import { getStarsMedian } from "./utils";
import { EditAnimeButton } from "../../components/EditAnimeButton";

export function Anime() {
  const { slug } = useParams();
  const [{ anime, loading }, setData] = useState<{
    anime: AnimeModel | null;
    loading: boolean;
  }>({
    anime: null,
    loading: true,
  });

  useEffect(() => {
    let subscribe = true;
    const service = new AnimesService();
    service.find({ slug }).then((v) => {
      if (subscribe) setData({ anime: v.values.data[0], loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, [slug]);

  if (!loading && !anime)
    return (
      <>
        <Navbar /> <p>404 page</p>
      </>
    );

  return (
    <>
      <Navbar />
      <Box component="main" marginBottom={5}>
        <Box component="header">
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={335} />
              <Container>
                <Typography variant="h4">
                  <Skeleton />
                </Typography>
                <Skeleton variant="rectangular" height={35} />
                <Divider sx={{ marginY: 1 }} />
                <Skeleton variant="rectangular" height={75} />
              </Container>
            </>
          ) : (
            <>
              <Box
                display={{ xs: "none", md: "block" }}
                maxHeight={335}
                minHeight={200}
                overflow="hidden"
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "block",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient( 360deg, rgba(0, 0, 0, 0.6) 0%, rgba(217, 217, 217, 0) 100% )",
                  }}
                ></Box>
                <Box
                  component="img"
                  maxWidth="100%"
                  maxHeight="100%"
                  sx={{
                    objectFit: "fill",
                    width: "100%",
                    height: "100%",
                  }}
                  src={anime?.values.coverImage || ""}
                  alt={anime?.values.canonicalTitle}
                />
              </Box>
              <Box
                maxWidth={{ xs: "100%", md: "900px", lg: "1000px" }}
                sx={{
                  display: {
                    md: "flex",
                  },
                  marginX: { md: "auto" },
                }}
              >
                <Box
                  maxHeight={335}
                  maxWidth={{ md: "300px" }}
                  height={{ md: "100%" }}
                  overflow="hidden"
                  sx={{
                    borderRadius: { md: "10px" },
                    transform: {
                      md: "translateY(-35px)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    maxWidth="100%"
                    maxHeight="100%"
                    sx={{
                      objectFit: "fill",
                      width: "100%",
                      height: "100%",
                    }}
                    src={anime?.values.posterImage || ""}
                    alt={anime?.values.canonicalTitle}
                  />
                </Box>
                <Container sx={{ flexGrow: { md: 1 } }}>
                  <Typography component="h1" variant="h4" fontWeight="bold">
                    {anime?.values.canonicalTitle}
                  </Typography>
                  <Box
                    marginY={1}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <Rating
                      value={
                        anime?.values.stars
                          ? getStarsMedian(anime.values.stars)
                          : 0
                      }
                      max={5}
                      readOnly
                      size="large"
                      icon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.15299 5.408C10.42 3.136 11.053 2 12 2C12.947 2 13.58 3.136 14.847 5.408L15.175 5.996C15.535 6.642 15.715 6.965 15.995 7.178C16.275 7.391 16.625 7.47 17.325 7.628L17.961 7.772C20.421 8.329 21.65 8.607 21.943 9.548C22.235 10.488 21.397 11.469 19.72 13.43L19.286 13.937C18.81 14.494 18.571 14.773 18.464 15.117C18.357 15.462 18.393 15.834 18.465 16.577L18.531 17.254C18.784 19.871 18.911 21.179 18.145 21.76C17.379 22.342 16.227 21.811 13.925 20.751L13.328 20.477C12.674 20.175 12.347 20.025 12 20.025C11.653 20.025 11.326 20.175 10.671 20.477L10.076 20.751C7.77299 21.811 6.62099 22.341 5.85599 21.761C5.08899 21.179 5.21599 19.871 5.46899 17.254L5.53499 16.578C5.60699 15.834 5.64299 15.462 5.53499 15.118C5.42899 14.773 5.18999 14.494 4.71399 13.938L4.27999 13.43C2.60299 11.47 1.76499 10.489 2.05699 9.548C2.34999 8.607 3.57999 8.328 6.03999 7.772L6.67599 7.628C7.37499 7.47 7.72399 7.391 8.00499 7.178C8.28499 6.965 8.46499 6.642 8.82499 5.996L9.15299 5.408Z"
                            fill="#FFC900"
                          />
                        </svg>
                      }
                      emptyIcon={
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.6853 6.23481L10.6853 6.23486L10.3437 6.84718C10.3275 6.87628 10.3115 6.905 10.2958 6.93334C9.96807 7.52226 9.73192 7.94666 9.35554 8.23298L9.35486 8.2335C8.97414 8.52208 8.50864 8.62697 7.87093 8.77067C7.84063 8.7775 7.80994 8.78441 7.77885 8.79144C7.7788 8.79145 7.77874 8.79147 7.77868 8.79148L7.11635 8.94144L7.11617 8.94148C5.81803 9.23488 4.90268 9.4435 4.26835 9.69356C3.64362 9.93983 3.42018 10.1772 3.33446 10.4522C3.24749 10.7327 3.29794 11.0721 3.66881 11.6613C4.04315 12.256 4.66842 12.9892 5.55252 14.0225L5.55276 14.0228L6.00451 14.5515C6.00462 14.5517 6.00473 14.5518 6.00484 14.5519C6.00484 14.5519 6.00485 14.5519 6.00485 14.5519C6.02561 14.5762 6.0461 14.6001 6.06634 14.6237C6.50208 15.132 6.81572 15.4979 6.95736 15.9574C7.10029 16.4139 7.05316 16.8981 6.98683 17.5796C6.98378 17.611 6.98069 17.6427 6.97757 17.6749L6.97753 17.6753L6.90883 18.379C6.90882 18.3791 6.90881 18.3792 6.9088 18.3793C6.77548 19.7583 6.68189 20.7377 6.71378 21.4509C6.74562 22.163 6.89851 22.4619 7.11651 22.6273C7.32511 22.7854 7.6261 22.8452 8.27362 22.6596C8.92742 22.4722 9.78564 22.0788 11.001 21.5194C11.001 21.5194 11.001 21.5194 11.0011 21.5194L11.6205 21.2341C11.6489 21.221 11.6769 21.2081 11.7046 21.1953C12.3021 20.9194 12.7396 20.7173 13.2143 20.7173C13.6896 20.7173 14.1274 20.9198 14.7251 21.1963C14.7521 21.2087 14.7793 21.2213 14.8069 21.2341C14.807 21.2341 14.8071 21.2342 14.8072 21.2342L15.428 21.5191L15.4286 21.5194C16.6436 22.0789 17.5014 22.4725 18.1552 22.6599C18.8025 22.8454 19.1036 22.7854 19.3128 22.6265L19.3132 22.6262C19.5304 22.4615 19.6832 22.1631 19.7149 21.4508C19.7467 20.7378 19.6531 19.7583 19.5198 18.3794L10.6853 6.23481ZM10.6853 6.23481C11.3534 5.03682 11.8278 4.18854 12.2534 3.63279C12.6788 3.07741 12.9608 2.94128 13.2143 2.94128C13.4677 2.94128 13.7498 3.07741 14.1751 3.63279C14.6007 4.18854 15.0751 5.03682 15.7432 6.23481L15.7432 6.23486L16.0848 6.84718C16.0848 6.84724 16.0849 6.8473 16.0849 6.84736C16.1011 6.8764 16.117 6.90506 16.1328 6.93334C16.4605 7.52226 16.6966 7.94666 17.073 8.23298C17.4528 8.52191 17.9197 8.62695 18.557 8.77033C18.5878 8.77727 18.6191 8.7843 18.6507 8.79144C18.6508 8.79144 18.6508 8.79145 18.6508 8.79145C18.6509 8.79147 18.651 8.79149 18.6511 8.79151L19.3132 8.94144C20.6115 9.2354 21.5266 9.44399 22.1607 9.69395C22.7851 9.94007 23.0083 10.1771 23.0941 10.4521C23.181 10.732 23.1308 11.071 22.7597 11.6605C22.3854 12.2553 21.7601 12.9887 20.8759 14.0226L20.424 14.5505L20.4237 14.5508C20.4022 14.576 20.381 14.6009 20.36 14.6254C19.9248 15.1339 19.6124 15.499 19.4702 15.9563L19.47 15.9567C19.3282 16.414 19.3754 16.8976 19.4419 17.5801C19.4449 17.6109 19.4479 17.6422 19.451 17.6739L19.451 17.6742L19.5197 18.379L10.6853 6.23481Z"
                            fill="white"
                            stroke="#1973C8"
                          />
                        </svg>
                      }
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <AddToListButton animeId={anime?.getAnimeId()} />
                      <FavoriteButton animeId={anime?.getAnimeId()} />
                    </Box>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.7,
                      paddingY: 0.7,
                      backgroundColor: anime?.values.status
                        .toLocaleLowerCase()
                        .includes("current")
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      color: theme.palette.common.white,
                      borderRadius: 1,
                    })}
                  >
                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.5 1.4375C9.50983 1.4375 7.56435 2.02766 5.90958 3.13334C4.25481 4.23902 2.96507 5.81057 2.20347 7.64925C1.44186 9.48793 1.24259 11.5112 1.63085 13.4631C2.01912 15.415 2.97748 17.208 4.38474 18.6153C5.79201 20.0225 7.58497 20.9809 9.53691 21.3692C11.4888 21.7574 13.5121 21.5581 15.3508 20.7965C17.1894 20.0349 18.761 18.7452 19.8667 17.0904C20.9723 15.4357 21.5625 13.4902 21.5625 11.5C21.5625 8.83126 20.5023 6.27182 18.6153 4.38474C16.7282 2.49765 14.1687 1.4375 11.5 1.4375ZM16.8525 12.1433L8.22754 16.4558C8.11793 16.5106 7.99614 16.5364 7.87374 16.5308C7.75133 16.5253 7.63238 16.4886 7.52817 16.4241C7.42396 16.3597 7.33796 16.2696 7.27834 16.1626C7.21872 16.0555 7.18745 15.935 7.1875 15.8125V7.1875C7.18757 7.06503 7.21893 6.94461 7.2786 6.83766C7.33828 6.73072 7.42429 6.64079 7.52848 6.57642C7.63266 6.51205 7.75157 6.47537 7.87392 6.46986C7.99626 6.46435 8.11798 6.49019 8.22754 6.54494L16.8525 10.8574C16.9718 10.9172 17.072 11.0089 17.1421 11.1224C17.2121 11.2359 17.2492 11.3666 17.2492 11.5C17.2492 11.6334 17.2121 11.7641 17.1421 11.8776C17.072 11.9911 16.9718 12.0828 16.8525 12.1426V12.1433Z"
                        fill="white"
                      />
                    </svg>

                    <Typography fontWeight={"bold"}>
                      {anime?.values.status}
                    </Typography>
                  </Box>
                  <Divider sx={{ marginY: 1.5 }} />
                  {anime ? <TagsList tags={anime.values.tags} /> : null}
                  <Typography component="h2" variant="h5" fontWeight="bold">
                    Synopsis
                  </Typography>
                  <Typography>{anime?.values.synopsis}</Typography>
                </Container>
              </Box>
            </>
          )}
        </Box>
        <Container
          sx={{
            maxWidth: { xs: "100%", md: "900px", lg: "1000px" },
            paddingX: { md: "0" },
          }}
        >
          <section id="episodes">
            <Typography
              component="h2"
              variant="h5"
              fontWeight="bold"
              marginBottom={2}
            >
              Episodios
            </Typography>

            {anime ? (
              <>
                <SideRoleProtected role="isAdmin">
                  <NewChapterButton animeId={anime.getAnimeId()} />
                </SideRoleProtected>
                <ChaptersList animeId={anime.getAnimeId()} />
              </>
            ) : null}
          </section>
        </Container>
      </Box>
      <SideRoleProtected role="isAdmin">
        <EditAnimeButton animeId={anime?.getAnimeId()} />
      </SideRoleProtected>

      <Footer />
    </>
  );
}
