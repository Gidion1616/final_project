// import React, { useEffect, useState } from "react";
// import ApplyJob from "./JobApplication"; // Import the ApplyJob component

// const JobList = () => {
//   const [jobs, setJobs] = useState([]);
//   const [selectedJobId, setSelectedJobId] = useState(null);
//   const [showApplyForm, setShowApplyForm] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/jobs/");
//       if (response.ok) {
//         const data = await response.json();
//         setJobs(data);
//       } else {
//         setErrorMessage("Failed to load jobs.");
//       }
//     } catch (err) {
//       setErrorMessage("Network error: " + err.message);
//     }
//   };

//   const handleApplyClick = (jobId) => {
//     setSelectedJobId(jobId);
//     setShowApplyForm(true);
//   };

//   const handleCloseForm = () => {
//     setSelectedJobId(null);
//     setShowApplyForm(false);
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Available Jobs</h2>
//       {errorMessage && <div style={styles.error}>{errorMessage}</div>}
//       <ul style={styles.jobList}>
//         {jobs.map((job) => (
//           <li key={job.id} style={styles.jobItem}>
//             <h3>{job.title}</h3>
//             <p><strong>Location:</strong> {job.location}</p>
//             <p><strong>Description:</strong> {job.description}</p>
//             <p><strong>Experience:</strong> {job.experience}</p>
//             <p><strong>Deadline:</strong> {job.deadline}</p>
//             <button onClick={() => handleApplyClick(job.id)} style={styles.applyButton}>
//               Apply
//             </button>
//           </li>
//         ))}
//       </ul>

//       {showApplyForm && (
//         <div style={styles.modal}>
//           <div style={styles.modalContent}>
//             <button onClick={handleCloseForm} style={styles.closeButton}>X</button>
//             <ApplyJob jobId={selectedJobId} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: { maxWidth: "800px", margin: "auto", padding: "30px" },
//   jobList: { listStyle: "none", padding: 0 },
//   jobItem: { border: "1px solid #ccc", borderRadius: "5px", padding: "15px", marginBottom: "20px", backgroundColor: "#f9f9f9" },
//   applyButton: { backgroundColor: "#0b6c92", color: "#fff", padding: "8px 12px", borderRadius: "5px", border: "none", cursor: "pointer", fontWeight: "bold" },
//   error: { backgroundColor: "#f8d7da", padding: "10px", color: "#721c24", borderRadius: "5px", marginBottom: "20px" },
//   modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
//   modalContent: { backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "600px", position: "relative" },
//   closeButton: { position: "absolute", top: "10px", right: "10px", background: "red", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer" },
// };

// export default JobList;
