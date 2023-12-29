import { Link as ReactLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";
import { IAnime } from "../../models/anime.model";

interface Props {
  data: IAnime;
  width?: number | string;
}

export const AnimeCard = (props: Props) => {
  const {
    data: { slug, canonicalTitle: title, posterImage: image },
    width = "100%",
  } = props;

  return (
    <Link
      component={ReactLink}
      to={`/animes/${slug}`}
      sx={{
        position: "relative",
        display: "inline-block",
        width,
        minHeight: "250px",
        maxHeight: "300px",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 2,
        /* filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25))", */
      }}
    >
      <Box
        sx={{
          height: "100%",
        }}
      >
        <Box
          component="img"
          src={image || undefined}
          alt={title}
          loading="lazy"
          sx={{
            width: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          padding: "0 10px",

          position: "absolute",
          top: 0,
          left: 0,

          background:
            "linear-gradient( 360deg, rgba(0, 0, 0, 0.6) 0%, rgba(217, 217, 217, 0) 100% )",
        }}
      >
        <Typography
          fontWeight="bold"
          color="white"
          fontSize="1.5rem"
          marginBottom={1}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
};
