import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useState } from "react";

const EditComedianDialog = ({ open, handleClose, comedian, refresh }) => {
  const [image, setImage] = useState(null);

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
    name: Yup.string().required(),
    age: Yup.number().required(),
    bio: Yup.string().required(),
    experience: Yup.string().required(),
    gender: Yup.string().required()
  }),

  onSubmit: async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    if (image) formData.append("image", image);

    await API.put(`/comedians/${comedian._id}`, formData);

    handleClose();
    refresh();
  }
});

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Comedian</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField fullWidth label="Name" margin="normal" {...formik.getFieldProps("name")} />
          <TextField fullWidth label="Age" margin="normal" {...formik.getFieldProps("age")} />
          <TextField fullWidth label="Bio" margin="normal" {...formik.getFieldProps("bio")} />
          <TextField fullWidth label="Experience" margin="normal" {...formik.getFieldProps("experience")} />
          <TextField fullWidth label="Gender" margin="normal" {...formik.getFieldProps("gender")} />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditComedianDialog;