// import React, { useEffect, useState } from "react";

// const UserProfile = () => {
//   const [profile, setProfile] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     cv: null,
//     certificates: null,
//     photo: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/user/profile/", {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error("Failed to fetch profile");
//         const data = await response.json();
//         setProfile(data);
//       } catch (error) {
//         console.error(error);
//         setMessage(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [token]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setProfile((prev) => ({ ...prev, [name]: files[0] }));
//     } else {
//       setProfile((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setMessage("");
//     try {
//       const formData = new FormData();
//       formData.append("full_name", profile.full_name);
//       formData.append("phone_number", profile.phone_number);
//       if (profile.cv instanceof File) formData.append("cv", profile.cv);
//       if (profile.certificates instanceof File) formData.append("certificates", profile.certificates);
//       if (profile.photo instanceof File) formData.append("photo", profile.photo);

//       const response = await fetch("http://localhost:8000/api/user/profile/", {
//         method: "PATCH",
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to update profile");
//       setMessage("Profile updated successfully!");
//       // Re-fetch updated profile
//       const updated = await response.json();
//       setProfile(updated);
//     } catch (error) {
//       console.error(error);
//       setMessage(error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Your Profile</h2>
//       {message && <p style={{ color: "green" }}>{message}</p>}
//       <div style={styles.field}>
//         <label>Full Name:</label>
//         <input
//           type="text"
//           name="full_name"
//           value={profile.full_name || ""}
//           onChange={handleChange}
//           placeholder="Enter full name"
//         />
//       </div>
//       <div style={styles.field}>
//         <label>Email:</label>
//         <input type="email" name="email" value={profile.email || ""} disabled />
//       </div>
//       <div style={styles.field}>
//         <label>Phone Number:</label>
//         <input
//           type="text"
//           name="phone_number"
//           value={profile.phone_number || ""}
//           onChange={handleChange}
//           placeholder="Enter phone number"
//         />
//       </div>
//       <div style={styles.field}>
//         <label>CV:</label>
//         {profile.cv && !(profile.cv instanceof File) && (
//           <a href={profile.cv} target="_blank" rel="noreferrer">
//             View CV
//           </a>
//         )}
//         <input type="file" name="cv" onChange={handleChange} />
//       </div>
//       <div style={styles.field}>
//         <label>certificates:</label>
//         {profile.certificates && !(profile.certificates instanceof File) && (
//           <a href={profile.certificates} target="_blank" rel="noreferrer">
//             View certificates
//           </a>
//         )}
//         <input type="file" name="certificates" onChange={handleChange} />
//       </div>
//       <div style={styles.field}>
//         <label>Photo:</label>
//         {profile.photo && !(profile.photo instanceof File) && (
//           <img
//             src={profile.photo}
//             alt="Profile"
//             style={{ width: "100px", borderRadius: "10px", marginTop: "5px" }}
//           />
//         )}
//         <input type="file" name="photo" onChange={handleChange} />
//       </div>

//       <button onClick={handleSave} disabled={saving} style={styles.button}>
//         {saving ? "Saving..." : "Save Profile"}
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: "500px",
//     margin: "40px auto",
//     padding: "20px",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     backgroundColor: "#f9f9f9",
//   },
//   heading: {
//     textAlign: "center",
//     marginBottom: "20px",
//   },
//   field: {
//     marginBottom: "15px",
//   },
//   button: {
//     backgroundColor: "#4f46e5",
//     color: "white",
//     fontWeight: "bold",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//   },
// };

// export default UserProfile;
