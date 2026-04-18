import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const JobList = () => {
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8000/api/jobs/", {
          headers: token
            ? {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              }
            : { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const jobs = await response.json();
        setJobData(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const fetchJobDetail = async (jobId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job ${jobId}: ${response.status}`);
      }

      const jobDetail = await response.json();
      return jobDetail;
    } catch (error) {
      console.error("Error fetching job detail:", error);
      return null;
    }
  };

  return (
    <div className="joblist-container">
      <style>{`
        .heading {
          text-align: center;
          margin-bottom: 40px;
          font-size: 36px;
          font-weight: bold;
          color: #fff;
        }

        .no-jobs {
          text-align: center;
          font-size: 18px;
          color: #fff;
          background-color: rgba(0,0,0,0.6);
          padding: 20px;
          border-radius: 10px;
          max-width: 400px;
          margin: 0 auto;
        }
      `}</style>

      <h2 className="heading">Available Job Opportunities</h2>

      {jobData.length === 0 ? (
        <p className="no-jobs">No job listings available at the moment.</p>
      ) : (
        <div className="grid-container">
          {jobData.map((job) => (
            <div key={job.id} className="job-card">
              <h3 className="job-title">{job.title}</h3>

              <div className="job-details">
                <p className="detail-item">
                  <strong className="label">Hotel:</strong> {job.hotel_name}
                </p>

                <p className="detail-item">
                  <strong className="label">Location:</strong>{" "}
                  {job.location || "Location not specified"}
                </p>

                <p className="detail-item">
                  <strong className="label">Experience:</strong>{" "}
                  {job.experience}
                </p>

                <p className="detail-item">
                  <strong className="label">Deadline:</strong>{" "}
                  {job.deadline}
                </p>
              </div>

              <Link to={`/apply/${job.id}`} className="apply-btn">
                Apply Now →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;



// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const JobList = () => {
//   const [jobData, setJobData] = useState([]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       const token = localStorage.getItem("token"); // jobseeker token
//       try {
//         const response = await fetch("http://localhost:8000/api/jobs/", {
//           headers: token
//             ? {
//                 "Content-Type": "application/json",
//                 Authorization: `Token ${token}`, // 🔑 include token
//               }
//             : { "Content-Type": "application/json" },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch jobs: ${response.status}`);
//         }

//         const jobs = await response.json();
//         setJobData(jobs);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Example: fetch a single job (used on apply page)
//   const fetchJobDetail = async (jobId) => {
//     const token = localStorage.getItem("token"); // jobseeker token
//     try {
//       const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${token}`, // 🔑 send token for detail fetch
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch job ${jobId}: ${response.status}`);
//       }

//       const jobDetail = await response.json();
//       return jobDetail;
//     } catch (error) {
//       console.error("Error fetching job detail:", error);
//       return null;
//     }
//   };

//   return (
//     <div className="joblist-container">
//       <style>
//         {`
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           .joblist-container {
//             padding: 40px 20px;
//             max-width: 1200px;
//             margin: 0 auto;
//             background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//             min-height: 100vh;
//           }
          
//           .heading {
//             text-align: center;
//             margin-bottom: 40px;
//             font-size: 36px;
//             font-weight: bold;
//             color: #fff;
//             text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
//             position: relative;
//             display: inline-block;
//             width: 100%;
//             letter-spacing: 1px;
//           }
          
//           .no-jobs {
//             text-align: center;
//             font-size: 18px;
//             color: #fff;
//             background-color: rgba(0,0,0,0.6);
//             padding: 20px;
//             border-radius: 10px;
//             max-width: 400px;
//             margin: 0 auto;
//           }
          
//           .grid-container {
//             display: grid;
//             grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//             gap: 30px;
//           }
          
//           .job-card {
//             border: none;
//             padding: 25px;
//             border-radius: 15px;
//             background-color: #ffffff;
//             transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//             box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//             cursor: pointer;
//             display: flex;
//             flex-direction: column;
//             height: 100%;
//             position: relative;
//             overflow: hidden;
//             animation: fadeInUp 0.5s ease forwards;
//             opacity: 0;
//           }
          
//           .job-card::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: -100%;
//             width: 100%;
//             height: 100%;
//             background: linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.1), transparent);
//             transition: left 0.5s ease;
//           }
          
//           .job-card:hover {
//             transform: translateY(-8px);
//             box-shadow: 0 12px 24px rgba(0,0,0,0.15);
//           }
          
//           .job-card:hover::before {
//             left: 100%;
//           }
          
//           .job-card:hover .job-title {
//             color: #3498db;
//             transform: translateX(5px);
//           }
          
//           .job-title {
//             font-size: 22px;
//             font-weight: bold;
//             margin-bottom: 15px;
//             color: #2c3e50;
//             border-left: 4px solid #3498db;
//             padding-left: 12px;
//             transition: color 0.3s ease, transform 0.3s ease;
//           }
          
//           .job-details {
//             flex: 1;
//             margin-bottom: 20px;
//           }
          
//           .detail-item {
//             margin: 10px 0;
//             font-size: 14px;
//             color: #555;
//             line-height: 1.5;
//           }
          
//           .label {
//             color: #2c3e50;
//             font-weight: 600;
//             min-width: 100px;
//             display: inline-block;
//           }
          
//           .apply-btn {
//             background-color: #3498db;
//             color: white;
//             padding: 12px 24px;
//             border-radius: 8px;
//             text-decoration: none;
//             display: inline-block;
//             text-align: center;
//             font-weight: 600;
//             transition: all 0.3s ease;
//             border: none;
//             font-size: 14px;
//             letter-spacing: 0.5px;
//             position: relative;
//             overflow: hidden;
//             z-index: 1;
//           }
          
//           .apply-btn::before {
//             content: '';
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             width: 0;
//             height: 0;
//             border-radius: 50%;
//             background: rgba(255,255,255,0.3);
//             transform: translate(-50%, -50%);
//             transition: width 0.5s ease, height 0.5s ease;
//             z-index: -1;
//           }
          
//           .apply-btn:hover {
//             background-color: #2980b9;
//             transform: translateY(-2px);
//             box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
//           }
          
//           .apply-btn:hover::before {
//             width: 300px;
//             height: 300px;
//           }
          
//           @keyframes fadeInUp {
//             from {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
          
//           .job-card:nth-child(1) { animation-delay: 0.1s; }
//           .job-card:nth-child(2) { animation-delay: 0.2s; }
//           .job-card:nth-child(3) { animation-delay: 0.3s; }
//           .job-card:nth-child(4) { animation-delay: 0.4s; }
//           .job-card:nth-child(5) { animation-delay: 0.5s; }
//           .job-card:nth-child(6) { animation-delay: 0.6s; }
//           .job-card:nth-child(7) { animation-delay: 0.7s; }
//           .job-card:nth-child(8) { animation-delay: 0.8s; }
//           .job-card:nth-child(9) { animation-delay: 0.9s; }
//           .job-card:nth-child(10) { animation-delay: 1s; }
//         `}
//       </style>
      
//       <h2 className="heading">Ajira Zinazopatikana</h2>
//       {jobData.length === 0 ? (
//         <p className="no-jobs">Hakuna ajira zilizowekwa kwa sasa.</p>
//       ) : (
//         <div className="grid-container">
//           {jobData.map((job) => (
//             <div key={job.id} className="job-card">
//               <h3 className="job-title">{job.title}</h3>
//               <div className="job-details">
//                 <p className="detail-item">
//                   <strong className="label">Hotel:</strong> {job.hotel_name}
//                 </p>
//                 <p className="detail-item">
//                   <strong className="label">Mahali:</strong> {job.location || "Mahali hapajatajwa"}
//                 </p>
//                 <p className="detail-item">
//                   <strong className="label">Uzoefu:</strong> {job.experience}
//                 </p>
//                 <p className="detail-item">
//                   <strong className="label">Tarehe ya mwisho:</strong> {job.deadline}
//                 </p>
//               </div>
//               <Link to={`/apply/${job.id}`} className="apply-btn">
//                 Tuma Maombi →
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobList;