import { FormEvent, useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import { z } from "zod";

import { AuthService } from "../../services/auth.service";
import { Navbar } from "../../components";
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

const RegisterSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

export function Register() {
  const [errors, setErrors] = useState({ username: false, password: false });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.target) return;

    // Parse form data to object
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    // Validate with zod
    let parsed: z.infer<typeof RegisterSchema> | undefined;
    try {
      parsed = RegisterSchema.parse(data);
      setErrors({ username: false, password: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Consume parsed and validate data
    const authService = new AuthService();
    await authService.register(parsed.username, parsed.password);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box
          component="img"
          src="/sleep-cat.png"
          alt="sleeping cat"
          sx={{
            display: "block",
            width: 110,
            height: 110,
            transform: "translateY(65px)",
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
            Crear cuenta
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
              helperText="Utiliza al menos 6 caracteres, sin espacios en blanco."
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Registrarse
            </Button>
          </Stack>
          <Link
            component={ReactLink}
            to="/login"
            display="block"
            textAlign="center"
            marginTop={2}
          >
            ¿Ya tienes cuenta?, ¡accede ahora!
          </Link>
        </Paper>
      </Container>
    </>
  );
}
