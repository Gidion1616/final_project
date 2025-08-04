import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // hakikisha path ni sahihi

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <img src={logo} alt="ZanHotel Logo" style={styles.logoImg} />
      <h2 style={styles.logoText}>ZanHotel-Ajira-Portal</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/register" style={styles.link}>Register</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
        <li><Link to="/jobs" style={styles.link}>Ajira</Link></li>
        <li><Link to="/about" style={styles.link}>AboutUs</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor:"#0d2b57ff",
    padding: "10px 20px",
    color: "#fff",
  },
  logoImg: {
    height: "40px",
    marginRight: "10px",
   
  },
  logoText: {
    margin: 0,
    fontSize: "20px",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "15px",
    margin: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
