import { TextField, Button, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const LoginForm = ({ switchToRegister }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required")
    }),

    onSubmit: async (values, { setErrors }) => {
      try {
        setLoading(true);

        const res = await API.post("/auth/login", values);

        setUser(res.data.user);
        toast.success("Login successful 🎉");

        const role = res.data.user.role;

        if (role === "admin") navigate("/admin");
        else navigate("/user");

      } catch {
        setErrors({ email: "Invalid credentials" });
        toast.error("Invalid credentials");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
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

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      <Box mt={2}>
        <Typography>
          Don't have an account?{" "}
          <span
            style={{ color: "#C9A66B", cursor: "pointer", fontWeight: 500 }}
            onClick={switchToRegister}
          >
            Register here
          </span>
        </Typography>
      </Box>
    </form>
  );
};

export default LoginForm;