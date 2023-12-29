import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { SearchInput } from "../SearchInput";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";
import { AvatarNav } from "./components/AvatarNav";
import { UserLoading, UserNotLogged } from "../../contexts/auth";

export function Navbar() {
  const { user } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          onClick={handleOpenNavMenu}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "inline-flex", lg: "none" } }}
        >
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 14C3.5 13.5359 3.68437 13.0908 4.01256 12.7626C4.34075 12.4344 4.78587 12.25 5.25 12.25H23.289C23.7531 12.25 24.1982 12.4344 24.5264 12.7626C24.8546 13.0908 25.039 13.5359 25.039 14C25.039 14.4641 24.8546 14.9092 24.5264 15.2374C24.1982 15.5656 23.7531 15.75 23.289 15.75H5.25C4.78587 15.75 4.34075 15.5656 4.01256 15.2374C3.68437 14.9092 3.5 14.4641 3.5 14ZM3.5 7C3.5 6.53587 3.68437 6.09075 4.01256 5.76256C4.34075 5.43437 4.78587 5.25 5.25 5.25H29.75C30.2141 5.25 30.6593 5.43437 30.9874 5.76256C31.3156 6.09075 31.5 6.53587 31.5 7C31.5 7.46413 31.3156 7.90925 30.9874 8.23744C30.6593 8.56563 30.2141 8.75 29.75 8.75H5.25C4.78587 8.75 4.34075 8.56563 4.01256 8.23744C3.68437 7.90925 3.5 7.46413 3.5 7ZM3.5 21C3.5 20.5359 3.68437 20.0908 4.01256 19.7626C4.34075 19.4344 4.78587 19.25 5.25 19.25H29.75C30.2141 19.25 30.6593 19.4344 30.9874 19.7626C31.3156 20.0908 31.5 20.5359 31.5 21C31.5 21.4641 31.3156 21.9092 30.9874 22.2374C30.6593 22.5656 30.2141 22.75 29.75 22.75H5.25C4.78587 22.75 4.34075 22.5656 4.01256 22.2374C3.68437 21.9092 3.5 21.4641 3.5 21ZM3.5 28C3.5 27.5359 3.68437 27.0908 4.01256 26.7626C4.34075 26.4344 4.78587 26.25 5.25 26.25H23.289C23.7531 26.25 24.1982 26.4344 24.5264 26.7626C24.8546 27.0908 25.039 27.5359 25.039 28C25.039 28.4641 24.8546 28.9093 24.5264 29.2374C24.1982 29.5656 23.7531 29.75 23.289 29.75H5.25C4.78587 29.75 4.34075 29.5656 4.01256 29.2374C3.68437 28.9093 3.5 28.4641 3.5 28Z"
              fill="white"
            />
          </svg>
        </IconButton>
        <Menu
          open={Boolean(anchorElNav)}
          anchorEl={anchorElNav}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", lg: "none" },
          }}
        >
          <MenuItem component={Link} to="/">
            Inicio
          </MenuItem>
          <MenuItem component={Link} to="/animes">
            Lista de animes
          </MenuItem>
          <MenuItem component={Link} to="/animes?status=current">
            En emisión
          </MenuItem>
          {user === UserNotLogged || user === UserLoading
            ? [
                <Divider key="navbar-menu-divider" />,
                <Box paddingX={1} marginY={1} key="navbar-menu-search-input">
                  <SearchInput />
                </Box>,
                <Box paddingX={1} marginY={1} key="navbar-menu-signin-button">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={(theme) => ({
                      backgroundColor: theme.palette.common.white,
                      color: theme.palette.primary.dark,
                      textTransform: "none",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      ":hover": {
                        backgroundColor: theme.palette.common.white,
                      },
                    })}
                    fullWidth
                    component={Link}
                    to="/login"
                  >
                    Sign In
                  </Button>
                </Box>,
                <Box paddingX={1} key="navbar-menu-enternow-button">
                  <Button
                    variant="contained"
                    color="success"
                    sx={(theme) => ({
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: "bold",
                      backgroundColor: "#C81973",
                      color: theme.palette.common.white,
                      ":hover": {
                        backgroundColor: "#C81973",
                      },
                    })}
                    fullWidth
                    component={Link}
                    to="/register"
                  >
                    Enter now !
                  </Button>
                </Box>,
              ]
            : null}
        </Menu>
        <Typography
          variant="h6"
          component="p"
          fontWeight="bold"
          display={"flex"}
          flexGrow={1}
          color="white"
        >
          Animes
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ display: { xs: "none", lg: "flex" } }}
        >
          <Stack
            direction="row"
            flexGrow={1}
            sx={{ display: { xs: "none", lg: "flex" } }}
          >
            <Button sx={{ my: 2, color: "white" }} component={Link} to="/">
              Inicio
            </Button>
            <Button
              sx={{ my: 2, color: "white" }}
              component={Link}
              to="/animes"
            >
              Lista de animes
            </Button>
            <Button
              sx={{ my: 2, color: "white" }}
              component={Link}
              to={"/animes?status=current"}
            >
              En emisión
            </Button>
          </Stack>
          <SearchInput />
          {!user ? (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={(theme) => ({
                  backgroundColor: theme.palette.common.white,
                  color: theme.palette.primary.dark,
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  ":hover": {
                    backgroundColor: theme.palette.common.white,
                  },
                })}
                component={Link}
                to="/login"
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={(theme) => ({
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: "#C81973",
                  color: theme.palette.common.white,
                  ":hover": {
                    backgroundColor: "#C81973",
                  },
                })}
                component={Link}
                to="/register"
              >
                Enter now !
              </Button>
            </>
          ) : null}
        </Stack>
        <AvatarNav />
      </Toolbar>
    </AppBar>
  );
}
