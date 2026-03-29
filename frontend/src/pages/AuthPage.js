import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import authImage from "../assets/landing.jpg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { user } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  if (user) {
    if (user.role === "admin") navigate("/admin");
    else navigate("/user");
  }
}, [user, navigate]);

  return (
    <Box
      sx={{
        height: "90vh",
        backgroundColor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "90%",
          height: "90%",
          display: "flex",
          borderRadius: 3,
          overflow: "hidden"
        }}
      >
        {/* LEFT IMAGE */}
        <Box sx={{ flex: 1 }}>
          <img
            src={authImage}
            alt="auth"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </Box>

        {/* RIGHT FORM */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4
          }}
        >
          <Box sx={{ width: "80%" }}>
            <Typography variant="h4" mb={2}>
              {isLogin ? "Login" : "Register"}
            </Typography>

            {isLogin ? (
              <LoginForm switchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm switchToLogin={() => setIsLogin(true)} />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;