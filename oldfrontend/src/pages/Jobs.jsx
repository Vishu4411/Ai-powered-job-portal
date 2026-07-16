import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Jobs.css";

function Jobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    API.get("/jobs")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="jobs-page">

      <h1>Available Jobs</h1>

      <div className="jobs-grid">

        {jobs.map((job) => (

          <div className="job-card" key={job.id}>

            <h2>{job.title}</h2>

            <p>
              <strong>Company:</strong> {job.company}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Jobs;