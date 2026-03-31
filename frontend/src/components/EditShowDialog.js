import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Box
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditShowDialog = ({ open, handleClose, show, refresh }) => {
  const [image, setImage] = useState(null);
  const [comedians, setComedians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComedians = async () => {
      const res = await API.get("/comedians");
      setComedians(res.data);
    };
    fetchComedians();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: show?.title || "",
      comedian_id: show?.comedian_id?._id || show?.comedian_id || "",
      venue: show?.venue || "",
      show_date: show?.show_date?.split("T")[0] || "",
      show_time: show?.show_time || "",
      description: show?.description || ""
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      comedian_id: Yup.string().required("Required"),
      venue: Yup.string().required("Required"),
      show_date: Yup.string().required("Required"),
      show_time: Yup.string().required("Required")
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        if (image) formData.append("image", image);

        await API.put(`/shows/${show._id}`, formData);

        toast.success("Show updated 🎭");
        handleClose();
        refresh();

      } catch {
        toast.error("Update failed");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Show</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          
          <TextField fullWidth label="Title" margin="normal"
            {...formik.getFieldProps("title")}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField select fullWidth label="Comedian" margin="normal"
            {...formik.getFieldProps("comedian_id")}
          >
            {comedians.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Venue" margin="normal"
            {...formik.getFieldProps("venue")}
          />

          <TextField type="date" fullWidth margin="normal"
            {...formik.getFieldProps("show_date")}
          />

          <TextField type="time" fullWidth margin="normal"
            {...formik.getFieldProps("show_time")}
          />

          <TextField fullWidth label="Description" multiline rows={3} margin="normal"
            {...formik.getFieldProps("description")}
          />

          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload New Image
              <input hidden type="file" onChange={(e) => setImage(e.target.files[0])} />
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Show"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShowDialog;