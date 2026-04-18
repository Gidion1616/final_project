import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaImage,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaMapMarkerAlt,
  FaBriefcase
} from "react-icons/fa";

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Authentication required");
          setTimeout(() => navigate("/jobseeker/login"), 1500);
          return;
        }

        const jobRes = await fetch(
          `http://localhost:8000/api/jobs/${jobId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const jobData = await jobRes.json();
        setJobDetails(jobData);

        const userRes = await fetch(
          "http://localhost:8000/api/jobseeker/me/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!userRes.ok) {
          throw new Error("Failed to load user data");
        }

        const userData = await userRes.json();
        setUser(userData);

      } catch (err) {
        console.error(err);
        setError("Failed to load application data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId, navigate]);

  const handleSubmit = async () => {
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Login required");
      return;
    }

    if (!user) {
      setError("User data not loaded");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("job", jobId);

      const response = await fetch(
        "http://localhost:8000/api/jobs/apply/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);

      } else {
        const message =
          data.detail ||
          (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : null) ||
          "Application failed";

        setError(message);

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }

    } catch (err) {
      console.error(err);
      setError("Network error");

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red", textAlign: "center" }}>
        {error}
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>Application Submitted Successfully</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Job Application</h2>

      {jobDetails && (
        <p style={styles.subHeading}>
          {jobDetails.title} @ {jobDetails.hotel_name}
        </p>
      )}

      {/* USER INFO */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <FaUser /> User Information
        </h3>

        <p><b>Name:</b> {user.full_name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone_number}</p>
        <p><b>Address:</b> {user.address}</p>
        <p><b>Gender:</b> {user.gender}</p>
        <p><b>Date of Birth:</b> {user.date_of_birth}</p>
        <p><b>CV:</b> {user.cv}</p>
        <p><b>Certificates:</b> {user.certificate}</p>
        <p><b>Photo:</b> {user.photo}</p>
      </div>

      {/* SUBMIT */}
      <div style={styles.section}>
        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit Application
        </button>
      </div>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: 800,
    margin: "20px auto",
    padding: 20,
  },
  heading: {
    textAlign: "center",
    marginBottom: 10,
  },
  subHeading: {
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    padding: 20,
    marginBottom: 20,
    border: "1px solid #ddd",
    borderRadius: 8,
  },
  sectionTitle: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default JobApplicationForm;



// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FaFilePdf,
//   FaImage,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaBirthdayCake,
//   FaVenusMars,
//   FaMapMarkerAlt,
//   FaBriefcase
// } from "react-icons/fa";

// const JobApplicationForm = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [jobDetails, setJobDetails] = useState(null);

//   const [submitted, setSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   // -----------------------------
//   // FETCH JOB + USER (NO PROFILE)
//   // -----------------------------
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           setError("Authentication required");
//           setTimeout(() => navigate("/jobseeker/login"), 1500);
//           return;
//         }

//         // JOB
//         const jobRes = await fetch(
//           `http://localhost:8000/api/jobs/${jobId}/`,
//           {
//             headers: {
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         const jobData = await jobRes.json();
//         setJobDetails(jobData);

//         // USER (NEW SOURCE)
//         const userRes = await fetch(
//           "http://localhost:8000/api/jobseeker/me/",
//           {
//             headers: {
//               Authorization: `Token ${token}`,
//             },
//           }
//         );

//         if (!userRes.ok) {
//           throw new Error("Failed to load user data");
//         }

//         const userData = await userRes.json();
//         setUser(userData);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load application data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [jobId, navigate]);

//   // -----------------------------
//   // SUBMIT APPLICATION
//   // -----------------------------
//   const handleSubmit = async () => {
//   setError("");

//   const token = localStorage.getItem("token");
//   if (!token) {
//     setError("Login required");
//     return;
//   }

//   if (!user) {
//     setError("User data not loaded");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append("job", jobId);

//     const response = await fetch(
//       "http://localhost:8000/api/jobs/apply/",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Token ${token}`,
//         },
//         body: formData,
//       }
//     );

//     const data = await response.json();

//     // -----------------------------
//     // SUCCESS
//     // -----------------------------
//     if (response.ok) {
//       setSubmitted(true);

//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 2000); // show success message for 2s

//     }
//     // -----------------------------
//     // ERROR
//     // -----------------------------
//     else {
//       const message =
//         data.detail ||
//         (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : null) ||
//         "Application failed";

//       setError(message);

//       // ⬇️ redirect after showing error
//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 3000);
//     }

//   } catch (err) {
//     console.error(err);
//     setError("Network error");

//     setTimeout(() => {
//       navigate("/dashboard");
//     }, 3000);
//   }
// };
//   // -----------------------------
//   // LOADING STATE
//   // -----------------------------
//   if (isLoading) {
//     return (
//       <div style={{ textAlign: "center", padding: 40 }}>
//         Loading...
//       </div>
//     );
//   }

//   // -----------------------------
//   // ERROR STATE
//   // -----------------------------
//   if (error) {
//     return (
//       <div style={{ padding: 20, color: "red", textAlign: "center" }}>
//         {error}
//       </div>
//     );
//   }

//   // -----------------------------
//   // SUCCESS STATE
//   // -----------------------------
//   if (submitted) {
//     return (
//       <div style={{ textAlign: "center", padding: 40 }}>
//         <h2>Application Submitted Successfully</h2>
//       </div>
//     );
//   }

//   // -----------------------------
//   // MAIN UI
//   // -----------------------------
//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Job Application</h2>

//       {jobDetails && (
//         <p style={styles.subHeading}>
//           {jobDetails.title} @ {jobDetails.hotel_name}
//         </p>
//       )}

//       {/* USER INFO */}
//       <div style={styles.section}>
//         <h3 style={styles.sectionTitle}>
//           <FaUser /> User Information
//         </h3>

//         <p><b>Name:</b> {user.full_name}</p>
//         <p><b>Email:</b> {user.email}</p>
//         <p><b>Phone:</b> {user.phone_number}</p>
//         <p><b>Address:</b> {user.address}</p>
//         <p><b>Gender:</b> {user.gender}</p>
//         <p><b>Date of Birth:</b> {user.date_of_birth}</p>
//         <p><b>CV:</b> {user.cv}</p>
//         <p><b>Certificates:</b> {user.certificate}</p>
//         <p><b>Photo:</b> {user.photo}</p>
//       </div>

//       {/* SUBMIT */}
//       <div style={styles.section}>
//         <button onClick={handleSubmit} style={styles.submitButton}>
//           Submit Application
//         </button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: 800,
//     margin: "20px auto",
//     padding: 20,
//   },
//   heading: {
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subHeading: {
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   section: {
//     padding: 20,
//     marginBottom: 20,
//     border: "1px solid #ddd",
//     borderRadius: 8,
//   },
//   sectionTitle: {
//     display: "flex",
//     gap: 10,
//     alignItems: "center",
//   },
//   submitButton: {
//     padding: "12px 20px",
//     backgroundColor: "green",
//     color: "white",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//   },
// };

// export default JobApplicationForm;

