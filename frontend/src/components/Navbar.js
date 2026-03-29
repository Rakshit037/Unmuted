import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Typography variant="h6">
          🎤 Comedy Shows
        </Typography>

        {user && (
          <div>
            <Button color="inherit">
              {user.role === "admin" ? "Admin" : "User"}
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;