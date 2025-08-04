import React, { useState } from "react";
import PostJob from "./hotel/PostJob";
import ViewApplications from "./hotel/ViewApplications";
import DropJob from "./hotel/DropJob";
import { useNavigate } from "react-router-dom";

const HotelDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const hotelName = localStorage.getItem("hotelName");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("hotelRegistered");
    localStorage.removeItem("hotelName");
    navigate("/hotel-register");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "post":
        return <PostJob />;
      case "view":
        return <ViewApplications />;
      case "drop":
        return <DropJob />;
      default:
        return (
          <div style={styles.welcome}>
            <h2>Karibu {hotelName || "Hotel"} Dashboard</h2>
            <p>Chagua kipengele kwenye menyu upande wa kushoto ili kuendelea.</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h3 style={styles.sidebarHeader}>{hotelName || "Hotel"}</h3>
        <ul style={styles.menu}>
          <li style={styles.menuItem} onClick={() => setActiveTab("post")}>📢 Post Job</li>
          <li style={styles.menuItem} onClick={() => setActiveTab("view")}>📄 View Applications</li>
          <li style={styles.menuItem} onClick={() => setActiveTab("drop")}>❌ Drop Advertisement</li>
          <li style={styles.menuItem} onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      <main style={styles.content}>{renderContent()}</main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "220px",
    background: "#0b2a4a",
    color: "#fff",
    padding: "20px",
  },
  sidebarHeader: {
    fontSize: "20px",
    marginBottom: "20px",
    textAlign: "center",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  menuItem: {
    padding: "12px",
    background: "#123c7a",
    marginBottom: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  content: {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
};

export default HotelDashboard;
