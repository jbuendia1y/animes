/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
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
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks";
import { AxiosError } from "axios";

const LoginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

const MAX_REQUESTS = 15 as const;
const RATE_LIMIT_TIME_WAIT = 60 as const;

export function Login() {
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    rateLimit: false,
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const rateLimitRef = useRef(0);
  const [rateLimitTime, setRateLimitTime] = useState(0);

  useEffect(() => {
    if (!errors.rateLimit) return;
    const interval = setInterval(() => {
      setRateLimitTime((v) => {
        if (v === RATE_LIMIT_TIME_WAIT) {
          setErrors((v) => ({ ...v, rateLimit: false }));
          rateLimitRef.current = 0;
          clearInterval(interval);
          return 0;
        }
        return v + 1;
      });
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [errors]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.target) return;

    // Parse form data to object
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    // Validate with zod
    let parsed: z.infer<typeof LoginSchema> | undefined;
    try {
      parsed = LoginSchema.parse(data);
      setErrors((v) => ({ ...v, username: false, password: false }));
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors = err.issues.map((v) => {
          const path = v.path[0] as string;
          return path;
        });

        setErrors((v) =>
          errors.reduce((acc, value) => ({ ...acc, [value]: true }), {
            username: false,
            password: false,
            rateLimit: v.rateLimit,
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
        if (rateLimitRef.current === MAX_REQUESTS) {
          setErrors((v) => ({ ...v, rateLimit: true }));
        }
        rateLimitRef.current += 1;
        setErrors((v) => ({ ...v, username: true, password: true }));
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
              disabled={errors.rateLimit}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Iniciar sessión
            </Button>
          </Stack>

          {errors.rateLimit ? (
            <Alert severity="error">
              Hizo demasiadas peticiónes, tome un descanso{" "}
              {RATE_LIMIT_TIME_WAIT - rateLimitTime}s
            </Alert>
          ) : null}
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
