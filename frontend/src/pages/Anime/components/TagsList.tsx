import { Chip, Stack } from "@mui/material";
import { AnimeTag } from "../../../models/anime.model";

interface Props {
  tags: AnimeTag[] | null;
}

export function TagsList({ tags }: Props) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {tags?.map((tag) => (
        <Chip
          label={tag.slug}
          key={tag.slug}
          color="primary"
          variant="outlined"
        />
      ))}
    </Stack>
  );
}
