import React from "react";

const AdminSidebar = ({ setActiveTab }) => {
  return (
    <div style={styles.sidebar}>
      <h2 style={{ color: "white", marginBottom: 20 }}>ADMIN PANEL</h2>

      <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
      <button onClick={() => setActiveTab("hotels")}>Hotels</button>
      <button onClick={() => setActiveTab("jobs")}>Jobs</button>
      <button onClick={() => setActiveTab("applications")}>Applications</button>
      <button onClick={() => setActiveTab("users")}>Users</button>
      <button onClick={() => setActiveTab("settings")}>Home Settings</button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: 220,
    background: "#0b2a4a",
    padding: 15,
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
};

export default AdminSidebar;