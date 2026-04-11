import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ---------------- FETCH ----------------
  const fetchApplications = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/jobs/hotel-applications/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ---------------- STATUS UPDATE ----------------
  const updateStatus = async (id, status) => {
    await fetch(
      "http://localhost:8000/api/jobs/hotel-applications/",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ id, status }),
      }
    );

    fetchApplications();
  };

  // ---------------- DELETE ONE ----------------
  const deleteOne = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    await fetch(
      `http://localhost:8000/api/jobs/hotel-applications/${id}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      }
    );

    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // ---------------- CLEAR ALL ----------------
  const clearAll = async () => {
    if (!window.confirm("Delete ALL applications?")) return;

    await fetch(
      "http://localhost:8000/api/jobs/hotel-applications/clear-all/",
      {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      }
    );

    setApplications([]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Hotel Applications</h2>

      {/* CLEAR ALL */}
      <button
        onClick={clearAll}
        style={{
          background: "black",
          color: "white",
          padding: 10,
          marginBottom: 15,
        }}
      >
        Clear All Applications
      </button>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Photo</th>
            <th>CV</th>
            <th>Certificate</th>
            <th>Position</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td>{a.applicant_name}</td>
              <td>{a.email}</td>
              <td>{a.phone}</td>
              <td>{a.address}</td>

              {/* PHOTO PREVIEW */}
              <td>
                {a.photo ? (
                  <a
                    href={`${BASE_URL}${a.photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${BASE_URL}${a.photo}`}
                      alt="Applicant"
                      width="40"
                      height="40"
                      style={{
                        borderRadius: "50%",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                    />
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              {/* CV */}
              <td>
                {a.cv ? (
                  <>
                    <a
                      href={`${BASE_URL}${a.cv}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview
                    </a>
                    {" | "}
                    <a
                      href={`${BASE_URL}${a.cv}`}
                      download
                    >
                      Download
                    </a>
                  </>
                ) : (
                  "N/A"
                )}
              </td>

              {/* CERTIFICATES */}
              <td>
                {a.certificate ? (
                  <>
                    <a
                      href={`${BASE_URL}${a.certificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview
                    </a>
                    {" | "}
                    <a
                      href={`${BASE_URL}${a.certificate}`}
                      download
                    >
                      Download
                    </a>
                  </>
                ) : (
                  "N/A"
                )}
              </td>

              <td>{a.position}</td>

              {/* STATUS */}
              <td>
                <select
                  value={a.status}
                  onChange={(e) => updateStatus(a.id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </td>

              {/* ACTION */}
              <td>
                <button
                  onClick={() => deleteOne(a.id)}
                  style={{ background: "red", color: "white" }}
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

export default ViewApplications;