import {
  Dialog,
  DialogContent,
  Typography,
  IconButton
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
        <img
          src={`http://localhost:5000/uploads/comedians/${comedian.image}`}
          alt={comedian.name}
          style={{ width: "100%", borderRadius: 10 }}
        />

        <Typography variant="h5" mt={2}>
          {comedian.name}
        </Typography>

        <Typography>Age: {comedian.age}</Typography>
        <Typography>Experience: {comedian.experience}</Typography>
        <Typography>Gender: {comedian.gender}</Typography>

        <Typography mt={2}>{comedian.bio}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ComedianModal;