import React, { useEffect, useState } from "react";

const DropJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const hotelName = localStorage.getItem("hotelName");

  // Fetch all jobs for the logged-in hotel
  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/jobs/?hotel_name=${hotelName}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();

      // Filter only jobs for this hotel
      const hotelJobs = data.filter((job) => job.hotel_name === hotelName);
      setJobs(hotelJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job from backend
  const handleDrop = async (jobId) => {
    if (!window.confirm("Are you sure you want to cancel this job posting?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== jobId));
      } else {
        const error = await response.json();
        alert("Failed to delete job: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Manage My Job Advertisements</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Experience</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.experience}</td>
                <td>{job.description}</td>
                <td>{job.deadline}</td>
                <td>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDrop(job.id)}
                  >
                    🗑️ Cancel Job
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
