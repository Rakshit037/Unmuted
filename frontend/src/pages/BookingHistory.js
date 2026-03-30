import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button
} from "@mui/material";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await API.get("/bookings/my");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
  try {
    await API.put(`/bookings/${id}/cancel`);
    fetchBookings();
  } catch (err) {
    console.log("Cancel error:", err.response?.data || err.message);
  }
};

  return (
    <Box p={3}>
      <Typography variant="h4">My Bookings</Typography>

      {bookings.map((b) => (
        <Card key={b._id} sx={{ mt: 2 }}>
          <CardContent>
            <Typography>{b.show_id.title}</Typography>
            <Typography>Seats: {b.seats.length}</Typography>
            <Typography>Status: {b.status}</Typography>

            {b.status === "booked" && (
              <Button
                color="error"
                onClick={() => handleCancel(b._id)}
              >
                Cancel Booking
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default BookingHistory;