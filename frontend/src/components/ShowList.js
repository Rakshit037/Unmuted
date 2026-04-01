import { useEffect, useState } from "react";
import API from "../api/axios";
import { Grid, Box, TextField, MenuItem, Typography, Chip } from "@mui/material";
import EditShowDialog from "./EditShowDialog";
import toast from "react-hot-toast";
import ShowCard from "./ShowCard";

const ShowList = ({ isAdmin = false }) => {
  const [shows, setShows] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sort, setSort] = useState("");

  const [selected, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

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

  // ✅ LOCAL DATE HELPER
  const getDateOnly = (date) => {
    const d = new Date(date);
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const todayStr = getDateOnly(new Date());

  // 🔥 FILTER + SEARCH + SORT
  useEffect(() => {
    let data = [...shows];

    if (search) {
      data = data.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (venueFilter) {
      data = data.filter((s) => s.venue === venueFilter);
    }

    if (dateFilter) {
      data = data.filter(
        (s) => getDateOnly(s.show_date) === dateFilter
      );
    }

    if (sort === "date_asc") {
      data.sort(
        (a, b) => new Date(a.show_date) - new Date(b.show_date)
      );
    } else if (sort === "date_desc") {
      data.sort(
        (a, b) => new Date(b.show_date) - new Date(a.show_date)
      );
    } else if (sort === "title_asc") {
      data.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    setFiltered(data);
  }, [search, venueFilter, dateFilter, sort, shows]);

  const uniqueVenues = [...new Set(shows.map((s) => s.venue))];

  // ✅ FINAL DATE-BASED GROUPING
  const todayShows = filtered.filter(
    (s) => getDateOnly(s.show_date) === todayStr
  );

  const upcomingShows = filtered.filter(
    (s) => getDateOnly(s.show_date) > todayStr
  );

  const completedShows = filtered.filter(
    (s) => getDateOnly(s.show_date) < todayStr
  );

  return (
    <Box>
      {/* FILTER BAR */}
      <Box display="flex" gap={6} mb={3} mt={3} flexWrap="wrap">
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

      {/* TODAY */}
      {todayShows.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" mb={2}>
            Today <Chip label="🔥" color="secondary" size="small" />
          </Typography>
          <Grid container spacing={3}>
            {todayShows.map((show) => (
              <Grid item xs={12} sm={6} md={4} key={show._id}>
                <ShowCard
                  show={show}
                  isAdmin={isAdmin}
                  setSelected={setSelected}
                  setEditOpen={setEditOpen}
                  refresh={fetchShows}
                  isToday={true}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* UPCOMING */}
      {upcomingShows.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" mb={2}>
            Upcoming
          </Typography>
          <Grid container spacing={3}>
            {upcomingShows.map((show) => (
              <Grid item xs={12} sm={6} md={4} key={show._id}>
                <ShowCard
                  show={show}
                  isAdmin={isAdmin}
                  setSelected={setSelected}
                  setEditOpen={setEditOpen}
                  refresh={fetchShows}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* COMPLETED */}
      {completedShows.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" mb={2}>
            Completed
          </Typography>
          <Grid container spacing={3}>
            {completedShows.map((show) => (
              <Grid item xs={12} sm={6} md={4} key={show._id}>
                <ShowCard
                  show={show}
                  isAdmin={isAdmin}
                  setSelected={setSelected}
                  setEditOpen={setEditOpen}
                  refresh={fetchShows}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* EMPTY */}
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