import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { getCareerAdvice } from "../../services/aiService";

function AIRecommendations() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = () => {
    setLoading(true);
    getCareerAdvice()
      .then((res) => {
        if (res.data && res.data.advice) {
          setAdvice(res.data.advice);
        }
      })
      .catch((err) => {
        console.error("Error fetching AI career advice:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" />
          <h2 className="text-xl font-bold text-white">AI Career Intelligence</h2>
        </div>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-white p-1 transition"
          title="Refresh AI Advice"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-4">Generating personalized career guidance...</div>
      ) : (
        <div className="rounded-xl bg-slate-800/80 p-5 text-slate-300 text-sm leading-relaxed whitespace-pre-line border border-slate-700/50">
          {advice || "Keep your profile skills and experience updated to receive personalized AI recommendations."}
        </div>
      )}
    </div>
  );
}

export default AIRecommendations;