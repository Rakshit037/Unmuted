import Seat from "../models/Seat.js";

export const generateSeatsForShow = async (show_id, seat_layout) => {
  const seats = [];

  for (const level in seat_layout) {
    const { rows, seats_per_row, price } = seat_layout[level];

    rows.forEach((row) => {
      for (let i = 1; i <= seats_per_row; i++) {
        seats.push({
          show_id,
          seat_no: `${row}${i}`,
          row,
          number: i,
          level,
          price
        });
      }
    });
  }

  await Seat.insertMany(seats);
};