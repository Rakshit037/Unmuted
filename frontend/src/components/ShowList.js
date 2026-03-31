import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditShowDialog from "./EditShowDialog";
import toast from "react-hot-toast";

const ShowList = ({ isAdmin = false }) => {
  const [shows, setShows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("");

  const [selected, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const navigate = useNavigate();

  const fetchShows = async () => {
    try {
      const res = await API.get("/shows");
      setShows(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load shows");
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // 🔥 FILTER + SEARCH + SORT
  useEffect(() => {
    let data = [...shows];

    // Search
    if (search) {
      data = data.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Venue Filter
    if (venueFilter) {
      data = data.filter((s) => s.venue === venueFilter);
    }

    // Date Filter
    if (dateFilter) {
      data = data.filter((s) => s.show_date.startsWith(dateFilter));
    }

    // Sorting
    if (sort === "date_asc") {
      data.sort((a, b) => new Date(a.show_date) - new Date(b.show_date));
    } else if (sort === "date_desc") {
      data.sort((a, b) => new Date(b.show_date) - new Date(a.show_date));
    } else if (sort === "title_asc") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFiltered(data);
  }, [search, venueFilter, dateFilter, sort, shows]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/shows/${id}`);
      setShows((prev) => prev.filter((s) => s._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const getStatusColor = (status) => {
    if (status === "upcoming") return "success";
    if (status === "completed") return "default";
    return "error";
  };

  const uniqueVenues = [...new Set(shows.map((s) => s.venue))];

  return (
    <Box>

      {/* 🔍 FILTER BAR */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search shows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          select
          label="Venue"
          value={venueFilter}
          onChange={(e) => setVenueFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {uniqueVenues.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <TextField
          select
          label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="date_asc">Date ↑</MenuItem>
          <MenuItem value="date_desc">Date ↓</MenuItem>
          <MenuItem value="title_asc">Title A-Z</MenuItem>
        </TextField>
      </Box>

      {/* 🎭 SHOW CARDS */}
      <Grid container spacing={3}>
        {filtered.map((show) => (
          <Grid item xs={12} sm={6} md={4} key={show._id}>
            <Card
              onClick={() => navigate(`/shows/${show._id}`)}
              sx={{
                cursor: "pointer",
                borderRadius: 4,
                overflow: "hidden",
                transition: "0.3s",
                position: "relative",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 8
                }
              }}
            >
              {/* IMAGE */}
              <CardMedia
                component="img"
                height="220"
                image={`http://localhost:5000/uploads/shows/${show.image}`}
              />

              {/* STATUS BADGE */}
              <Chip
                label={show.status}
                color={getStatusColor(show.status)}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  textTransform: "capitalize"
                }}
              />

              {/* CONTENT */}
              <CardContent>
                <Typography variant="h6" noWrap>
                  {show.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  📍 {show.venue}
                </Typography>

                <Typography variant="body2">
                  📅 {show.show_date}
                </Typography>

                <Typography variant="body2">
                  ⏰ {show.show_time}
                </Typography>
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
          </Grid>
        ))}
      </Grid>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <Typography mt={3} textAlign="center">
          No shows found 😔
        </Typography>
      )}

      <EditShowDialog
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        show={selected}
        refresh={fetchShows}
      />
    </Box>
  );
};

export default ShowList;