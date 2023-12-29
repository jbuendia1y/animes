import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { DeleteIcon, EditIcon } from "../../../components/icons";
import { useState } from "react";
import { EditChapterModal } from "./EditChapterModal";
import { DeleteChapterModal } from "./DeleteChapterModal";

export function ChapterOptionsButton({ chapterId }: { chapterId: string }) {
  const [current, setCurrent] = useState("");
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [open, setOpen] = useState(false);

  const actions = [
    {
      name: "Editar",
      icon: <EditIcon color="black" />,
    },
    {
      name: "Eliminar",
      icon: <DeleteIcon color="black" />,
    },
  ];

  const handleClick = (name: string) => {
    setCurrent(name);
    setOpenSpeedDial(false);
    setOpen(true);
  };

  const handleClose = () => {
    setCurrent("");
    setOpen(false);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        open={openSpeedDial}
        onOpen={() => setOpenSpeedDial(true)}
        onClose={() => setOpenSpeedDial(false)}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleClick(action.name)}
          />
        ))}
      </SpeedDial>
      {current === "Editar" ? (
        <EditChapterModal
          open={open}
          onClose={handleClose}
          chapterId={chapterId}
        />
      ) : null}
      {current === "Eliminar" ? (
        <DeleteChapterModal
          open={open}
          onClose={handleClose}
          chapterId={chapterId}
        />
      ) : null}
    </>
  );
}
