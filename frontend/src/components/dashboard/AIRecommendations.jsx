import { Sparkles } from "lucide-react";

const recommendations = [
  {
    title: "Update your Resume",
    description: "Adding recent projects could increase your job match by 18%.",
  },
  {
    title: "Practice Interviews",
    description: "Complete one mock interview to improve your confidence score.",
  },
  {
    title: "Apply Today",
    description: "12 new AI Engineer jobs match your profile.",
  },
];

function AIRecommendations() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-violet-400" />
        <h2 className="text-xl font-bold text-white">
          AI Recommendations
        </h2>
      </div>

      <div className="space-y-4">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-800 p-4 hover:bg-slate-700 transition"
          >
            <h3 className="text-white font-semibold">
              {item.title}
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIRecommendations;