import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";

const AddComedianDialog = ({ open, handleClose, refresh }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      bio: "",
      experience: "",
      gender: ""
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      age: Yup.number().required("Required"),
      bio: Yup.string().required("Required"),
      experience: Yup.string().required("Required"),
      gender: Yup.string().required("Required")
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        if (image) formData.append("image", image);

        await API.post("/comedians", formData);

        toast.success("Comedian added 🎤");
        handleClose();
        refresh(); // refresh parent list

      } catch (err) {
        toast.error("Failed to add comedian");
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disableEnforceFocus // ✅ prevent focus trap conflicts
      disableAutoFocus     // ✅ prevents initial autofocus
    >
      <DialogTitle>Add Comedian</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            label="Age"
            margin="normal"
            {...formik.getFieldProps("age")}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
          />

          <TextField
            fullWidth
            label="Bio"
            margin="normal"
            {...formik.getFieldProps("bio")}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && formik.errors.bio}
          />

          <TextField
            fullWidth
            label="Experience"
            margin="normal"
            {...formik.getFieldProps("experience")}
            error={formik.touched.experience && Boolean(formik.errors.experience)}
            helperText={formik.touched.experience && formik.errors.experience}
          />

          <TextField
            fullWidth
            label="Gender"
            margin="normal"
            {...formik.getFieldProps("gender")}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
          />

          {/* Image Upload */}
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Upload Image
              <input hidden type="file" onChange={handleImageChange} />
            </Button>
          </Box>

          {preview && (
            <Box mt={2}>
              <Typography variant="body2">Preview:</Typography>
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", borderRadius: 10 }}
              />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Comedian"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComedianDialog;