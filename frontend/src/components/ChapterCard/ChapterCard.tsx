import { Link as ReactLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";

interface Props {
  image: string;
  title: string;
  chapterId: string;
  chapter: number;

  width?: number | string;
}

export const ChapterCard = (props: Props) => {
  const { image, chapterId, title, chapter, width = "100%" } = props;

  return (
    <Link
      component={ReactLink}
      to={`/watch/${chapterId}`}
      sx={{
        position: "relative",
        display: "inline-block",
        width,
        minHeight: "250px",
        maxHeight: "300px",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 2,
      }}
    >
      <Box
        sx={{
          height: "100%",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          loading="lazy"
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
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
        <Typography fontWeight="bold" color="white" fontSize="1rem">
          {title}
        </Typography>
        <Typography
          fontWeight="bold"
          color="white"
          fontSize="1.7rem"
          marginBottom={1}
        >
          Capítulo {chapter}
        </Typography>
      </Box>
    </Link>
  );
};
