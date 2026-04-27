// import React, { useState } from "react";
// // import AdminSidebar from "./AdminSidebar";
// // import StatsCards from "./StatsCards";
// // import ManageHotels from "./ManageHotels";
// // import ManageJobs from "./ManageJobs";
// // import ManageUsers from "./ManageUsers";
// // import ManageApplications from "./ManageApplications";
// // import HomeSettings from "./HomeSettings";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "hotels":
//         return <ManageHotels />;
//       case "jobs":
//         return <ManageJobs />;
//       case "users":
//         return <ManageUsers />;
//       case "applications":
//         return <ManageApplications />;
//       case "settings":
//         return <HomeSettings />;
//       default:
//         return <StatsCards />;
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <AdminSidebar setActiveTab={setActiveTab} />

//       <main style={styles.content}>
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     minHeight: "100vh",
//     fontFamily: "Arial",
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//     background: "#f4f6f9",
//   },
// };

// export default AdminDashboard;