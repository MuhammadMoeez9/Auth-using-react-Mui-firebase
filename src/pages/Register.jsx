import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../component/Firebase";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti"; // Import the confetti effect

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check if the user already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists, show a message
        toast.info("Account already exists with this email.", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/login");
      } else {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userDocRef = doc(db, "users", userCredential.user.uid);

        // Set the user data (this will create the document if it doesn't exist)
        await setDoc(userDocRef, {
          uid: userCredential.user.uid,
          email,
          createdAt: serverTimestamp(), // Save the registration time with serverTimestamp
        });

        console.log("Document ID:", userDocRef.id);

        toast.success("Account created successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Show confetti
        setShowConfetti(true);

        // After the celebration, navigate to the login page
        setTimeout(() => {
          setShowConfetti(false); // Hide confetti
          navigate("/login");
        }, 3000); // Keep confetti for 3 seconds
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(`Error: ${error.message}`);
      toast.error(`Error: ${error.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
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
        position: "relative", // To position confetti correctly
      }}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth} // Full screen width
          height={window.innerHeight} // Full screen height
        />
      )}
      <Paper elevation={3} style={{ padding: "2rem", width: "100%" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
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
            Register
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
          onClick={() => navigate("/login")}
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Already have an account? <br /> Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Register;
