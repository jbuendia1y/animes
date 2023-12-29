/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Modal,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Chapter,
  IUpdateChapter,
  UpdateChapter,
} from "../../../models/chapter.model";
import { ChaptersService } from "../../../services/chapters.service";
import { ArrowNextIcon } from "../../../components/icons";
import { useEffect, useState } from "react";

interface Props {
  chapterId: string;
  open: boolean;
  onClose: () => void;
}

type Form = Omit<IUpdateChapter, "animeId">;

const isString = (v: unknown): v is string => typeof v === "string";
const isEmptyString = (v: string) => v.length === 0;

const setEmptyOrStr = (v: unknown) => {
  if (isString(v) && isEmptyString(v)) return undefined;
  else return v;
};

export function EditChapterModal({ chapterId, open, onClose }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<Form>();

  const [{ defaultValues, loading }, setDefaultValues] = useState<{
    defaultValues: Chapter["values"] | null;
    loading: boolean;
  }>({ defaultValues: null, loading: true });

  useEffect(() => {
    let subscribe = true;
    const service = new ChaptersService();
    service.findOne(chapterId).then((v) => {
      if (subscribe) {
        setDefaultValues({ defaultValues: v.values, loading: false });
      }
    });
    return () => {
      subscribe = false;
    };
  }, [chapterId]);

  const onSubmit = async (data: Form) => {
    let toUpdate: UpdateChapter | undefined = undefined;
    try {
      toUpdate = new UpdateChapter(data);
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

    const service = new ChaptersService();
    await service.update(chapterId, toUpdate);
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
          Editar episodio
        </Typography>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <TextField fullWidth />
            </Skeleton>
            <Skeleton variant="rectangular" width="100%">
              <Button fullWidth />
            </Skeleton>
          </Stack>
        ) : (
          <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Miniatura"
              type="url"
              defaultValue={defaultValues?.thumbnail}
              error={!!errors.thumbnail}
              helperText={errors.thumbnail?.message}
              {...register("thumbnail", { required: true })}
            />
            <TextField
              label="Título canónico"
              defaultValue={defaultValues?.canonicalTitle}
              error={!!errors.canonicalTitle}
              helperText={errors.canonicalTitle?.message}
              {...register("canonicalTitle", { required: true })}
            />
            <Accordion
              sx={{
                color: (theme) =>
                  errors.titles
                    ? theme.palette.error.main
                    : theme.palette.text.primary,
              }}
            >
              <AccordionSummary expandIcon={<ArrowNextIcon />}>
                Títulos (opcional)
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <TextField
                    label="en"
                    defaultValue={defaultValues?.titles.en}
                    error={!!errors.titles?.en}
                    helperText={errors.titles?.en?.message}
                    {...register("titles.en", {
                      required: false,
                      setValueAs: setEmptyOrStr,
                    })}
                  />
                  <TextField
                    label="es"
                    defaultValue={defaultValues?.titles.es}
                    error={!!errors.titles?.es}
                    helperText={errors.titles?.es?.message}
                    {...register("titles.es", {
                      required: false,
                      setValueAs: setEmptyOrStr,
                    })}
                  />
                  <TextField
                    label="en_jp"
                    defaultValue={defaultValues?.titles.en_jp}
                    error={!!errors.titles?.en_jp}
                    helperText={errors.titles?.en_jp?.message}
                    {...register("titles.en_jp", {
                      required: false,
                      setValueAs: setEmptyOrStr,
                    })}
                  />
                  <TextField
                    label="ja_jp"
                    defaultValue={defaultValues?.titles.ja_jp}
                    error={!!errors.titles?.ja_jp}
                    helperText={errors.titles?.ja_jp?.message}
                    {...register("titles.ja_jp", {
                      required: false,
                      setValueAs: setEmptyOrStr,
                    })}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
            <TextField
              label="Número"
              type="number"
              defaultValue={defaultValues?.number}
              error={!!errors.number}
              helperText={errors.number?.message}
              {...register("number", { required: true, valueAsNumber: true })}
            />
            <TextField
              label="Descripción"
              multiline
              rows={4}
              defaultValue={defaultValues?.description}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description", { required: true })}
            />
            <TextField
              label="Synopsis"
              multiline
              rows={4}
              defaultValue={defaultValues?.synopsis}
              error={!!errors.synopsis}
              helperText={errors.synopsis?.message}
              {...register("synopsis", { required: true })}
            />
            <TextField
              label="Fecha al aire"
              defaultValue={defaultValues?.airdate}
              error={!!errors.airdate}
              helperText={errors.airdate?.message}
              {...register("airdate", { required: true })}
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
