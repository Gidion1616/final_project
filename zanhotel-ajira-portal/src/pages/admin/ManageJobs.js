import React, { useEffect, useState } from "react";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/jobs/")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const deleteJob = async (id) => {
    await fetch(`http://localhost:8000/api/jobs/${id}/delete/`, {
      method: "DELETE",
    });

    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <div>
      <h2>Manage Jobs</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Hotel</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.hotel_name}</td>
              <td>
                <button onClick={() => deleteJob(job.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageJobs;