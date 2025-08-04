import React, { useState } from "react";

const Complaint = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Jina kamili linahitajika";
    if (!formData.email.includes("@")) newErrors.email = "Barua pepe sahihi inahitajika";
    if (!formData.subject.trim()) newErrors.subject = "Kichwa cha malalamiko kinahitajika";
    if (!formData.message.trim()) newErrors.message = "Ujumbe wa malalamiko unahitajika";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const complaintData = new FormData();
      complaintData.append("fullName", formData.fullName);
      complaintData.append("email", formData.email);
      complaintData.append("subject", formData.subject);
      complaintData.append("message", formData.message);
      if (formData.file) {
        complaintData.append("file", formData.file);
      }

      console.log("FormData sent to backend:", formData);
      // TODO: Tuma `complaintData` kwa backend API kwa kutumia fetch/axios
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
        file: null,
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Ripoti Malalamiko</h2>
      {submitted && <p style={styles.success}>Malalamiko yako yamepokelewa. Asante kwa kutujulisha!</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="fullName"
          placeholder="Jina Kamili"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Barua Pepe"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input
          type="text"
          name="subject"
          placeholder="Kichwa cha Malalamiko"
          value={formData.subject}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.subject && <p style={styles.error}>{errors.subject}</p>}

        <textarea
          name="message"
          placeholder="Eleza kwa ufupi malalamiko yako..."
          value={formData.message}
          onChange={handleChange}
          style={{ ...styles.input, height: "120px" }}
        />
        {errors.message && <p style={styles.error}>{errors.message}</p>}

        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          style={{ marginBottom: "15px" }}
        />
        {formData.file && (
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Umechagua: <strong>{formData.file.name}</strong>
          </p>
        )}

        <button type="submit" style={styles.button}>Tuma Malalamiko</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "25px",
    backgroundColor: "#f7f7f7",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#007bff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "-10px",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "16px",
  },
};

export default Complaint;
