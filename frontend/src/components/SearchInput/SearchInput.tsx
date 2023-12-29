import { Box, TextField } from "@mui/material";
import { KeyboardEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  size?: "small" | "medium";
  fullWidth?: boolean;
  defaultValue?: string;
}

export function SearchInput({
  fullWidth = false,
  size = "small",
  defaultValue = "",
}: Props) {
  const navigate = useNavigate();
  const searchString = useRef("");

  const onChange = (value: string) => {
    searchString.current = value;
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;

    const params = new URLSearchParams();
    params.set(
      "q",
      searchString.current.toLocaleLowerCase().split(" ").join("-")
    );

    navigate(`/animes?${params.toString()}`);
  };

  return (
    <TextField
      defaultValue={defaultValue}
      variant="outlined"
      placeholder="¿ Estás buscando algo ?"
      aria-label="Search"
      color="primary"
      size={size}
      fullWidth={fullWidth}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKey}
      InputProps={{
        sx: {
          backgroundColor: "#fff",
          borderRadius: 1000,
        },
        startAdornment: (
          <Box sx={{ marginRight: 1, marginTop: 1 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 20L14 14" stroke="black" />
              <path
                d="M15 9.5C15 10.9587 14.4205 12.3576 13.3891 13.3891C12.3576 14.4205 10.9587 15 9.5 15C8.04131 15 6.64236 14.4205 5.61091 13.3891C4.57946 12.3576 4 10.9587 4 9.5C4 8.04131 4.57946 6.64236 5.61091 5.61091C6.64236 4.57946 8.04131 4 9.5 4C10.9587 4 12.3576 4.57946 13.3891 5.61091C14.4205 6.64236 15 8.04131 15 9.5Z"
                stroke="black"
              />
            </svg>
          </Box>
        ),
      }}
      InputLabelProps={{
        sx: {
          color: "black",
        },
      }}
    />
  );
}
