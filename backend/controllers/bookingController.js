import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import Show from "../models/Show.js";
import { sendBookingEmail, sendCancelEmail } from "../utils/mailer.js";


// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { seatIds } = req.body;
    const userId = req.user._id;

    const now = new Date();

    // Fetch seats
    const seats = await Seat.find({ _id: { $in: seatIds } });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({ message: "Invalid seats" });
    }

    // Validate seats
    for (const seat of seats) {
      if (
        seat.status !== "locked" ||
        seat.lockedUntil < now
      ) {
        return res.status(400).json({
          message: "Seat not locked or expired"
        });
      }
    }

    // Calculate total price
    const total_price = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Book seats
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      {
        $set: {
          status: "booked",
          lockedUntil: null
        }
      }
    );

    // Create booking
    const booking = await Booking.create({
      user_id: userId,
      show_id: seats[0].show_id,
      seats: seatIds,
      total_price
    });

    // Fetch show details
    const show = await Show.findById(seats[0].show_id);

    // Send email
    await sendBookingEmail({
      userEmail: req.user.email,
      show,
      seats: seats.map(s => s.seat_no),
      total_price
    });

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId).populate("seats");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only owner can cancel
    if (booking.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    // Fetch show ONCE
    const show = await Show.findById(booking.show_id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // ✅ Combine date + time properly
    const showDateTime = new Date(`${show.show_date.toISOString().split("T")[0]}T${show.show_time}`);

    const now = new Date();

    const cancelDeadline = new Date(showDateTime.getTime() - 60 * 60 * 1000); // 1 hour before

    if (now > cancelDeadline) {
      return res.status(400).json({
        message: "Cancellation allowed only 1 hour before show"
      });
    }

    if (now > showDateTime) {
      return res.status(400).json({
        message: "Cannot cancel after show has started"
      });
    }

    // ✅ Release ONLY booked seats (safe update)
    await Seat.updateMany(
      {
        _id: { $in: booking.seats },
        status: "booked"
      },
      {
        $set: {
          status: "available",
          lockedUntil: null
        }
      }
    );

    // Update booking
    booking.status = "cancelled";
    await booking.save();

    // Send email
    await sendCancelEmail({
      userEmail: req.user.email,
      show,
      seats: booking.seats.map(s => s.seat_no),
      total_price: booking.total_price
    });

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};