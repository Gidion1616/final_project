import React, { useState, useEffect } from "react";





const ApplyJob = ({ jobId }) => {





  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cv: null,
    certificates: null,
    photo: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Please login first.");
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) payload.append(key, formData[key]);
    });
    payload.append("job", jobId);

    try {
      const response = await fetch("http://localhost:8000/api/applications/apply/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: payload,
      });

      if (response.ok) {
        setSuccessMessage("Application submitted successfully!");
        setErrorMessage("");
        setFormData({ full_name: "", email: "", phone: "", cv: null, certificates: null, photo: null });
      } else {
        const error = await response.json();
        setErrorMessage("Failed to apply: " + JSON.stringify(error));
      }
    } catch (err) {
      setErrorMessage("Network error: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Apply for Job</h2>
      {successMessage && <div style={styles.success}>{successMessage}</div>}
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
        <label style={styles.label}>Full Name:</label>
        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Phone:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>CV:</label>
        <input type="file" name="cv" onChange={handleChange} style={styles.input} />

        <label style={styles.label}>certificates:</label>
        <input type="file" name="certificates" onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Photo:</label>
        <input type="file" name="photo" onChange={handleChange} style={styles.input} />

        <button type="submit" style={styles.button}>Apply</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "auto", padding: "30px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column" },
  label: { marginBottom: "8px", fontWeight: "bold" },
  input: { padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { backgroundColor: "#0b6c92", color: "#fff", padding: "12px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", border: "none" },
  success: { backgroundColor: "#d4edda", padding: "10px", color: "#155724", borderRadius: "5px", marginBottom: "20px" },
  error: { backgroundColor: "#f8d7da", padding: "10px", color: "#721c24", borderRadius: "5px", marginBottom: "20px" },
};

export default ApplyJob;
