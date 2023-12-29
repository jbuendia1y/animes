import { IconButton } from "@mui/material";
import { EditIcon } from "../../../../components/icons";
import { useState } from "react";
import { ListProvidersModal } from "./components";

export function EditProvidersButton({ chapterId }: { chapterId: string }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <EditIcon color="#C81973" />
      </IconButton>
      <ListProvidersModal
        chapterId={chapterId}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
