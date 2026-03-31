import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import AddComedianDialog from "../components/AddComedianDialog";
import ComedianList from "../components/ComedianList";
import { useAuth } from "../context/AuthContext";

const ComedianPage = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Comedians
      </Typography>

      {isAdmin && (
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Comedian
        </Button>
      )}

      <AddComedianDialog open={open} handleClose={() => setOpen(false)} />

      <ComedianList isAdmin={isAdmin} />
    </Box>
  );
};

export default ComedianPage;