import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { Box, Button, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";

const SeatGrid = ({ showId }) => {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [timer, setTimer] = useState(300);

  // ✅ Fetch seats
  const fetchSeats = useCallback(async () => {
    const res = await API.get(`/seats/${showId}`);
    setSeats(res.data);
  }, [showId]);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // ✅ Timer
  useEffect(() => {
    if (selected.length === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          toast.error("Time expired ⏰");
          setSelected([]);
          fetchSeats();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selected, fetchSeats]);

  // ✅ Polling (auto refresh)
  useEffect(() => {
    const interval = setInterval(fetchSeats, 4000);
    return () => clearInterval(interval);
  }, [fetchSeats]);

  // ✅ Group seats
  const grouped = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

 // inside your existing code

const handleSelect = async (seat) => {
  try {
    if (selected.includes(seat._id)) {
      setSelected((prev) => prev.filter((id) => id !== seat._id));
      return;
    }

    if (seat.status !== "available") return;

    await API.post("/seats/lock", { seatIds: [seat._id] });

    setSelected((prev) => [...prev, seat._id]);

  } catch {
    toast.error("Seat already locked");
  }
};

  // ✅ Colors
  const getColor = (seat) => {
    if (selected.includes(seat._id)) return "#1976d2"; // 🔵
    if (seat.status === "booked") return "#d32f2f";   // 🔴
    if (seat.status === "locked") return "#ed6c02";   // 🟡
    return "#2e7d32";                                 // 🟢
  };

  // ✅ Selected seat objects
  const selectedSeats = seats.filter((s) =>
    selected.includes(s._id)
  );

  // ✅ Price
  const totalPrice = selectedSeats.reduce(
    (sum, s) => sum + s.price,
    0
  );

  // ✅ Booking
  const handleBooking = async () => {
    try {
      await API.post("/bookings", {
        show_id: showId,
        seatIds: selected
      });

      toast.success("Booking Confirmed 🎉");
      setSelected([]);
      fetchSeats();

    } catch {
      toast.error("Booking failed");
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Select Seats
      </Typography>

      {/* Legend */}
      <Box mb={2}>
        🟢 Available | 🟡 Locked | 🔴 Booked | 🔵 Selected
      </Box>

      {/* Seat Grid */}
      {Object.keys(grouped).map((row) => (
        <Box key={row} display="flex" gap={1} mt={1} alignItems="center">
          <Typography width={30}>{row}</Typography>

          {grouped[row].map((seat) => (
            <Button
              key={seat._id}
              variant="contained"
              onClick={() => handleSelect(seat)}
              sx={{
                minWidth: 40,
                backgroundColor: getColor(seat),
                color: "#fff",
                transition: "0.2s",

                "&:hover": {
                  transform: "scale(1.1)",
                  backgroundColor: "#1976d2",
                }
              }}
            >
              {seat.number}
            </Button>
          ))}
        </Box>
      ))}

      {/* Booking Panel */}
      <Paper sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <Typography>
          Selected Seats: {selectedSeats.length}
        </Typography>

        {/* ✅ Seat Numbers List */}
        <Typography sx={{ mt: 1 }}>
          Seats:{" "}
          {selectedSeats.length > 0
            ? selectedSeats
                .map((s) => `${s.row}${s.number}`)
                .join(", ")
            : "None"}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          Total Price: ₹{totalPrice}
        </Typography>

        {selectedSeats.length > 0 && (
          <>
            <Typography color="error" mt={1}>
              Time Left: {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleBooking}
            >
              Confirm Booking
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SeatGrid;