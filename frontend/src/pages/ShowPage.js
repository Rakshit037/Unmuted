import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import AddShowDialog from "../components/AddShowDialog";
import ShowList from "../components/ShowList";
import { useAuth } from "../context/AuthContext";

const ShowPage = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Shows
      </Typography>

      {isAdmin && (
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Show
        </Button>
      )}

      <AddShowDialog open={open} handleClose={() => setOpen(false)} />

      <ShowList isAdmin={isAdmin} />
    </Box>
  );
};

export default ShowPage;