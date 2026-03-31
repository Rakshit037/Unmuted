import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      toast.success("Logged out 👋");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AppBar position="static" sx={{ background: "#1A1A1A" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", color: "#C9A66B" }}
          onClick={() => navigate("/")}
        >
          🎤 Comedy Shows
        </Typography>

        {user && (
          <Box display="flex" gap={1}>
            <Button color="inherit">
              {user.role === "admin" ? "Admin" : "User"}
            </Button>

            <Button color="inherit" onClick={() => navigate("/bookings")}>
              My Bookings
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;