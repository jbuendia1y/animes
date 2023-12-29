/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CreateChapter,
  ICreateChapter,
} from "../../../../../models/chapter.model";
import { z } from "zod";
import { ChaptersService } from "../../../../../services/chapters.service";
import { ArrowNextIcon } from "../../../../../components/icons";
import { useForm } from "react-hook-form";

interface Props {
  animeId: string;
  open: boolean;
  onClose: () => void;
}

type Form = Omit<ICreateChapter, "animeId">;

const isString = (v: unknown): v is string => typeof v === "string";
const isEmptyString = (v: string) => v.length === 0;

const setEmptyOrStr = (v: unknown) => {
  if (isString(v) && isEmptyString(v)) return undefined;
  else return v;
};

export function NewChapterModal({ animeId, open, onClose }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    let toCreate: CreateChapter | undefined = undefined;
    try {
      toCreate = new CreateChapter({ ...(data as any), animeId });
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

    const service = new ChaptersService();
    await service.create(toCreate);
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
          Nuevo episodio
        </Typography>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Miniatura"
            type="url"
            error={!!errors.thumbnail}
            helperText={errors.thumbnail?.message}
            {...register("thumbnail", { required: true })}
          />
          <TextField
            label="Título canónico"
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
                  error={!!errors.titles?.en}
                  helperText={errors.titles?.en?.message}
                  {...register("titles.en", {
                    required: false,
                    setValueAs: setEmptyOrStr,
                  })}
                />
                <TextField
                  label="es"
                  error={!!errors.titles?.es}
                  helperText={errors.titles?.es?.message}
                  {...register("titles.es", {
                    required: false,
                    setValueAs: setEmptyOrStr,
                  })}
                />
                <TextField
                  label="en_jp"
                  error={!!errors.titles?.en_jp}
                  helperText={errors.titles?.en_jp?.message}
                  {...register("titles.en_jp", {
                    required: false,
                    setValueAs: setEmptyOrStr,
                  })}
                />
                <TextField
                  label="ja_jp"
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
            error={!!errors.number}
            helperText={errors.number?.message}
            {...register("number", { required: true, valueAsNumber: true })}
          />
          <TextField
            label="Descripción"
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register("description", { required: true })}
          />
          <TextField
            label="Synopsis"
            multiline
            rows={4}
            error={!!errors.synopsis}
            helperText={errors.synopsis?.message}
            {...register("synopsis", { required: true })}
          />
          <TextField
            label="Fecha al aire"
            error={!!errors.airdate}
            helperText={errors.airdate?.message}
            {...register("airdate", { required: true })}
          />

          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}
