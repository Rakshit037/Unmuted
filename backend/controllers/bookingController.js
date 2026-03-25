import Seat from "../models/Seat.js";

export const bookSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    const now = new Date();

    const seats = await Seat.find({
      _id: { $in: seatIds }
    });

    // Validate all seats
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

    res.json({ message: "Booking successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};