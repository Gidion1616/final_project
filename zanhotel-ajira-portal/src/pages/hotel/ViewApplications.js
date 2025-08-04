import React, { useEffect, useState } from "react";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const hotelName = localStorage.getItem("hotelName");

    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/jobs/applications/?hotel=${hotelName}`
        );
        if (!response.ok) throw new Error("Failed to fetch applications.");
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Applications Received</h2>

      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Job Title</th>
              <th>CV</th>
              <th>Certificate</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index}>
                <td>{app.applicant_name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.job_title}</td>
                <td>
                  {app.cv ? (
                    <a href={app.cv} download target="_blank" rel="noopener noreferrer">
                      Download CV
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {app.certificate ? (
                    <a href={app.certificate} download target="_blank" rel="noopener noreferrer">
                      Download Certificate
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {app.photo ? (
                    <a href={app.photo} download target="_blank" rel="noopener noreferrer">
                      <img
                        src={app.photo}
                        alt="Applicant"
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                      />
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

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
    backgroundColor: "#123c7a",
    color: "#fff",
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
};

export default ViewApplications;
