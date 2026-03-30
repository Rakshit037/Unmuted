import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem
} from "@mui/material";
import { useState } from "react";

const LEVELS = ["Platinum", "Gold", "Executive", "Royal"];

const SeatLayoutBuilder = ({ setSeatLayout }) => {
  const [levels, setLevels] = useState([]);

  const addLevel = () => {
    setLevels([
      ...levels,
      {
        level: "",
        rows: "",
        seats_per_row: "",
        price: ""
      }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...levels];
    updated[index][field] = value;
    setLevels(updated);

    buildJSON(updated);
  };

  const buildJSON = (data) => {
    const layout = {};

    data.forEach((item) => {
      if (!item.level) return;

      layout[item.level] = {
        rows: item.rows.split(",").map((r) => r.trim()),
        seats_per_row: Number(item.seats_per_row),
        price: Number(item.price)
      };
    });

    setSeatLayout(layout);
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">Seat Layout</Typography>

      {levels.map((lvl, index) => (
        <Box key={index} mt={2} p={2} border="1px solid #ccc" borderRadius={2}>
          
          <TextField
            select
            label="Level"
            fullWidth
            margin="normal"
            value={lvl.level}
            onChange={(e) =>
              handleChange(index, "level", e.target.value)
            }
          >
            {LEVELS.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Rows (A,B,C)"
            fullWidth
            margin="normal"
            value={lvl.rows}
            onChange={(e) =>
              handleChange(index, "rows", e.target.value)
            }
          />

          <TextField
            label="Seats per row"
            fullWidth
            margin="normal"
            value={lvl.seats_per_row}
            onChange={(e) =>
              handleChange(index, "seats_per_row", e.target.value)
            }
          />

          <TextField
            label="Price"
            fullWidth
            margin="normal"
            value={lvl.price}
            onChange={(e) =>
              handleChange(index, "price", e.target.value)
            }
          />
        </Box>
      ))}

      <Button variant="outlined" onClick={addLevel} sx={{ mt: 2 }}>
        + Add Level
      </Button>
    </Box>
  );
};

export default SeatLayoutBuilder;