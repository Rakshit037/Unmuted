import { Card, CardMedia, CardContent, Typography, Box, Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";

const ShowCard = ({ show, isAdmin, setSelected, setEditOpen, refresh, isToday = false }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await API.delete(`/shows/${id}`);
      toast.success("Deleted successfully");
      if (refresh) refresh();
    } catch {
      toast.error("Delete failed");
    }
  };

  const getStatusColor = (status) => {
    if (status === "upcoming") return "success";
    if (status === "completed") return "default";
    return "error";
  };

  return (
    <Card
      onClick={() => navigate(`/shows/${show._id}`)}
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        height: 650,
        width: 450,
        overflow: "hidden",
        transition: "0.3s",
        position: "relative",
        "&:hover": { transform: "scale(1.03)", boxShadow: 8 },
      }}
    >
      {/* IMAGE */}
      <CardMedia
        component="img"
        height="420"
        image={`http://localhost:5000/uploads/shows/${show.image}`}
      />

      {/* STATUS CHIP */}
      <Chip
        label={show.status}
        color={getStatusColor(show.status)}
        sx={{ position: "absolute", top: 10, right: 10, textTransform: "capitalize" }}
      />

      {/* TODAY CHIP */}
      {isToday && (
        <Chip
          label="Today"
          color="secondary"
          size="small"
          sx={{ position: "absolute", top: 10, left: 10 }}
        />
      )}

      {/* CONTENT */}
      <CardContent>
        <Typography variant="h6" noWrap>{show.title}</Typography>
        <Typography variant="body2" color="text.secondary">📍 {show.venue}</Typography>
        <Typography variant="body2">📅 {show.show_date}</Typography>
        <Typography variant="body2">⏰ {show.show_time}</Typography>
      </CardContent>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <Box sx={{ p: 2, display: "flex", gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              setSelected(show);
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            fullWidth
            color="error"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(show._id);
            }}
          >
            Delete
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ShowCard;