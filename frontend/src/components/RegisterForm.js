import { TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";

const RegisterForm = ({ switchToLogin }) => {

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

    onSubmit: async (values, { setSubmitting }) => {
      try {
        await API.post("/auth/register", {
          name: values.name,
          email: values.email,
          password: values.password
        });

        alert("Registered successfully!");
        switchToLogin();

      } catch (error) {
        alert("Registration failed");
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
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
        label="Email"
        margin="normal"
        {...formik.getFieldProps("email")}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        {...formik.getFieldProps("password")}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        {...formik.getFieldProps("confirmPassword")}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Register
      </Button>

      <Typography mt={2}>
        Already have an account?{" "}
        <span
          style={{ color: "#6A0DAD", cursor: "pointer" }}
          onClick={switchToLogin}
        >
          Login here
        </span>
      </Typography>
    </form>
  );
};

export default RegisterForm;