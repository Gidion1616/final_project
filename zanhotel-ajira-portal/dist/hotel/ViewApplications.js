import React, { useEffect, useState } from "react";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const hotelName = localStorage.getItem("hotelName");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/applications/?hotel=${encodeURIComponent(hotelName)}`
      );
      if (!response.ok) throw new Error("Failed to fetch applications.");
      const data = await response.json();

      const sortedData = [...data].sort((a, b) =>
        a.job_title.localeCompare(b.job_title)
      );

      setApplications(sortedData);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Delete single application by id
  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/applications/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        setApplications((prevApps) => prevApps.filter((app) => app.id !== id));
      } else {
        alert("Failed to delete application.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting application.");
    }
  };

  // Delete all applications for the hotel
  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL applications for your hotel?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/applications/clear_all/?hotel=${encodeURIComponent(hotelName)}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setApplications([]); // clear local state
      } else {
        alert("Failed to clear applications.");
      }
    } catch (error) {
      console.error("Clear all error:", error);
      alert("Error clearing applications.");
    }
  };

  // Group applications by job title
  const groupedApplications = applications.reduce((groups, app) => {
    if (!groups[app.job_title]) {
      groups[app.job_title] = [];
    }
    groups[app.job_title].push(app);
    return groups;
  }, {});

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Applications Received</h2>

      {applications.length > 0 && (
        <button style={styles.clearAllButton} onClick={handleClearAll}>
          Clear All Applications
        </button>
      )}

      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        Object.keys(groupedApplications).map((jobTitle) => (
          <div key={jobTitle} style={styles.group}>
            <h3 style={styles.groupTitle}>{jobTitle}</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>CV</th>
                    <th>Certificate</th>
                    <th>Photo</th>
                    <th>Applied At</th>
                    <th>Actions</th> {/* New column */}
                  </tr>
                </thead>
                <tbody>
                  {groupedApplications[jobTitle].map((app, index) => (
                    <tr
                      key={app.id}
                      style={
                        index % 2 === 0
                          ? styles.tableRowEven
                          : styles.tableRowOdd
                      }
                    >
                      <td>{app.applicant_name}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>
                        {app.cv ? (
                          <a
                            href={app.cv}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download CV
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {app.certificate ? (
                          <a
                            href={app.certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Certificate
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {app.photo ? (
                          <img
                            src={app.photo}
                            alt="Applicant"
                            style={styles.photo}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{formatDateTime(app.applied_at)}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          style={styles.deleteButton}
                          title="Delete Application"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "1100px",
    margin: "40px auto",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  clearAllButton: {
    backgroundColor: "#d9534f",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  group: {
    marginBottom: "40px",
  },
  groupTitle: {
    marginBottom: "10px",
    backgroundColor: "#f4f4f4",
    padding: "8px",
    borderRadius: "5px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableRowEven: {
    backgroundColor: "#fafafa",
  },
  tableRowOdd: {
    backgroundColor: "#fff",
  },
  photo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ViewApplications;
