import React, { useState, useEffect } from "react";
import MyApplications from "./MyApplications";
import Complaint from "./Complaint";
import UploadProfile from "./UploadProfile";
import JobList from "./JobList";
import { BiFontSize } from "react-icons/bi";
import { Icons } from "../assets/Icon";

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home");

  // ✅ USER STATE FROM BACKEND
  const [username, setUsername] = useState("user");

  // 🔥 FETCH LOGGED-IN USER
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUsername(data.full_name || "User");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "applications":
        return <MyApplications />;
      case "complaints":
        return <Complaint />;
      case "profile":
        return <UploadProfile />;
      case "jobs":
        return <JobList />;
      default:
        return (
          <div style={styles.welcomeBox}>
            <h2>Welcome {username} to ZanHotel-Ajira Dashboard</h2>
            <p>
              Select a service from the menu on the left to continue.
            </p>
          </div>
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isProfileComplete");
    window.location.href = "/";
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3>Welcome {username}</h3>
        </div>

        <ul style={styles.menu}>
  <li onClick={() => setActiveComponent("applications")} style={styles.menuItem}>
  <img src={Icons.notebook0} style={styles.iconImg} />
  My Applications
</li>

<li onClick={() => setActiveComponent("complaints")} style={styles.menuItem}>
  <img src={Icons.complain0} style={styles.iconImg} />
  Complaints
</li>

<li onClick={() => setActiveComponent("profile")} style={styles.menuItem}>
  <img src={Icons.profile0} style={styles.iconImg} />
  My Profile
</li>

<li onClick={() => setActiveComponent("jobs")} style={styles.menuItem}>
  <img src={Icons.job0} style={styles.iconImg} />
  Job Opportunities
</li>

<li onClick={handleLogout} style={{ ...styles.menuItem, backgroundColor: "#dc3545" }}>
  <img src={Icons.logout1} style={styles.iconImg} />
  Logout
</li>
</ul>
      </aside>

      {/* Main Content */}
      <main style={styles.content}>{renderComponent()}</main>
    </div>
  );
};
const styles = {
  dashboard: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  iconImg: {
  width: "30px",
  height: "30px",
  background: "transparent",
  borderRadius: "10px",
  boxShadow: "none",
  padding: 0,
  marginRight: "10px",
  verticalAlign: "middle",
},
  sidebar: {
    width: "240px",
    background: "#123c7aff",
    color: "#fff",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  sidebarHeader: {
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "15px"
  },
  menu: {
    listStyleType: "none",
    padding: 0,
  },
  menuItem: {
    padding: "12px 15px",
    margin: "10px 0",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#0b6c92",
    transition: "all 0.3s ease",
  },
  content: {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f8f9fa",
  },
  welcomeBox: {
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};




export default UserDashboard;





// import React, { useState, useEffect } from "react";
// import MyApplications from "./MyApplications";
// import Complaint from "./Complaint";
// import UploadProfile from "./UploadProfile";
// import JobList from "./JobList";
// import { BiFontSize } from "react-icons/bi";

// const UserDashboard = () => {
//   const [activeComponent, setActiveComponent] = useState("home");

//   // ✅ USER STATE FROM BACKEND
//   const [username, setUsername] = useState("user");

//   // 🔥 FETCH LOGGED-IN USER
//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) return;

//       try {
//         const res = await fetch("http://localhost:8000/api/user/", {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });

//         if (!res.ok) return;

//         const data = await res.json();
//         setUsername(data.full_name || "User");
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUser();
//   }, []);

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "applications":
//         return <MyApplications />;
//       case "complaints":
//         return <Complaint />;
//       case "profile":
//         return <UploadProfile />;
//       case "jobs":
//         return <JobList />;
//       default:
//         return (
//           <div style={styles.welcomeBox}>
//             <h2>Karibu {username} kwenye ZanHotel-Ajira Dashboard</h2>
//             <p>
//               Chagua huduma kutoka kwenye menyu upande wa kushoto ili kuendelea.
//             </p>
//           </div>
//         );
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("isProfileComplete");
//     window.location.href = "/";
//   };

//   return (
//     <div style={styles.dashboard}>
//       {/* Sidebar */}
//       <aside style={styles.sidebar}>
//         <div style={styles.sidebarHeader}>
//           <h3>Welcome {username}</h3>
//         </div>

//         <ul style={styles.menu}>
//           <li
//             onClick={() => setActiveComponent("applications")}
//             style={styles.menuItem}
//           >
//             📝 Maombi Yangu
//           </li>

//           <li
//             onClick={() => setActiveComponent("complaints")}
//             style={styles.menuItem}
//           >
//             📣 Malalamiko
//           </li>

//           <li
//             onClick={() => setActiveComponent("profile")}
//             style={styles.menuItem}
//           >
//             👤 My Profile
//           </li>

//           <li
//             onClick={() => setActiveComponent("jobs")}
//             style={styles.menuItem}
//           >
//             📄 Tazama Nafasi za Kazi
//           </li>

//           <li
//             onClick={handleLogout}
//             style={{ ...styles.menuItem, backgroundColor: "#dc3545" }}
//           >
//             🚪 Logout
//           </li>
//         </ul>
//       </aside>

//       {/* Main Content */}
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
//     fontSize: "15px"
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
