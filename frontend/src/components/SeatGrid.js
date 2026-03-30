import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { Box, Button, Typography } from "@mui/material";

const SeatGrid = ({ showId }) => {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [timer, setTimer] = useState(300); // 5 min

  const fetchSeats = useCallback(async () => {
  const res = await API.get(`/seats/${showId}`);
  setSeats(res.data);
}, [showId]);

  useEffect(() => {
  fetchSeats();
}, [fetchSeats]);

useEffect(() => {
  if (selected.length === 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        setSelected([]);
        fetchSeats();
        return 300;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [selected, fetchSeats]);

  // 🔥 group seats by rows
  const grouped = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const handleSelect = async (seat) => {
    if (seat.status !== "available") return;
    if (selected.includes(seat._id)) return;

    try {
      await API.post("/seats/lock", {
        seatIds: [seat._id]
      });

      setSelected([...selected, seat._id]);
      fetchSeats();

    } catch (err) {
      alert("Seat already locked");
    }
  };

  const getColor = (seat) => {
   if (selected.includes(seat._id)) return "#1976d2"; // blue
if (seat.status === "booked") return "#d32f2f";   // red
if (seat.status === "locked") return "#ed6c02";   // orange
return "#2e7d32"; // green
  };

  const totalPrice = seats
  .filter((s) => selected.includes(s._id))
  .reduce((sum, s) => sum + s.price, 0);

  const handleBooking = async () => {
  try {
    await API.post("/bookings", {
      show_id: showId,
      seatIds: selected
    });

    alert("Booking Confirmed!");
    setSelected([]);
    fetchSeats();

  } catch (err) {
    alert("Booking failed");
  }
};

  return (
    <div>
    <Box p={3}>
      <Typography variant="h5">Select Seats</Typography>
      <Box mt={2}>
  🟢 Available | 🟡 Locked | 🔴 Booked | 🔵 Selected
</Box>

      {Object.keys(grouped).map((row) => (
        <Box key={row} display="flex" gap={1} mt={2}>
          <Typography width={30}>{row}</Typography>

          {grouped[row].map((seat) => (
            <Button
              key={seat._id}
              variant="contained"
              onClick={() => handleSelect(seat)}
              sx={{
                minWidth: 40,
                backgroundColor: getColor(seat)
              }}
            >
              {seat.number}
            </Button>
          ))}
        </Box>
      ))}
    </Box>
    <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2}>
  <Typography>
    Selected Seats: {selected.length}
  </Typography>

  <Typography>
    Total Price: ₹{totalPrice}
  </Typography>

  {selected.length > 0 && (
    <>
      <Typography color="error">
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
</Box>
    </div>
  );
};

export default SeatGrid;