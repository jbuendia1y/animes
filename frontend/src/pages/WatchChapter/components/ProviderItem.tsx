import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ChapterVideo } from "../models";

interface Props {
  provider: string;
  players: ChapterVideo["values"][];
  onSelect?: (value: ChapterVideo["values"]) => void;
}

export function ProviderItem({
  provider,
  players,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelect = () => {},
}: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (value: ChapterVideo["values"]) => {
    onSelect(value);
    handleCloseMenu();
  };

  return (
    <Box>
      <Button
        onClick={handleOpenMenu}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ fontWeight: "bold", textTransform: "none", borderRadius: 0 }}
      >
        {provider}
      </Button>
      <Menu
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {players.map((v) => (
          <MenuItem
            key={provider + "-player-" + v.player}
            onClick={() => handleClick(v)}
          >
            {v.player}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
