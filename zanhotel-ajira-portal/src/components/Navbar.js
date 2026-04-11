import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png"; // Ensure this path is correct
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="ZanHotel Logo" style={styles.logoImg} />
        <h2 style={styles.logoText}>ZanHotel-Ajira-Portal</h2>
      </div>
      <ul style={styles.navLinks}>
        <li><NavLink to="/" style={getLinkStyle}>Home</NavLink></li>
        <li><NavLink to="/select-user" style={getLinkStyle}>Login</NavLink></li>
        <li><NavLink to="/jobs" style={getLinkStyle}>Ajira</NavLink></li>
        <li><NavLink to="/about" style={getLinkStyle}>AboutUs</NavLink></li>
        <Link to="/ethics-training">Ethics & Training</Link>
      </ul>
    </nav>
  );
};

// Dynamic link style with hover + active
const getLinkStyle = ({ isActive }) => ({
  color: isActive ? "#ffd700" : "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  padding: "6px 12px",
  borderRadius: "5px",
  backgroundColor: isActive ? "#1e3a8a" : "transparent",
  transition: "all 0.3s ease",
  boxShadow: isActive ? "0 0 5px rgba(255, 255, 255, 0.5)" : "none",
  cursor: "pointer",
});

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0d2b57",
    padding: "10px 30px",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImg: {
    height: "40px",
  },
  logoText: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
};

export default Navbar;
