import { CheckCircle, Circle } from "lucide-react";

const items = [
  { title: "Resume Uploaded", done: true },
  { title: "Skills Added", done: true },
  { title: "Profile Photo", done: true },
  { title: "Portfolio", done: false },
  { title: "Projects", done: false },
];

function ProfileStrength() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white">
        Profile Strength
      </h2>

      <p className="text-slate-400 mb-6">
        Complete your profile to improve job matches.
      </p>

      <div className="flex justify-center mb-8">
        <div className="relative h-36 w-36 rounded-full border-[10px] border-violet-500 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              84%
            </h1>
            <p className="text-slate-400 text-sm">
              Excellent
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex justify-between items-center"
          >
            <span className="text-slate-300">
              {item.title}
            </span>

            {item.done ? (
              <CheckCircle className="text-green-400" />
            ) : (
              <Circle className="text-slate-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileStrength;