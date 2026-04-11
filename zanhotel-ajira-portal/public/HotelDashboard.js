import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostJob from "./hotel/PostJob";
import ViewApplications from "./hotel/ViewApplications";
import DropJob from "./hotel/DropJob";

const HotelDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hotelName = localStorage.getItem("hotelName");
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/hotel-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hotel_id");
    localStorage.removeItem("hotelName");
    localStorage.removeItem("email");
    navigate("/hotel-login");
  };

  const handleTabChange = (tab) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 300);
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
    <div style={styles.background}>
      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeaderContainer}>
            <h3 style={styles.sidebarHeader}>{hotelName || "Hotel"}</h3>
            <div style={styles.hotelPulse}></div>
          </div>
          <ul style={styles.menu}>
            <li 
              style={{...styles.menuItem, ...(activeTab === "post" ? styles.activeMenuItem : {})}} 
              onClick={() => handleTabChange("post")}
            >
              <span style={styles.menuIcon}>📢</span> Post Job
            </li>
            <li 
              style={{...styles.menuItem, ...(activeTab === "view" ? styles.activeMenuItem : {})}} 
              onClick={() => handleTabChange("view")}
            >
              <span style={styles.menuIcon}>📄</span> View Applications
            </li>
            <li 
              style={{...styles.menuItem, ...(activeTab === "drop" ? styles.activeMenuItem : {})}} 
              onClick={() => handleTabChange("drop")}
            >
              <span style={styles.menuIcon}>❌</span> Drop Advertisement
            </li>
            <li 
              style={styles.menuItem} 
              onClick={handleLogout}
            >
              <span style={styles.menuIcon}>🚪</span> Logout
            </li>
          </ul>
        </aside>

        <main style={{...styles.content, opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s ease'}}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  background: {
    minHeight: "100vh",
    background: "linear-gradient(-45deg, #0b2a4a, #123c7a, #1a4b8c, #247ba0)",
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
    position: "relative",
    overflow: "hidden",
    "::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "url('https://www.transparenttextures.com/patterns/dark-stripes.png')",
      opacity: 0.05,
      pointerEvents: "none",
    }
  },
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    zIndex: 1,
  },
  sidebar: {
    width: "260px",
    background: "rgba(11, 42, 74, 0.85)",
    color: "#fff",
    padding: "25px 20px",
    backdropFilter: "blur(8px)",
    boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
    borderRight: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
  },
  sidebarHeaderContainer: {
    position: "relative",
    paddingBottom: "20px",
    marginBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  sidebarHeader: {
    fontSize: "22px",
    margin: "0",
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  hotelPulse: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px",
    height: "3px",
    background: "linear-gradient(90deg, #1a98e0, #00ffaa)",
    borderRadius: "3px",
    animation: "pulse 2s ease infinite",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  menuItem: {
    padding: "14px 16px",
    background: "rgba(18, 60, 122, 0.6)",
    marginBottom: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "500",
    ":hover": {
      background: "rgba(26, 75, 140, 0.8)",
      transform: "translateX(5px)",
    }
  },
  activeMenuItem: {
    background: "linear-gradient(90deg, #1a98e0, #00a8ff)",
    boxShadow: "0 4px 15px rgba(26, 152, 224, 0.4)",
    fontWeight: "600",
  },
  menuIcon: {
    marginRight: "12px",
    fontSize: "18px",
  },
  content: {
    flex: 1,
    padding: "40px",
    backgroundColor: "rgba(248, 249, 250, 0.95)",
    backdropFilter: "blur(5px)",
    overflowY: "auto",
  },
  welcome: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
    maxWidth: "800px",
    margin: "0 auto",
    animation: "fadeIn 0.5s ease",
  },
};

// Global styles for animations
const globalStyles = `
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes pulse {
    0% {
      width: 60px;
      opacity: 1;
    }
    50% {
      width: 100px;
      opacity: 0.7;
    }
    100% {
      width: 60px;
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Add global styles to the document head
const styleElement = document.createElement("style");
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

export default HotelDashboard;