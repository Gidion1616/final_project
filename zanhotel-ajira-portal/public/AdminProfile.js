import React, { useState, useEffect } from "react";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "System Administrator",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching from backend or localStorage
    const storedProfile = JSON.parse(localStorage.getItem("adminProfile"));
    if (storedProfile) setProfile(storedProfile);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("adminProfile", JSON.stringify(profile));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Profile</h2>
      <div style={styles.card}>
        <label style={styles.label}>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          style={styles.input}
          disabled={!isEditing}
        />

        <label style={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          style={styles.input}
          disabled={!isEditing}
        />

        <label style={styles.label}>Phone:</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          style={styles.input}
          disabled={!isEditing}
        />

        <label style={styles.label}>Role:</label>
        <input
          type="text"
          name="role"
          value={profile.role}
          disabled
          style={{ ...styles.input, backgroundColor: "#eee" }}
        />

        <div style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <button style={styles.saveButton} onClick={handleSave}>Save</button>
              <button style={styles.cancelButton} onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button style={styles.editButton} onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  card: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
    marginTop: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  editButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminProfile;
