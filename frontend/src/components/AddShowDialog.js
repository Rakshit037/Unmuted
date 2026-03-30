import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useEffect, useState } from "react";
import SeatLayoutBuilder from "./SeatLayoutBuilder";

const AddShowDialog = ({ open, handleClose }) => {
  const [image, setImage] = useState(null);
  const [comedians, setComedians] = useState([]);
  const [seatLayout, setSeatLayout] = useState({});

  // 🔥 Fetch comedians for dropdown
  useEffect(() => {
    const fetchComedians = async () => {
      const res = await API.get("/comedians");
      setComedians(res.data);
    };
    fetchComedians();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      comedian_id: "",
      venue: "",
      show_date: "",
      show_time: "",
      description: ""
    },

    validationSchema: Yup.object({
      title: Yup.string().required(),
      comedian_id: Yup.string().required(),
      venue: Yup.string().required(),
      show_date: Yup.string().required(),
      show_time: Yup.string().required()
    }),

    onSubmit: async (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // TEMP: empty seat layout (we'll build next)
      formData.append("seat_layout", JSON.stringify(seatLayout));

      if (image) formData.append("image", image);

      await API.post("/shows", formData);

      handleClose();
      window.location.reload(); // temporary
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Show</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          
          <TextField fullWidth label="Title" margin="normal" {...formik.getFieldProps("title")} />

          <TextField
            select
            fullWidth
            label="Select Comedian"
            margin="normal"
            {...formik.getFieldProps("comedian_id")}
          >
            {comedians.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Venue" margin="normal" {...formik.getFieldProps("venue")} />

          <TextField
            type="date"
            fullWidth
            margin="normal"
            {...formik.getFieldProps("show_date")}
          />

          <TextField
            type="time"
            fullWidth
            margin="normal"
            {...formik.getFieldProps("show_time")}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            {...formik.getFieldProps("description")}
          />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <SeatLayoutBuilder setSeatLayout={setSeatLayout} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Show
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddShowDialog;