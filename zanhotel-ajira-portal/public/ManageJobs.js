// import React, { useState, useEffect } from "react";

// const ManageJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     experience: "",
//     deadline: "",
//   });

//   useEffect(() => {
//     const storedJobs = JSON.parse(localStorage.getItem("adminJobs"));
//     if (storedJobs) setJobs(storedJobs);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.description || !formData.deadline || !formData.experience) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const newJob = {
//       ...formData,
//       id: Date.now(),
//     };

//     const updatedJobs = [newJob, ...jobs];
//     setJobs(updatedJobs);
//     localStorage.setItem("adminJobs", JSON.stringify(updatedJobs));
//     setFormData({ title: "", description: "", experience: "", deadline: "" });
//   };

//   const handleDelete = (id) => {
//     const updatedJobs = jobs.filter((job) => job.id !== id);
//     setJobs(updatedJobs);
//     localStorage.setItem("adminJobs", JSON.stringify(updatedJobs));
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Manage Job Listings</h2>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           type="text"
//           name="title"
//           placeholder="Job Title"
//           value={formData.title}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <textarea
//           name="description"
//           placeholder="Job Description"
//           value={formData.description}
//           onChange={handleChange}
//           style={styles.textarea}
//         />
//         <input
//           type="text"
//           name="experience"
//           placeholder="Required Experience (e.g., 2 years)"
//           value={formData.experience}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <input
//           type="date"
//           name="deadline"
//           value={formData.deadline}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <button type="submit" style={styles.button}>Post Job</button>
//       </form>

//       <h3 style={{ marginTop: "30px" }}>Posted Jobs</h3>
//       {jobs.length === 0 ? (
//         <p>No jobs posted yet.</p>
//       ) : (
//         <ul style={styles.jobList}>
//           {jobs.map((job) => (
//             <li key={job.id} style={styles.jobItem}>
//               <h4>{job.title}</h4>
//               <p><strong>Description:</strong> {job.description}</p>
//               <p><strong>Experience:</strong> {job.experience}</p>
//               <p><strong>Deadline:</strong> {job.deadline}</p>
//               <button onClick={() => handleDelete(job.id)} style={styles.deleteButton}>
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: "20px",
//     maxWidth: "800px",
//     margin: "0 auto",
//   },
//   heading: {
//     fontSize: "24px",
//     marginBottom: "20px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   input: {
//     padding: "10px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   textarea: {
//     padding: "10px",
//     height: "100px",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     padding: "10px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
//   jobList: {
//     listStyle: "none",
//     padding: 0,
//   },
//   jobItem: {
//     border: "1px solid #ddd",
//     borderRadius: "5px",
//     padding: "15px",
//     marginBottom: "10px",
//     backgroundColor: "#f5f5f5",
//   },
//   deleteButton: {
//     marginTop: "10px",
//     padding: "8px 12px",
//     backgroundColor: "#dc3545",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
// };

// export default ManageJobs;
