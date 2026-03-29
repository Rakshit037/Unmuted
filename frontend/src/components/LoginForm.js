import { TextField, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ switchToRegister }) => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required")
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await API.post("/auth/login", values);

        setUser(res.data.user);

        const role = res.data.user.role;

        // 🔥 Role-based redirect
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }

      } catch (error) {
        setErrors({
          email: "Invalid credentials"
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>

      <Typography mt={2}>
        Don't have an account?{" "}
        <span
          style={{ color: "#6A0DAD", cursor: "pointer" }}
          onClick={switchToRegister}
        >
          Register here
        </span>
      </Typography>
    </form>
  );
};

export default LoginForm;