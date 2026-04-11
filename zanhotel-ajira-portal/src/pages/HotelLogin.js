import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/hotel/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful ✅");

        // ✅ Standardized storage (IMPORTANT)
        localStorage.setItem("token", data.token); // 🔥 FIXED
        localStorage.setItem("hotel_name", data.hotel_name);
        localStorage.setItem("hotel_id", data.hotel_id);
        localStorage.setItem("email", data.email);
        localStorage.setItem("hotelLoggedIn", "true");

        navigate("/hotel-dashboard");
      } else {
        alert(data.error || "Login failed ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formBox}>
        <div style={styles.logo}>🏨</div>
        <h2 style={styles.title}>Hotel Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
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
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Styling (unchanged)
const styles = {
  pageContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(-45deg, #0d2b57, #1a4b8c, #247ba0, #1b98e0)",
  },
  formBox: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
  },
  logo: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  title: {
    marginBottom: "20px",
    color: "#0d2b57",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1a98e0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};

export default HotelLogin;