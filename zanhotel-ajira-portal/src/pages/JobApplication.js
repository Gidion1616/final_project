import React, { useState } from "react";
import { useParams } from "react-router-dom";

const JobApplication = () => {
  const { id } = useParams(); // job ID from URL
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    cv: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cv") {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("applicant_name", formData.name);
    form.append("email", formData.email);
    form.append("phone", formData.message); // using 'message' as 'phone'
    form.append("cv", formData.cv);
    form.append("job", id); // Foreign key to Job ID

    try {
      const response = await fetch("http://localhost:8000/api/jobs/apply/", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert("Ushindwe kutuma maombi. Tafadhali hakikisha taarifa zako ni sahihi.");
      }
    } catch (error) {
      console.error("Network/server error:", error);
      alert("Tatizo la mtandao au seva. Tafadhali jaribu tena.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tuma Maombi ya Kazi (Job ID: {id})</h2>

      {submitted ? (
        <p style={styles.success}>Asante! Maombi yako yametumwa kikamilifu.</p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Jina Kamili"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Barua Pepe"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="message"
            placeholder="Namba ya Simu"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
            style={styles.textarea}
          ></textarea>

          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Tuma Maombi
          </button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fdfdfd",
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
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  success: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default JobApplication;
