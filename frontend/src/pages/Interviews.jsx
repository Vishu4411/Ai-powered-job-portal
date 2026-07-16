import { Calendar, Video, MapPin, Clock } from "lucide-react";
const interviews = [
  {
    role: "Senior Product Designer",
    company: "Linear",
    when: "Thu, Nov 14 · 2:00 PM",
    type: "Video",
    round: "Round 2 · Design Critique",
    location: "Google Meet",
  },
  {
    role: "UX Engineer",
    company: "Vercel",
    when: "Mon, Nov 18 · 10:30 AM",
    type: "Video",
    round: "Round 1 · Screening",
    location: "Zoom",
  },
  {
    role: "Design Lead",
    company: "Figma",
    when: "Wed, Nov 20 · 4:00 PM",
    type: "Onsite",
    round: "Final · Panel",
    location: "New York, NY",
  },
];
function Interviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Interviews
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Prepare, practice and show up your best.
        </p>
      </div>
      <div className="space-y-3">
        {interviews.map((i) => (
          <div
            key={i.role + i.when}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {i.role}
                  </h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {i.company} · {i.round}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {i.when}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {i.type === "Video" ? (
                        <Video className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                      {i.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 text-sm font-medium transition">
                  Prep
                </button>
                <button className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-medium transition">
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Interviews;