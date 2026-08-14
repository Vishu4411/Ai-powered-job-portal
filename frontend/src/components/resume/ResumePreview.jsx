import { Printer } from "lucide-react";

function ResumePreview({ resumeData }) {
  const data = resumeData || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl sticky top-5 space-y-6 print:shadow-none print:p-0">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{data.fullName || "Your Full Name"}</h2>
          <p className="text-indigo-600 font-semibold text-sm">{data.headline || "Professional Title"}</p>
        </div>
        <button
          onClick={handlePrint}
          className="print:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
        >
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 border-b pb-4 border-slate-200">
        {data.email && <span>📧 {data.email}</span>}
        {data.phone && <span>📞 {data.phone}</span>}
        {data.location && <span>📍 {data.location}</span>}
      </div>

      {data.bio && (
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Summary</h3>
          <p className="text-xs text-slate-700 leading-relaxed">{data.bio}</p>
        </div>
      )}

      {data.skills && (
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Technical Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.split(",").map((s) => (
              <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-medium">
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.educationList && data.educationList.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Education</h3>
          <div className="space-y-2">
            {data.educationList.map((edu) => (
              <div key={edu.id} className="text-xs">
                <p className="font-bold text-slate-900">{edu.institution}</p>
                <p className="text-indigo-600 font-medium">{edu.degree} — {edu.fieldOfStudy}</p>
                <p className="text-[11px] text-slate-500">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.experienceList && data.experienceList.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Experience</h3>
          <div className="space-y-2">
            {data.experienceList.map((exp) => (
              <div key={exp.id} className="text-xs">
                <p className="font-bold text-slate-900">{exp.position} at {exp.company}</p>
                <p className="text-[11px] text-slate-500">{exp.startDate} – {exp.endDate}</p>
                <p className="text-slate-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumePreview;