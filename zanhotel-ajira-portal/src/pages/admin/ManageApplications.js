import React, { useEffect, useState } from "react";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ==============================
  // FETCH ALL APPLICATIONS (ADMIN)
  // ==============================
  const fetchApplications = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/admin/applications/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ==============================
  // UPDATE STATUS
  // ==============================
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/applications/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status } : app
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // DELETE ONE
  // ==============================
  const deleteOne = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/admin/applications/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        setApplications((prev) =>
          prev.filter((a) => a.id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // CLEAR ALL
  // ==============================
  const clearAll = async () => {
    if (!window.confirm("Delete ALL applications?")) return;

    try {
      const res = await fetch(
        "http://localhost:8000/api/admin/applications/clear/",
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        setApplications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) return <p>Loading applications...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin - Manage Applications</h2>

      {/* CLEAR ALL */}
      <button onClick={clearAll} style={styles.clearBtn}>
        🧹 Clear All Applications
      </button>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>Applicant</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Job</th>
            <th>Photo</th>
            <th>CV</th>
            <th>Certificates</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app, index) => (
            <tr key={app.id}>
              <td>{index + 1}</td>
              <td>{app.applicant_name}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>{app.address}</td>
              <td>{app.position}</td>

              {/* PHOTO */}
              <td>
                {app.photo ? (
                  <a href={app.photo} target="_blank" rel="noreferrer">
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              {/* CV */}
              <td>
                {app.cv ? (
                  <a href={app.cv} target="_blank" rel="noreferrer">
                    Download
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              {/* CERTIFICATES */}
              <td>
                {app.certificates ? (
                  <a href={app.certificates} target="_blank" rel="noreferrer">
                    Download
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              {/* STATUS */}
              <td>
                <select
                  value={app.status}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </td>

              {/* ACTION */}
              <td>
                <button
                  onClick={() => deleteOne(app.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==============================
// STYLES
// ==============================
const styles = {
  container: {
    padding: 20,
    background: "#f5f7fa",
    minHeight: "100vh",
  },
  title: {
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  clearBtn: {
    marginBottom: 15,
    background: "#000",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default ManageApplications;