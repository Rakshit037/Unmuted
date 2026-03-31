import { TextField, Button, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useState } from "react";

const RegisterForm = ({ switchToLogin }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6).required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required")
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);

        await API.post("/auth/register", {
          name: values.name,
          email: values.email,
          password: values.password
        });

        toast.success("Registered successfully 🎉");
        switchToLogin();

      } catch {
        toast.error("Registration failed");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField fullWidth label="Name" margin="normal"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      <TextField fullWidth label="Email" margin="normal"
        {...formik.getFieldProps("email")}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <TextField fullWidth label="Password" type="password" margin="normal"
        {...formik.getFieldProps("password")}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />

      <TextField fullWidth label="Confirm Password" type="password" margin="normal"
        {...formik.getFieldProps("confirmPassword")}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>

      <Box mt={2}>
        <Typography>
          Already have an account?{" "}
          <span
            style={{ color: "#C9A66B", cursor: "pointer", fontWeight: 500 }}
            onClick={switchToLogin}
          >
            Login here
          </span>
        </Typography>
      </Box>
    </form>
  );
};

export default RegisterForm;