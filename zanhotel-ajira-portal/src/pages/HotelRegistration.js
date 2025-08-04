import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelRegistration = () => {
  const [hotelName, setHotelName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/hotel/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelName, email, password }),
      });

      if (response.ok) {
        localStorage.setItem("hotelRegistered", "true");
        localStorage.setItem("hotelName", hotelName);
        navigate("/hotel-dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Hotel Registration</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Hotel Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "30px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#123c7a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default HotelRegistration;
