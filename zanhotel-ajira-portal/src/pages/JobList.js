import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/jobs/");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const jobs = await response.json();
        setJobData(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Ajira Zinazopatikana</h2>
      {jobData.length === 0 ? (
        <p>Hakuna ajira zilizowekwa kwa sasa.</p>
      ) : (
        jobData.map((job) => (
          <div key={job.id} style={styles.jobCard}>
            <h3>{job.title}</h3>
            <p><strong>Hotel:</strong> {job.hotel_name}</p>
            <p><strong>Mahali:</strong> {job.location || "Mahali hapajatajwa"}</p>
            <p><strong>Uzoefu:</strong> {job.experience}</p>
            <p><strong>Tarehe ya mwisho:</strong> {job.deadline}</p>
            <Link to={`/apply/${job.id}`} style={styles.applyBtn}>Tuma Maombi</Link>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  jobCard: {
    border: "1px solid #ddd",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    backgroundColor: "#f4f4f4",
  },
  applyBtn: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 15px",
    borderRadius: "5px",
    textDecoration: "none",
    display: "inline-block",
    marginTop: "10px",
  },
};

export default JobList;
