import React, { useEffect, useState } from "react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(storedApplications);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Maombi Yangu</h2>
      {applications.length === 0 ? (
        <p style={styles.noApps}>Hujatuma maombi yoyote bado.</p>
      ) : (
        <div style={styles.grid}>
          {applications.map((app, index) => (
            <div key={index} style={styles.card} className="fade-in">
              <h3 style={styles.jobTitle}>{app.jobTitle}</h3>
              <p><strong>Tarehe:</strong> {app.date}</p>
              <p><strong>Jina:</strong> {app.name}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Simu:</strong> {app.phone}</p>
              <p><strong>Uzoefu:</strong> {app.experience}</p>
              <p><strong>Status:</strong> {app.status || "Inasubiri kuthibitishwa"}</p>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .fade-in {
          animation: fadeIn 0.6s ease forwards;
          opacity: 0;
          transform: translateY(10px);
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f5f8fa",
    borderRadius: "10px",
    maxWidth: "1200px",
    margin: "40px auto",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    color: "#0d2b57",
    fontWeight: "700",
  },
  noApps: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  },
  jobTitle: {
    marginTop: 0,
    marginBottom: "10px",
    color: "#007bff",
  },
};

export default MyApplications;
