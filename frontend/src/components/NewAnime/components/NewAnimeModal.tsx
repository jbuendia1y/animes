/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Modal,
  NativeSelect,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowNextIcon } from "../../icons";
import { CreateAnime, ICreateAnime } from "../../../models/anime.model";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimesService } from "../../../services/animes.service";
import { TagsField } from "../../TagsField";
import { useRef } from "react";
import { Tag } from "../../../models/tag.model";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Form = ICreateAnime;

const isString = (v: unknown): v is string => typeof v === "string";
const isEmptyString = (v: string) => v.length === 0;

const setEmptyOrStr = (v: unknown) => {
  if (isString(v) && isEmptyString(v)) return undefined;
  else return v;
};

export function NewAnimeModal({ open, onClose }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<Form>();
  const tags = useRef<Tag[]>([]);

  const onSubmit = async (data: Form) => {
    let toCreate: CreateAnime | undefined = undefined;
    try {
      toCreate = new CreateAnime({
        ...data,
        tags: tags.current.map((v) => v.values),
      });
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
    const service = new AnimesService();
    await service.save(toCreate);
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          Nuevo anime
        </Typography>
        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          aria-label="Save an anime"
        >
          <TextField
            label="Fondo"
            type="url"
            error={!!errors.coverImage}
            helperText={errors.coverImage?.message}
            {...register("coverImage", { required: true })}
          />
          <TextField
            label="Poster"
            type="url"
            error={!!errors.posterImage}
            helperText={errors.posterImage?.message}
            {...register("posterImage", { required: true })}
          />
          <TextField
            label="Título canónico"
            error={!!errors.canonicalTitle}
            helperText={errors.canonicalTitle?.message}
            {...register("canonicalTitle", { required: true })}
          />
          <TextField
            label="Slug"
            error={!!errors.slug}
            helperText={errors.slug?.message}
            {...register("slug", { required: true })}
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
          <FormControlLabel
            control={<Checkbox size="small" {...register("nsfw")} />}
            label="nsfw"
          />
          <TagsField
            onChange={(data) => {
              tags.current = data;
            }}
          />
          <FormControl variant="standard" fullWidth error={!!errors.status}>
            <InputLabel htmlFor="status">Estado</InputLabel>
            <NativeSelect
              defaultValue={"current"}
              inputProps={{
                ...register("status"),
              }}
            >
              <option value="current">Emisión</option>
              <option value="finished">Finalizado</option>
            </NativeSelect>
          </FormControl>
          <TextField
            label="Show type"
            error={!!errors.showType}
            helperText={errors.showType?.message}
            {...register("showType", { required: true })}
          />
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}
