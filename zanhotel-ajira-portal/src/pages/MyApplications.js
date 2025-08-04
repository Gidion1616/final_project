import React, { useEffect, useState } from "react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Simulate fetching user applications (you can replace this with an actual API call)
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(storedApplications);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Maombi Yangu</h2>
      {applications.length === 0 ? (
        <p>Hujatuma maombi yoyote bado.</p>
      ) : (
        <ul style={styles.list}>
          {applications.map((app, index) => (
            <li key={index} style={styles.item}>
              <h3>{app.jobTitle}</h3>
              <p><strong>Tarehe:</strong> {app.date}</p>
              <p><strong>Uzoefu:</strong> {app.experience}</p>
              <p><strong>Status:</strong> {app.status || "Inasubiri kuthibitishwa"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
};

export default MyApplications;
