import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [jobs, setJobs] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const [search, setSearch] = useState("");

  const loadJobs = () => {
    axios.get("http://localhost:8080/jobs")
      .then((response) => {
        setJobs(response.data);
      });
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const addJob = () => {
    axios.post("http://localhost:8080/jobs", {
      title,
      company,
      location
    })
    .then(() => {
      loadJobs();

      setTitle("");
      setCompany("");
      setLocation("");
    });
  };

  const deleteJob = (id) => {
    axios.delete(`http://localhost:8080/jobs/${id}`)
      .then(() => {
        loadJobs();
      });
  };

  const updateJob = (id) => {
    axios.put(`http://localhost:8080/jobs/${id}`, {
      title: "Senior Java Developer",
      company: "Infosys",
      location: "Pune"
    })
    .then(() => {
      loadJobs();
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Job Portal</h1>

      <h2>Add Job</h2>

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <button onClick={addJob}>
        Add Job
      </button>

      <hr />

      <h2>Search Jobs</h2>

      <input
        type="text"
        placeholder="Search Jobs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <hr />

      {jobs
        .filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((job) => (
          <div key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>

            <button onClick={() => updateJob(job.id)}>
              Update
            </button>

            {" "}

            <button onClick={() => deleteJob(job.id)}>
              Delete
            </button>

            <hr />
          </div>
        ))}
    </div>
  );
}

export default App;