import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import AddShowDialog from "../components/AddShowDialog";
import ShowList from "../components/ShowList";

const ShowPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Shows
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Show
      </Button>

      <AddShowDialog open={open} handleClose={() => setOpen(false)} />

      <ShowList />
    </Box>
  );
};

export default ShowPage;