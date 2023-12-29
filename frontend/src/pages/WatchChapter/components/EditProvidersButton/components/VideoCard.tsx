import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { ChapterVideo } from "../../../models";
import { DeleteIcon, EditIcon } from "../../../../../components/icons";
import { useState } from "react";
import { EditVideoModal } from "./EditVideoModal";
import { DeleteVideoModal } from "./DeleteVideoModal";

export function VideoCard({ data }: { data: ChapterVideo["values"] }) {
  const [{ open, current }, setModal] = useState({ open: false, current: "" });

  const onEdit = () => {
    setModal({ open: true, current: "edit" });
  };
  const onDelete = () => {
    setModal({ open: true, current: "delete" });
  };

  const handleClose = () => setModal({ open: false, current: "" });

  return (
    <>
      <Paper sx={{ padding: 1 }}>
        <Stack direction="row-reverse" justifyContent="space-between">
          <Box>
            <IconButton onClick={onEdit}>
              <EditIcon color="black" />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon color="black" />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="bold" component="p">
              {data.provider}
            </Typography>
            <Typography variant="h5" fontWeight="bold" component="h2">
              {data.player}
            </Typography>
          </Box>
        </Stack>
        <Typography>Video: {data.videoURL}</Typography>
        <Typography>Embed: {data.embedURL}</Typography>
      </Paper>
      {current === "edit" ? (
        <EditVideoModal videoId={data.id} open={open} onClose={handleClose} />
      ) : null}
      {current === "delete" ? (
        <DeleteVideoModal videoId={data.id} open={open} onClose={handleClose} />
      ) : null}
    </>
  );
}
