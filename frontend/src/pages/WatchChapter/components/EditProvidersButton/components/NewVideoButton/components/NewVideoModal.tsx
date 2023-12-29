/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CreateChapterVideo, ICreateChapterVideo } from "../../../../../models";
import { useForm } from "react-hook-form";
import { ChapterVideoService } from "../../../../../services";
import { z } from "zod";

interface Props {
  chapterId: string;
  open: boolean;
  onClose: () => void;
}

type Form = Omit<ICreateChapterVideo, "chapterId">;

export function NewVideoModal({ chapterId, open, onClose }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    let toCreate: CreateChapterVideo | undefined;

    try {
      toCreate = new CreateChapterVideo({ ...data, chapterId });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((v) => {
          const path = v.path[0] as string;
          setError(path as any, { message: v.message });
          return path;
        });
      }
    }

    if (!toCreate) return;

    const service = new ChapterVideoService();
    await service.save(toCreate);
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
          Nuevo video
        </Typography>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Reproductor"
            error={!!errors.player}
            helperText={errors.player?.message}
            {...register("player", { required: true })}
          />
          <TextField
            label="Proveedor"
            error={!!errors.provider}
            helperText={errors.provider?.message}
            {...register("provider", { required: true })}
          />
          <TextField
            label="URL del video"
            type="url"
            error={!!errors.videoURL}
            helperText={errors.videoURL?.message}
            {...register("videoURL", { required: true })}
          />
          <TextField
            label="URL del video embebido"
            type="url"
            error={!!errors.embedURL}
            helperText={errors.embedURL?.message}
            {...register("embedURL", { required: true })}
          />

          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}
