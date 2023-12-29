import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

export function NextChapterButton({
  canNext = false,
  href = "#",
}: {
  canNext?: boolean;
  href?: string;
}) {
  return (
    <IconButton
      component={Link}
      to={href}
      disabled={!canNext}
      aria-label="Siguiente espisodio"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill={!canNext ? "#9E9E9E" : "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.25 10C1.25 11.7306 1.76318 13.4223 2.72464 14.8612C3.6861 16.3002 5.05267 17.4217 6.65152 18.0839C8.25037 18.7462 10.0097 18.9195 11.707 18.5819C13.4044 18.2443 14.9635 17.4109 16.1872 16.1872C17.4109 14.9635 18.2443 13.4044 18.5819 11.707C18.9195 10.0097 18.7462 8.25037 18.0839 6.65152C17.4217 5.05267 16.3002 3.6861 14.8612 2.72464C13.4223 1.76318 11.7306 1.25 10 1.25C7.67936 1.25 5.45376 2.17187 3.81282 3.81282C2.17187 5.45376 1.25 7.67936 1.25 10ZM5 9.375H12.5938L9.10625 5.87063L10 5L15 10L10 15L9.10625 14.1081L12.5938 10.625H5V9.375Z"
          fill="#C81973"
        />
        <path
          d="M10 5L9.10625 5.87062L12.5938 9.375H5V10.625H12.5938L9.10625 14.1081L10 15L15 10L10 5Z"
          fill="white"
        />
      </svg>
    </IconButton>
  );
}
