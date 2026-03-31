import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ComedianModal = ({ open, handleClose, comedian }) => {
  if (!comedian) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", right: 10, top: 10 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Box textAlign="center">
          <img
            src={`http://localhost:5000/uploads/comedians/${comedian.image}`}
            alt={comedian.name}
            style={{
              width: "80%",
              borderRadius: 12,
              marginBottom: 16
            }}
          />
        </Box>

        <Typography variant="h5" fontWeight="bold">
          {comedian.name}
        </Typography>

        <Typography mt={1}>Age: {comedian.age}</Typography>
        <Typography>Experience: {comedian.experience}</Typography>
        <Typography>Gender: {comedian.gender}</Typography>

        <Typography mt={2} color="text.secondary">
          {comedian.bio}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ComedianModal;