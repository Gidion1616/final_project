// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary hardcoded credentials
    if (credentials.username === "admin" && credentials.password === "admin123") {
      localStorage.setItem("adminToken", "fake-admin-token");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default AdminLogin;
