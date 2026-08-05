// import React, { useState } from "react";
// import MyApplications from "./MyApplications";
// import Complaint from "./Complaint";
// import UploadProfile from "./UploadProfile";
// import UserProfile from "./UserProfile";
// import JobList from "./JobList";

// const UserDashboard = () => {
//   const [activeComponent, setActiveComponent] = useState("home");

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "applications":
//         return <MyApplications />;
//       case "complaints":
//         return <Complaint />;
//       case "profile":
//         return <UserProfile />;
//       case "jobs":
//         return <JobList />;
//       default:
//         return (
//           <div style={styles.welcomeBox}>
//             <h2>Karibu kwenye ZanHotel-Ajira Dashboard</h2>
//             <p>Chagua huduma kutoka kwenye menyu upande wa kushoto ili kuendelea.</p>
//           </div>
//         );
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("isProfileComplete");
//     localStorage.removeItem("userRole");
//     window.location.href = "/login";
//   };

//   return (
//     <div style={styles.dashboard}>
//       <aside style={styles.sidebar}>
//         <div style={styles.sidebarHeader}>
//           <h3>ZanHotel-Ajira Dashboard</h3>
//         </div>
//         <ul style={styles.menu}>
//           <li onClick={() => setActiveComponent("applications")} style={styles.menuItem}>
//             📝 Maombi Yangu
//           </li>
//           <li onClick={() => setActiveComponent("complaints")} style={styles.menuItem}>
//             📣 Malalamiko
//           </li>
//           <li onClick={() => setActiveComponent("profile")} style={styles.menuItem}>
//             👤 My Profile
//           </li>
//           <li onClick={() => setActiveComponent("jobs")} style={styles.menuItem}>
//             📄 Tazama Nafasi za Kazi
//           </li>
//           <li onClick={handleLogout} style={{ ...styles.menuItem, backgroundColor: "#dc3545" }}>
//             🚪 Logout
//           </li>
//         </ul>
//       </aside>

//       <main style={styles.content}>{renderComponent()}</main>
//     </div>
//   );
// };

// const styles = {
//   dashboard: {
//     display: "flex",
//     minHeight: "100vh",
//     fontFamily: "Arial, sans-serif",
//   },
//   sidebar: {
//     width: "240px",
//     background: "#123c7aff",
//     color: "#fff",
//     padding: "20px",
//     boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
//   },
//   sidebarHeader: {
//     marginBottom: "30px",
//     textAlign: "center",
//   },
//   menu: {
//     listStyleType: "none",
//     padding: 0,
//   },
//   menuItem: {
//     padding: "12px 15px",
//     margin: "10px 0",
//     borderRadius: "5px",
//     cursor: "pointer",
//     backgroundColor: "#0b6c92",
//     transition: "all 0.3s ease",
//   },
//   content: {
//     flex: 1,
//     padding: "30px",
//     backgroundColor: "#f8f9fa",
//   },
//   welcomeBox: {
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "10px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
// };

// export default UserDashboard;
