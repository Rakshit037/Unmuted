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

const AddComedianDialog = ({ open, handleClose }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      bio: "",
      experience: "",
      gender: ""
    },

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

      formData.append("image", image);

      await API.post("/comedians", formData);

      handleClose();
      window.location.reload(); // simple refresh (we’ll optimize later)
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Comedian</DialogTitle>

      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField fullWidth label="Name" margin="normal" {...formik.getFieldProps("name")} />
          <TextField fullWidth label="Age" margin="normal" {...formik.getFieldProps("age")} />
          <TextField fullWidth label="Bio" margin="normal" {...formik.getFieldProps("bio")} />
          <TextField fullWidth label="Experience" margin="normal" {...formik.getFieldProps("experience")} />
          <TextField fullWidth label="Gender" margin="normal" {...formik.getFieldProps("gender")} />

          <input type="file" onChange={handleImageChange} />

          {preview && <img src={preview} width="100%" alt="preview" />}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComedianDialog;