/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { Navbar } from "../../components";
import { z } from "zod";
import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks";
import { AxiosError } from "axios";

const LoginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export function Login() {
  const [errors, setErrors] = useState({ username: false, password: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.target) return;

    // Parse form data to object
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    // Validate with zod
    let parsed: z.infer<typeof LoginSchema> | undefined;
    try {
      parsed = LoginSchema.parse(data);
      setErrors({ username: false, password: false });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors = err.issues.map((v) => {
          const path = v.path[0] as string;
          return path;
        });

        setErrors(
          errors.reduce((acc, value) => ({ ...acc, [value]: true }), {
            username: false,
            password: false,
          })
        );

        return;
      }
    }

    if (!parsed) return;

    // Consume los datos validados y formateados
    try {
      await login(parsed.username, parsed.password);
      navigate("/");
    } catch (err: any) {
      if (err instanceof AxiosError) {
        setErrors({ username: true, password: true });
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box
          component="img"
          src="/playing-cats.png"
          sx={{
            display: "block",
            marginLeft: "auto",
            width: 100,
            height: 100,
            transform: "translateY(50px)",
          }}
        />
        <Paper
          elevation={2}
          sx={{
            maxWidth: "500px",
            marginTop: 2,
            marginX: "auto",
            paddingX: 2.5,
            paddingY: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            textAlign="center"
            fontWeight="bold"
          >
            Acceder
          </Typography>
          <Stack component="form" spacing={2} marginTop={2} onSubmit={onSubmit}>
            <TextField
              label="Nombre de usuario"
              placeholder="myusername"
              name="username"
              type="text"
              InputLabelProps={{ shrink: true, sx: { color: "black" } }}
              fullWidth
              error={errors.username}
            />
            <TextField
              label="Contraseña"
              placeholder="*********"
              name="password"
              type="password"
              InputLabelProps={{ shrink: true, sx: { color: "black" } }}
              fullWidth
              error={errors.password}
            />
            <Link
              component={ReactLink}
              to="/forgot-password"
              display="block"
              textAlign="left"
            >
              ¿ Olvidaste tu contraseña ?
            </Link>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Iniciar sessión
            </Button>
          </Stack>
          <Link
            component={ReactLink}
            to="/register"
            display="block"
            textAlign="center"
            marginTop={2}
          >
            ¿No tienes cuenta?, ¡regístrate gratis!
          </Link>
        </Paper>
      </Container>
    </>
  );
}
