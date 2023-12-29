import { Box, Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  number: number;
  thumbnail: string;
  airdate: string;
}

export function ChapterItem({ id, title, number, thumbnail, airdate }: Props) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      maxWidth="100%"
      component={Link}
      to={`/watch/${id}`}
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
        src={thumbnail}
        alt={title}
        loading="lazy"
      />
      <Divider orientation="vertical" sx={{ height: "45px" }} />
      <Box>
        <Typography variant="h6" component="h3" fontWeight="bold">
          Episodio {number}
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color={(theme) => theme.palette.text.secondary}
        >
          {airdate}
        </Typography>
      </Box>
    </Stack>
  );
}
