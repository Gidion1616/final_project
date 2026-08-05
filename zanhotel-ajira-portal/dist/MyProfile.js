import React, { useEffect, useState } from "react";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  if (!profile) return <p>No profile found. Please complete your profile first.</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Profile</h2>
      <p><strong>Full Name:</strong> {profile.fullName}</p>
      <p><strong>Email:</strong> {profile.email}</p>

      <p><strong>CV:</strong> {profile.cv ? (
        <a href={profile.cv} target="_blank" rel="noopener noreferrer" download="cv.pdf">
          Download/View CV
        </a>
      ) : "N/A"}</p>

      <p><strong>certificates:</strong> {profile.certificates ? (
        <a href={profile.certificates} target="_blank" rel="noopener noreferrer" download="certificates.pdf">
          Download/View certificates
        </a>
      ) : "N/A"}</p>

      <p><strong>Photo:</strong></p>
      {profile.photo ? (
        <img
          src={profile.photo}
          alt="Profile"
          style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }}
        />
      ) : "N/A"}
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
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
  },
};

export default MyProfile;
