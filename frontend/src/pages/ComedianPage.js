import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import AddComedianDialog from "../components/AddComedianDialog";
import ComedianList from "../components/ComedianList";

const ComedianPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Comedians
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Comedian
      </Button>

      <AddComedianDialog open={open} handleClose={() => setOpen(false)} />

      <ComedianList />
    </Box>
  );
};

export default ComedianPage;