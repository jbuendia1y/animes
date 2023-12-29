import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <Box
      component="footer"
      paddingY={3}
      sx={{
        backgroundColor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.common.white,
      }}
    >
      <Container>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/animes">
              <ListItemText primary="Lista de animes" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/animes?status=current">
              <ListItemText primary="Animes en emisión" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <Box paddingY={3} paddingX={2}>
          <Typography>Author: Joaquín Buendía</Typography>
        </Box>
      </Container>
    </Box>
  );
}
