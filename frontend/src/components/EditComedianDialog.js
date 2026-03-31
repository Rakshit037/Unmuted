import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useState } from "react";
import toast from "react-hot-toast";

const EditComedianDialog = ({ open, handleClose, comedian, refresh }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: comedian?.name || "",
      age: comedian?.age || "",
      bio: comedian?.bio || "",
      experience: comedian?.experience || "",
      gender: comedian?.gender || ""
    },
    enableReinitialize: true,

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

        await API.put(`/comedians/${comedian._id}`, formData);

        toast.success("Updated successfully");
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
      <DialogTitle>Edit Comedian</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          
          <TextField fullWidth label="Name" margin="normal"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField fullWidth label="Age" margin="normal"
            {...formik.getFieldProps("age")}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
          />

          <TextField fullWidth label="Bio" margin="normal"
            {...formik.getFieldProps("bio")}
            error={formik.touched.bio && Boolean(formik.errors.bio)}
            helperText={formik.touched.bio && formik.errors.bio}
          />

          <TextField fullWidth label="Experience" margin="normal"
            {...formik.getFieldProps("experience")}
            error={formik.touched.experience && Boolean(formik.errors.experience)}
            helperText={formik.touched.experience && formik.errors.experience}
          />

          <TextField fullWidth label="Gender" margin="normal"
            {...formik.getFieldProps("gender")}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
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
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditComedianDialog;