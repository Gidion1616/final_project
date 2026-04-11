
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8000/api/jobseeker/"; // update with your backend URL

const getJobSeekerProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}me/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
};

const updateJobSeekerProfile = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL} me/update/`, {
    method: "PUT",
    headers: { Authorization: `Token ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
};

const UploadProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    cv: null,
    certificates: null,
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getJobSeekerProfile();
        setFormData({
          fullName: data.full_name || "",
          email: data.email || "",
          phoneNumber: data.phone_number || "",
          dateOfBirth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          cv: data.cv || null,
          certificate: data.certificate || null,
          photo: data.photo || null,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const payload = new FormData();
        payload.append("full_name", formData.fullName);
        payload.append("email", formData.email);
        payload.append("phone_number", formData.phoneNumber);
        payload.append("date_of_birth", formData.dateOfBirth);
        payload.append("gender", formData.gender);
        payload.append("address", formData.address);
        if (formData.cv instanceof File) payload.append("cv", formData.cv);
        if (formData.certificate instanceof File) payload.append("certificate", formData.certificates);
        if (formData.photo instanceof File) payload.append("photo", formData.photo);

        await updateJobSeekerProfile(payload);
        setSubmitted(true);
      } catch (err) {
        console.error("Error updating profile:", err);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Profile</h2>
      {submitted && <p style={styles.success}>Profile updated successfully!</p>}

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
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.phoneNumber && <p style={styles.error}>{errors.phoneNumber}</p>}

        <input
          type="date"
          name="dateOfBirth"
          placeholder="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.dateOfBirth && <p style={styles.error}>{errors.dateOfBirth}</p>}

        <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p style={styles.error}>{errors.gender}</p>}

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.address && <p style={styles.error}>{errors.address}</p>}

        <div>
          <label style={styles.label}>Upload CV (PDF)</label>
          {formData.cv && typeof formData.cv === "string" && (
            <a href={formData.cv} target="_blank" rel="noopener noreferrer">View Current CV</a>
          )}
          <input type="file" name="cv" accept=".pdf" onChange={handleChange} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>Upload Certificate (PDF)</label>
          {formData.certificate && typeof formData.certificate === "string" && (
            <a href={formData.certificate} target="_blank" rel="noopener noreferrer">View Current certificates</a>
          )}
          <input type="file" name="certificate" accept=".pdf" onChange={handleChange} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>Upload Photo (JPG/PNG)</label>
          {formData.photo && typeof formData.photo === "string" && (
            <img src={formData.photo} alt="Profile" style={{ width: 100, height: 100, marginBottom: 10 }} />
          )}
          <input type="file" name="photo" accept="image/*" onChange={handleChange} style={styles.input} />
        </div>

        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: 600, margin: "40px auto", padding: 20, border: "1px solid #ddd", borderRadius: 10, backgroundColor: "#f9f9f9" },
  heading: { textAlign: "center", marginBottom: 20 },
  input: { width: "100%", padding: 10, marginBottom: 15, borderRadius: 5, border: "1px solid #ccc" },
  button: { width: "100%", padding: 10, backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
  error: { color: "red", fontSize: 14, marginBottom: 10 },
  success: { color: "green", fontSize: 16, textAlign: "center", marginBottom: 10 },
  label: { fontWeight: "bold", marginTop: 10, display: "block" },
  form: { display: "flex", flexDirection: "column" },
};

export default UploadProfile;