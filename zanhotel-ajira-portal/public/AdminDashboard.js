// import React, { useState } from "react";
// import ViewComplaints from "./ViewComplaints";
// import ManageJobs from "./ManageJobs";
// import AdminProfile from "./AdminProfile";

// const AdminDashboard = () => {
//   const [activePage, setActivePage] = useState("profile");

//   const renderPage = () => {
//     switch (activePage) {
//       case "complaints":
//         return <ViewComplaints />;
//       case "jobs":
//         return <ManageJobs />;
//       case "profile":
//       default:
//         return <AdminProfile />;
//     }
//   };

//   return (
//     <div style={styles.dashboard}>
//       <aside style={styles.sidebar}>
//         <h2 style={styles.logo}>Admin Panel</h2>
//         <ul style={styles.navList}>
//           <li onClick={() => setActivePage("profile")} style={styles.navItem}>
//             My Profile
//           </li>
//           <li onClick={() => setActivePage("jobs")} style={styles.navItem}>
//             Manage Jobs
//           </li>
//           <li onClick={() => setActivePage("complaints")} style={styles.navItem}>
//             View Complaints
//           </li>
//         </ul>
//       </aside>
//       <main style={styles.mainContent}>
//         {renderPage()}
//       </main>
//     </div>
//   );
// };

// const styles = {
//   dashboard: {
//     display: "flex",
//     height: "100vh",
//   },
//   sidebar: {
//     width: "250px",
//     backgroundColor: "#2c3e50",
//     color: "#fff",
//     padding: "20px",
//   },
//   logo: {
//     marginBottom: "30px",
//     textAlign: "center",
//   },
//   navList: {
//     listStyle: "none",
//     padding: 0,
//   },
//   navItem: {
//     padding: "10px 0",
//     cursor: "pointer",
//     borderBottom: "1px solid #34495e",
//   },
//   mainContent: {
//     flex: 1,
//     padding: "30px",
//     backgroundColor: "#ecf0f1",
//   },
// };

// export default AdminDashboard;
