import Seat from "../models/Seat.js";

export const getSeatsByShow = async (req, res) => {
  try {
    const seats = await Seat.find({ show_id: req.params.showId });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lockSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    const now = new Date();
    const lockTime = new Date(now.getTime() + 5 * 60 * 1000);

    // 🔥 Atomic update (prevents race condition)
    const result = await Seat.updateMany(
      {
        _id: { $in: seatIds },
        $or: [
          { status: "available" },
          { lockedUntil: { $lt: now } }
        ]
      },
      {
        $set: {
          status: "locked",
          lockedUntil: lockTime
        }
      }
    );

    if (result.modifiedCount !== seatIds.length) {
      return res.status(400).json({
        message: "Some seats already booked/locked"
      });
    }

    res.json({ message: "Seats locked for 5 minutes" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};