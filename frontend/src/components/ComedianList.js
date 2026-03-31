import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box
} from "@mui/material";
import ComedianModal from "./ComedianModal";
import EditComedianDialog from "./EditComedianDialog";
import toast from "react-hot-toast";

const ComedianList = ({ isAdmin = false }) => {
  const [comedians, setComedians] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/comedians");
      setComedians(res.data);
    } catch {
      toast.error("Failed to load comedians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/comedians/${id}`);
      setComedians((prev) => prev.filter((c) => c._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Typography p={3}>Loading comedians...</Typography>;

  if (comedians.length === 0)
    return <Typography p={3}>No comedians available</Typography>;

  return (
    <Grid container spacing={3} mt={2}>
      {comedians.map((c) => (
        <Grid item xs={12} sm={6} md={4} key={c._id}>
          <Card
            onClick={() => {
              setSelected(c);
              setModalOpen(true);
            }}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 3,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6
              }
            }}
          >
            <CardMedia
              component="img"
              image={`http://localhost:5000/uploads/comedians/${c.image}`}
              sx={{
                height: 220,
                objectFit: "cover"
              }}
            />

            <CardContent>
              <Typography variant="h6">{c.name}</Typography>
            </CardContent>

            {isAdmin && (
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(c);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(c._id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      ))}

      {/* 🔥 SINGLE MODAL OUTSIDE MAP */}
      <ComedianModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        comedian={selected}
      />

      <EditComedianDialog
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        comedian={selected}
        refresh={fetchData}
      />
    </Grid>
  );
};

export default ComedianList;