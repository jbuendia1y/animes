/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import {
  ChapterVideo,
  IUpdateChapterVideo,
  UpdateChapterVideo,
} from "../../../models";
import { useEffect, useState } from "react";
import { ChapterVideoService } from "../../../services";
import { z } from "zod";
import {
  Button,
  Modal,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

type Form = IUpdateChapterVideo;

export function EditVideoModal({ videoId, open, onClose }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<Form>();

  const [{ defaultValues, loading }, setDefaultValues] = useState<{
    defaultValues: ChapterVideo["values"] | null;
    loading: boolean;
  }>({
    defaultValues: null,
    loading: true,
  });

  useEffect(() => {
    let subscribe = true;
    const service = new ChapterVideoService();
    service.findOne(videoId).then((v) => {
      if (subscribe)
        setDefaultValues({ defaultValues: v.values, loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, [videoId]);

  const onSubmit = async (data: Form) => {
    let toUpdate: UpdateChapterVideo | undefined = undefined;
    try {
      toUpdate = new UpdateChapterVideo(data);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((v) => {
          const path = v.path[0] as string;
          setError(path as any, { message: v.message });
          return path;
        });
      }
    }

    if (!toUpdate) return;

    const service = new ChapterVideoService();
    await service.update(videoId, toUpdate);
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
          minWidth: "300px",
          maxWidth: "500px",
          padding: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          component="h1"
          marginBottom={1}
        >
          Editar video
        </Typography>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular">
              <TextField />
            </Skeleton>
            <Skeleton variant="rectangular">
              <TextField />
            </Skeleton>
            <Skeleton variant="rectangular">
              <TextField />
            </Skeleton>
            <Skeleton variant="rectangular">
              <TextField />
            </Skeleton>
            <Skeleton variant="rectangular">
              <Button />
            </Skeleton>
          </Stack>
        ) : (
          <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Reproductor"
              error={!!errors.player}
              helperText={errors.player?.message}
              defaultValue={defaultValues?.player}
              {...register("player", { required: true })}
            />
            <TextField
              label="Proveedor"
              error={!!errors.provider}
              helperText={errors.provider?.message}
              defaultValue={defaultValues?.provider}
              {...register("provider", { required: true })}
            />
            <TextField
              label="URL del video"
              type="url"
              error={!!errors.videoURL}
              helperText={errors.videoURL?.message}
              defaultValue={defaultValues?.videoURL}
              {...register("videoURL", { required: true })}
            />
            <TextField
              label="URL del video embebido"
              type="url"
              error={!!errors.embedURL}
              helperText={errors.embedURL?.message}
              defaultValue={defaultValues?.embedURL}
              {...register("embedURL", { required: true })}
            />
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Stack>
        )}
      </Paper>
    </Modal>
  );
}
