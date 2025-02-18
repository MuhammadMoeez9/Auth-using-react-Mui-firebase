import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../component/Firebase";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (email === "firebaseadmin@gmail.com" && password === "FirebaseAdmin") {
        toast.success("Login successful! Redirecting to Admin...", {
          position: "top-center",
          autoClose: 3000, // Show for 3 seconds
        });
        setTimeout(() => {
          navigate("/Admin");
        }, 3000);
      } else {
        toast.success("Login successfully!", {
          position: "top-center",
          autoClose: 3000, // Show for 3 seconds
        });
        setTimeout(() => {
          navigate("/CompleteProfile");
        }, 3000);
      }
    } catch (error) {
      setMessage("Invalid email or password.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} style={{ padding: "2rem", width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Login
          </Button>
        </form>
        {message && (
          <Typography
            color="error"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            {message}
          </Typography>
        )}
        <Button
          onClick={() => navigate("/register")}
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Need an account? <br /> Register
        </Button>
      </Paper>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </Container>
  );
};

export default Login;
