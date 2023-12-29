import { ThemeProvider, createTheme } from "@mui/material";
import { ArrowNextIcon, ArrowPrevIcon } from "../components/icons";

const theme = createTheme({
  palette: {
    primary: { main: "#1973c8" },
    success: { main: "#4caf50" },
    divider: "#bdbdbd",
    background: { default: "#eefbdf" },
    secondary: { main: "#e4f9cd" },
    text: { primary: "#000", secondary: "#757575", disabled: "#9e9e9e" },
    action: {
      disabledBackground: "#BDBDBD",
      disabled: "#BDBDBD",
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          ":disabled": {
            backgroundColor: "#D8D8D8",
          },
        },
      },
    },
    MuiPaginationItem: {
      defaultProps: {
        slots: { previous: ArrowPrevIcon, next: ArrowNextIcon },
      },
      styleOverrides: {
        icon: {
          color: "#C81973",
        },
      },
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MaterialTheme({ children }: { children: any }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
