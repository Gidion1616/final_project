import React, { useState } from "react";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    description: "",
    experience: "",
    deadline: "",
    branch: "", // ✅ new field
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken"); // JWT or DRF token
      if (!token) {
        setErrorMessage("Hotel not logged in. Please login first.");
        return;
      }

      const response = await fetch("http://localhost:8000/api/jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        setSuccessMessage("Job posted successfully!");
        setErrorMessage("");
        setJobData({
          title: "",
          location: "",
          description: "",
          experience: "",
          deadline: "",
          branch: "",
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
        {/* Job Title Dropdown */}
        <label style={styles.label}>Job Title:</label>
        <select
          name="title"
          value={jobData.title}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">-- Select Job Title --</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Bar-tender">Bar-tender</option>
          <option value="House Keeping">House Keeping</option>
          <option value="Laundry">Laundry</option>
          <option value="Chef">Chef</option>
          <option value="Gardener">Gardener</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Reservation">Reservation</option>
          <option value="Security Guard">Security Guard</option>
          <option value="HR">HR</option>
          <option value="Guest Relation">Guest Relation</option>
          <option value="Banquet">Banquet</option>
          <option value="Store Keeper">Store Keeper</option>
          <option value="F & B">F & B</option>
          <option value="IT Manager">IT Manager</option>
        </select>

        {/* Hotel Branch */}
        <label style={styles.label}>Hotel Branch:</label>
        <input
          type="text"
          name="branch"
          value={jobData.branch}
          onChange={handleChange}
          required
          style={styles.input}
          placeholder="e.g. Stone Town Branch"
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
    maxWidth: "600px",
    margin: "auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "8px", fontWeight: "bold" },
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
    padding: "12px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
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
