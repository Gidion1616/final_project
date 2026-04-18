import React, { useState } from "react";
import PostJob from "./hotel/PostJob";
import DropJob from "./hotel/DropJob";
import ViewApplications from "./hotel/ViewApplications"; 
import { useNavigate } from "react-router-dom";

const HotelDashboard = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const hotelName = localStorage.getItem("hotel_name");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hotel_name");
    navigate("/");
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
            <h2>Welcome {hotelName || "Hotel"} 👋</h2>
            <p>Select an option from the menu to continue.</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h3 style={styles.sidebarHeader}>
          {hotelName || "Hotel Dashboard"}
        </h3>

        <ul style={styles.menu}>
          <li
            style={styles.menuItem}
            onClick={() => setActiveTab("post")}
          >
            📢 Post Job
          </li>

          <li
            style={styles.menuItem}
            onClick={() => setActiveTab("view")}
          >
            📄 View Applications
          </li>

          <li
            style={styles.menuItem}
            onClick={() => setActiveTab("drop")}
          >
            ❌ Remove Job Advertisement
          </li>

          <li
            style={{ ...styles.menuItem, backgroundColor: "#e74c3c" }}
            onClick={handleLogout}
          >
            🚪 Logout
          </li>
        </ul>
      </aside>

      <main style={styles.content}>{renderContent()}</main>
    </div>
  );
};

export default HotelDashboard;

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "240px",
    background: "#0b2a4a",
    color: "#fff",
    padding: "20px",
  },

  sidebarHeader: {
    fontSize: "20px",
    marginBottom: "25px",
    textAlign: "center",
    fontWeight: "600",
  },

  menu: {
    listStyle: "none",
    padding: 0,
  },

  menuItem: {
    padding: "12px",
    background: "#123c7a",
    marginBottom: "12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "0.2s",
  },

  content: {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f4f6f9",
  },

  welcome: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
};




// import React, { useState } from "react";
// import PostJob from "./hotel/PostJob";
// import DropJob from "./hotel/DropJob";
// import ViewApplications from "./hotel/ViewApplications"; 
// import { useNavigate } from "react-router-dom";

// const HotelDashboard = () => {
//   const [activeTab, setActiveTab] = useState("welcome");
//   const hotelName = localStorage.getItem("hotel_name");
//   const navigate = useNavigate();

//   // -----------------------------
//   // LOGOUT
//   // -----------------------------
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("hotel_name");
//     navigate("/");
//   };

//   // -----------------------------
//   // RENDER CONTENT
//   // -----------------------------
//   const renderContent = () => {
//     switch (activeTab) {
//       case "post":
//         return <PostJob />;

//       case "view":
//         return <ViewApplications />; // ✅ unified applications page

//       case "drop":
//         return <DropJob />;

//       default:
//         return (
//           <div style={styles.welcome}>
//             <h2>Welcome {hotelName || "Hotel"} 👋</h2>
//             <p>Select an option from the menu to continue.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* SIDEBAR */}
//       <aside style={styles.sidebar}>
//         <h3 style={styles.sidebarHeader}>
//           {hotelName || "Hotel Dashboard"}
//         </h3>

//         <ul style={styles.menu}>
//           <li
//             style={styles.menuItem}
//             onClick={() => setActiveTab("post")}
//           >
//             📢 Post Job
//           </li>

//           <li
//             style={styles.menuItem}
//             onClick={() => setActiveTab("view")}
//           >
//             📄 View Applications
//           </li>

//           <li
//             style={styles.menuItem}
//             onClick={() => setActiveTab("drop")}
//           >
//             ❌ Drop Advertisement
//           </li>

//           <li
//             style={{ ...styles.menuItem, backgroundColor: "#e74c3c" }}
//             onClick={handleLogout}
//           >
//             🚪 Logout
//           </li>
//         </ul>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main style={styles.content}>{renderContent()}</main>
//     </div>
//   );
// };

// export default HotelDashboard;

// //
// // ============================
// // STYLES
// // ============================
// //
// const styles = {
//   container: {
//     display: "flex",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },

//   sidebar: {
//     width: "240px",
//     background: "#0b2a4a",
//     color: "#fff",
//     padding: "20px",
//   },

//   sidebarHeader: {
//     fontSize: "20px",
//     marginBottom: "25px",
//     textAlign: "center",
//     fontWeight: "600",
//   },

//   menu: {
//     listStyle: "none",
//     padding: 0,
//   },

//   menuItem: {
//     padding: "12px",
//     background: "#123c7a",
//     marginBottom: "12px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "500",
//     transition: "0.2s",
//   },

//   content: {
//     flex: 1,
//     padding: "30px",
//     backgroundColor: "#f4f6f9",
//   },

//   welcome: {
//     background: "#fff",
//     padding: "40px",
//     borderRadius: "10px",
//     textAlign: "center",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//   },
// };