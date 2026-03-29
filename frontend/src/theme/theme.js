import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6A0DAD" // Purple
    },
    secondary: {
      main: "#E6E6FA" // Lavender
    },
    background: {
      default: "#F5F5F5" // Whitesmoke
    },
    text: {
      primary: "#1A1A1A"
    }
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none"
        },
        containedPrimary: {
          backgroundColor: "#6A0DAD",
          "&:hover": {
            backgroundColor: "#5a0ca0"
          }
        },
        outlined: {
          borderColor: "#D4AF37", // 🔥 GOLD ACCENT
          color: "#D4AF37",
          "&:hover": {
            borderColor: "#c19c2e"
          }
        }
      }
    }
  }
});

export default theme;