import { Button, Modal, Paper, Stack, Typography } from "@mui/material";
import { ChapterVideoService } from "../../../services";

interface Props {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

export function DeleteVideoModal({ onClose, open, videoId }: Props) {
  const handleDelete = async () => {
    const service = new ChapterVideoService();
    await service.delete(videoId);
  };

  return (
    <Modal open={open} onClose={onClose} keepMounted>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          width: "90%",
          maxHeight: "90vh",
          minWidth: "300px",
          maxWidth: "500px",

          overflow: "auto",

          padding: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          component="h1"
          marginBottom={1}
        >
          ¿Quieres eliminar este video?
        </Typography>
        <Typography variant="body1" component="p" marginBottom={1}>
          Al eliminarlo no podrás volver a verlo
        </Typography>
        <Stack direction="row" spacing={1.5} justifyContent="left">
          <Button variant="contained" color="primary" onClick={handleDelete}>
            Sí
          </Button>
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}
