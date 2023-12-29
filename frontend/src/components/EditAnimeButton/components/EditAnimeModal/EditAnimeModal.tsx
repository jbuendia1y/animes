/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  InputLabel,
  Modal,
  NativeSelect,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AnimesService } from "../../../../services/animes.service";
import {
  Anime,
  IUpdateAnime,
  UpdateAnime,
} from "../../../../models/anime.model";
import { ArrowNextIcon } from "../../../icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  animeId: string;
  open: boolean;
  onClose: () => void;
}

const isString = (v: unknown): v is string => typeof v === "string";
const isEmptyString = (v: string) => v.length === 0;

const setEmptyOrStr = (v: unknown) => {
  if (isString(v) && isEmptyString(v)) return undefined;
  else return v;
};

type Form = IUpdateAnime;

export function EditAnimeModal({ animeId, open, onClose }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<Form>();
  const [{ defaultValues, loading }, setDefaultValues] = useState<{
    defaultValues: Anime["values"] | null;
    loading: boolean;
  }>({
    defaultValues: null,
    loading: true,
  });

  useEffect(() => {
    let subscribe = true;
    const service = new AnimesService();
    service.findOne(animeId).then((v) => {
      if (subscribe)
        setDefaultValues({ defaultValues: v.values, loading: false });
    });
    return () => {
      subscribe = false;
    };
  }, [animeId]);

  const onSubmit = async (data: Form) => {
    let toUpdate: UpdateAnime | undefined = undefined;
    try {
      toUpdate = new UpdateAnime(data);
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

    const service = new AnimesService();
    await service.update(animeId, toUpdate);
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
          Editar anime
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
              label="Imagen de fondo"
              type="url"
              defaultValue={defaultValues?.coverImage}
              {...register("coverImage", { required: true })}
            />
            <TextField
              label="Poster"
              defaultValue={defaultValues?.posterImage}
              {...register("posterImage")}
              type="url"
            />
            <TextField
              label="Título canónico"
              defaultValue={defaultValues?.canonicalTitle}
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
              label="Descripción"
              multiline
              rows={4}
              defaultValue={defaultValues?.description}
              {...register("description", { required: true })}
            />
            <TextField
              label="Synopsis"
              multiline
              rows={4}
              defaultValue={defaultValues?.synopsis}
              {...register("synopsis", { required: true })}
            />
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="status">Estado</InputLabel>
              <NativeSelect
                defaultValue={defaultValues?.status}
                inputProps={{
                  ...register("status"),
                }}
              >
                <option value="current">Emisión</option>
                <option value="finished">Finalizado</option>
              </NativeSelect>
            </FormControl>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Stack>
        )}
      </Paper>
    </Modal>
  );
}
