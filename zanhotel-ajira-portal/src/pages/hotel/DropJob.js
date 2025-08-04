import React, { useEffect, useState } from "react";

const DropJob = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const postedJobs = JSON.parse(localStorage.getItem("postedJobs")) || [];
    const hotelName = localStorage.getItem("hotelName");

    // Filter only this hotel's jobs
    const hotelJobs = postedJobs.filter((job) => job.hotelName === hotelName);
    setJobs(hotelJobs);
  }, []);

  const handleDrop = (indexToRemove) => {
    const postedJobs = JSON.parse(localStorage.getItem("postedJobs")) || [];
    const hotelName = localStorage.getItem("hotelName");

    // Filter all jobs again
    const updatedJobs = postedJobs.filter((job, index) => {
      return !(job.hotelName === hotelName && index === indexToRemove);
    });

    // Save updated list
    localStorage.setItem("postedJobs", JSON.stringify(updatedJobs));

    // Refresh view
    setJobs(updatedJobs.filter((job) => job.hotelName === hotelName));
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
              <th>Job Title</th>
              <th>Experience</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index}>
                <td>{job.title}</td>
                <td>{job.experience}</td>
                <td>{job.description}</td>
                <td>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDrop(index)}
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
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DropJob;
