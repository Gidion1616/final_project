import React, { useState } from "react";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    experience: "",
    deadline: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hotelName = localStorage.getItem("hotelName") || "Unnamed Hotel";

    const payload = {
      ...jobData,
      hotel_name: hotelName,
    };

    try {
      const response = await fetch("http://localhost:8000/api/jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccessMessage("Job posted successfully!");
        setErrorMessage("");
        setJobData({
          title: "",
          description: "",
          location: "",
          experience: "",
          deadline: "",
        });

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const error = await response.json();
        setErrorMessage("Failed to post job. " + JSON.stringify(error));
      }
    } catch (err) {
      setErrorMessage("Network error: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Post a New Job</h2>
      {successMessage && <div style={styles.success}>{successMessage}</div>}
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Job Title:</label>
        <input
          type="text"
          name="title"
          value={jobData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Job Description:</label>
        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <label style={styles.label}>Job Location:</label>
        <input
          type="text"
          name="location"
          value={jobData.location}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Experience Required:</label>
        <input
          type="text"
          name="experience"
          value={jobData.experience}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Application Deadline:</label>
        <input
          type="date"
          name="deadline"
          value={jobData.deadline}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Post Job
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  button: {
    backgroundColor: "#0b6c92",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  success: {
    backgroundColor: "#d4edda",
    padding: "10px",
    color: "#155724",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  error: {
    backgroundColor: "#f8d7da",
    padding: "10px",
    color: "#721c24",
    borderRadius: "5px",
    marginBottom: "20px",
  },
};

export default PostJob;
