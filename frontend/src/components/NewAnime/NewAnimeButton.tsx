import { useState } from "react";
import { NewAnimeModal } from "./components";
import { ButtonBase, Paper, Typography } from "@mui/material";

export function NewAnimeButton() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Paper
        component={ButtonBase}
        onClick={handleOpen}
        sx={{
          display: "flex",
          gap: 1,
          width: "100%",
          paddingY: 2,
          marginY: 1,
        }}
      >
        <svg
          width="22"
          height="20"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Añadir"
        >
          <path
            d="M7.79435 1.75C7.79435 1.55109 7.70983 1.36032 7.55939 1.21967C7.40894 1.07902 7.2049 1 6.99214 1C6.77937 1 6.57533 1.07902 6.42488 1.21967C6.27444 1.36032 6.18992 1.55109 6.18992 1.75V5H2.71365C2.50089 5 2.29685 5.07902 2.1464 5.21967C1.99596 5.36032 1.91144 5.55109 1.91144 5.75C1.91144 5.94891 1.99596 6.13968 2.1464 6.28033C2.29685 6.42098 2.50089 6.5 2.71365 6.5H6.18992V9.75C6.18992 9.94891 6.27444 10.1397 6.42488 10.2803C6.57533 10.421 6.77937 10.5 6.99214 10.5C7.2049 10.5 7.40894 10.421 7.55939 10.2803C7.70983 10.1397 7.79435 9.94891 7.79435 9.75V6.5H11.2706C11.4834 6.5 11.6874 6.42098 11.8379 6.28033C11.9883 6.13968 12.0728 5.94891 12.0728 5.75C12.0728 5.55109 11.9883 5.36032 11.8379 5.21967C11.6874 5.07902 11.4834 5 11.2706 5H7.79435V1.75Z"
            fill="#1973C8"
          />
        </svg>
        <Typography
          variant="h6"
          component="span"
          color={(theme) => theme.palette.text.secondary}
        >
          Nuevo anime
        </Typography>
      </Paper>

      <NewAnimeModal open={open} onClose={handleClose} />
    </>
  );
}
