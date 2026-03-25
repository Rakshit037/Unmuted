import Seat from "../models/Seat.js";

export const unlockExpiredSeats = async () => {
  const now = new Date();

  await Seat.updateMany(
    {
      status: "locked",
      lockedUntil: { $lt: now }
    },
    {
      $set: {
        status: "available",
        lockedUntil: null
      }
    }
  );
};