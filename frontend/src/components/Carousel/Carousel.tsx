import { Box, IconButton, Stack } from "@mui/material";
import { useSnapCarousel } from "react-snap-carousel";
import { ArrowNextIcon, ArrowPrevIcon } from "../icons";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

export function Carousel({ children }: Props) {
  const { next, prev, scrollRef, activePageIndex, snapPointIndexes } =
    useSnapCarousel();

  const totalIndexPoints = snapPointIndexes.size - 1;
  const canNext = activePageIndex + 1 <= totalIndexPoints;
  const canPrev = activePageIndex - 1 >= 0;

  return (
    <Box position="relative">
      <IconButton
        onClick={prev}
        disabled={!canPrev}
        size="small"
        sx={{
          position: "absolute",
          left: 0,
          top: "calc(50% - 15px)",
          zIndex: 2,
          backgroundColor: "white",
          ":hover": {
            backgroundColor: "rgb(218, 218, 218)",
          },
        }}
      >
        <ArrowPrevIcon
          {...(!canPrev
            ? {
                color: "#9E9E9E",
              }
            : {})}
        />
      </IconButton>
      <IconButton
        onClick={next}
        disabled={!canNext}
        size="small"
        sx={{
          position: "absolute",
          right: 0,
          top: "calc(50% - 15px)",
          zIndex: 2,
          backgroundColor: "white",
          ":hover": {
            backgroundColor: "rgb(218, 218, 218)",
          },
        }}
      >
        {" "}
        <ArrowNextIcon
          {...(!canNext
            ? {
                color: "#9E9E9E",
              }
            : {})}
        />
      </IconButton>
      <Stack
        ref={scrollRef}
        direction="row"
        spacing={1.5}
        flexWrap="nowrap"
        overflow="auto"
      >
        {children}
      </Stack>
    </Box>
  );
}
