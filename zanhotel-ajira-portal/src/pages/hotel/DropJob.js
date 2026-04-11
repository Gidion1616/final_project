import React, { useEffect, useState } from "react";

const DropJob = () => {
  const [jobs, setJobs] = useState([]);

  // ---------------- FETCH JOBS ----------------
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8000/api/jobs/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchJobs();
  }, []);

  // ---------------- DELETE JOB ----------------
  const handleDrop = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/jobs/${jobId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to delete job");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Manage My Job Advertisements</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Experience</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td style={styles.td}>{job.title}</td>
                <td style={styles.td}>{job.experience}</td>
                <td style={styles.td}>{job.description}</td>

                <td style={styles.td}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDrop(job.id)}
                  >
                    🗑️ Drop Job
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

export default DropJob;

// ---------------- STYLES ----------------
const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "1000px",
    margin: "auto",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  th: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "12px",
    textAlign: "left",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },

  deleteButton: {
    padding: "8px 14px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};