import { Briefcase, MapPin, DollarSign } from "lucide-react";

const jobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Hyderabad",
    salary: "₹18 LPA",
    match: "98%",
  },
  {
    title: "AI Engineer",
    company: "Microsoft",
    location: "Bangalore",
    salary: "₹24 LPA",
    match: "95%",
  },
  {
    title: "Software Engineer",
    company: "Amazon",
    location: "Chennai",
    salary: "₹20 LPA",
    match: "93%",
  },
];

function RecommendedJobs() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        Recommended Jobs
      </h2>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">
                  {job.title}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  {job.company}
                </p>
              </div>

              <span className="text-green-400 font-bold">
                {job.match}
              </span>
            </div>

            <div className="flex gap-5 mt-3 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <MapPin size={15} />
                {job.location}
              </span>

              <span className="flex items-center gap-1">
                <DollarSign size={15} />
                {job.salary}
              </span>

              <span className="flex items-center gap-1">
                <Briefcase size={15} />
                Full Time
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedJobs;