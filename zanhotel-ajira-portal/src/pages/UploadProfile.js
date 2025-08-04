import React, { useState } from "react";

const UploadProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cv: null,
    certificate: null,
    photo: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.cv) newErrors.cv = "CV is required";
    if (!formData.certificate) newErrors.certificate = "Certificate is required";
    if (!formData.photo) newErrors.photo = "Photo is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Simulate sending data to backend
      console.log("Uploading profile:", formData);
      setSubmitted(true);

      // Simulate storing to localStorage (in real app, you'd get this from API)
      localStorage.setItem("isProfileComplete", "true");

      // Optional: redirect to dashboard
      // navigate("/dashboard");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Complete Your Profile</h2>
      {submitted && <p style={styles.success}>Profile uploaded successfully!</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <label style={styles.label}>Upload CV (PDF)</label>
        <input type="file" name="cv" accept=".pdf" onChange={handleChange} style={styles.input} />
        {errors.cv && <p style={styles.error}>{errors.cv}</p>}

        <label style={styles.label}>Upload Certificate (PDF)</label>
        <input type="file" name="certificate" accept=".pdf" onChange={handleChange} style={styles.input} />
        {errors.certificate && <p style={styles.error}>{errors.certificate}</p>}

        <label style={styles.label}>Upload Photo (JPG/PNG)</label>
        <input type="file" name="photo" accept="image/*" onChange={handleChange} style={styles.input} />
        {errors.photo && <p style={styles.error}>{errors.photo}</p>}

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "-10px",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    fontSize: "16px",
    textAlign: "center",
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    marginTop: "10px",
    display: "block",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default UploadProfile;
