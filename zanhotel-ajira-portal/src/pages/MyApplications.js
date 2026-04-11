import React, { useEffect, useState } from "react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  // -----------------------------
  // FETCH APPLICATIONS
  // -----------------------------
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/jobs/my-applications/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error("Failed to fetch applications");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchApplications();
  }, []);

  // -----------------------------
  // DELETE APPLICATION
  // -----------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/jobs/applications/${id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        setApplications((prev) =>
          prev.filter((app) => app.id !== id)
        );
      } else {
        alert("Failed to delete application");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // -----------------------------
  // FORMAT DATE
  // -----------------------------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------
  // STYLES
  // -----------------------------
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "1100px",
      margin: "0 auto",
    },

    title: {
      fontSize: "24px",
      marginBottom: "20px",
      fontWeight: "600",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    },

    th: {
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "12px",
      textAlign: "left",
      fontSize: "14px",
    },

    td: {
      padding: "12px",
      borderBottom: "1px solid #eee",
      fontSize: "14px",
    },

    tr: {
      transition: "0.2s",
    },

    status: {
      padding: "5px 10px",
      borderRadius: "12px",
      color: "white",
      fontSize: "12px",
      fontWeight: "600",
    },

    deleteBtn: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "7px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
    },
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>No</th>
              <th style={styles.th}>Applicant Name</th>
              <th style={styles.th}>Hotel Name</th>
              <th style={styles.th}>Position</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Applied At</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id} style={styles.tr}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{app.applicant_name}</td>
                <td style={styles.td}>{app.hotel_name}</td>
                <td style={styles.td}>{app.position}</td>
                <td style={styles.td}>{app.location}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      backgroundColor:
                        app.status === "Pending"
                          ? "#f39c12"
                          : app.status === "Accepted"
                          ? "#27ae60"
                          : "#e74c3c",
                    }}
                  >
                    {app.status}
                  </span>
                </td>

                <td style={styles.td}>
                  {formatDate(app.applied_at)}
                </td>

                <td style={styles.td}>
                  <button
                    onClick={() => handleDelete(app.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;