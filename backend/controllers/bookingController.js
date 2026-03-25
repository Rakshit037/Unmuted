import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import Show from "../models/Show.js";
import { sendBookingEmail } from "../utils/mailer.js";


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