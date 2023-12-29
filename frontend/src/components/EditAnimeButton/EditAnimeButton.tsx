import { Fab } from "@mui/material";
import { EditAnimeModal } from "./components";
import { useState } from "react";

export function EditAnimeButton({ animeId }: { animeId?: string }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="edit"
        sx={{ position: "fixed", bottom: 25, right: 25 }}
        onClick={handleOpen}
      >
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.1119 4.32001C18.7179 3.71424 19.5397 3.37402 20.3966 3.37418C21.2534 3.37433 22.0751 3.71486 22.6808 4.32085C23.2866 4.92684 23.6268 5.74864 23.6267 6.60548C23.6265 7.46231 23.286 8.28399 22.68 8.88976L21.443 10.1284L16.8733 5.55863L18.1119 4.32169V4.32001ZM15.6819 6.75169L5.63117 16.7991C5.3261 17.1044 5.09617 17.4764 4.95955 17.8858L3.41717 22.5146C3.36748 22.6633 3.36016 22.8228 3.39603 22.9753C3.43191 23.1279 3.50956 23.2674 3.62028 23.3783C3.73101 23.4892 3.87044 23.5671 4.02293 23.6032C4.17543 23.6393 4.33497 23.6323 4.48367 23.5828L9.11249 22.0388C9.52255 21.9038 9.8938 21.6726 10.1992 21.3671L20.25 11.3214L15.6802 6.75001L15.6819 6.75169Z"
            fill="white"
          />
        </svg>
      </Fab>
      {animeId ? (
        <EditAnimeModal animeId={animeId} open={open} onClose={onClose} />
      ) : null}
    </>
  );
}
