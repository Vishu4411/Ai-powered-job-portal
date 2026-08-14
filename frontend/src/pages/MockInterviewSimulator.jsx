import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getRecommendedJobs, startMockInterview, submitMockInterview } from "../services/aiService";
import { MessageSquareCode, Award, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Play, RotateCcw, Briefcase, HelpCircle, Loader2 } from "lucide-react";

export default function MockInterviewSimulator() {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get("jobId");

  const [step, setStep] = useState(1); // 1: Setup, 2: Questions Session, 3: Feedback Report
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId || "");

  const [session, setSession] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRecommendedJobs()
      .then((res) => {
        setRecommendedJobs(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load recommended jobs for interview simulator:", err);
      });
  }, []);

  const handleStartInterview = (jobIdToUse) => {
    setLoading(true);
    setError(null);
    const targetId = jobIdToUse !== undefined ? jobIdToUse : (selectedJobId || null);

    startMockInterview(targetId ? Number(targetId) : null)
      .then((res) => {
        setSession(res.data);
        setCurrentQIndex(0);
        setAnswers({});
        setStep(2);
      })
      .catch((err) => {
        console.error("Failed to start mock interview session:", err);
        setError("Unable to start mock interview session. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAnswerChange = (qId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: text,
    }));
  };

  const handleSubmitInterview = () => {
    if (!session || !session.questions) return;
    setSubmitting(true);
    setError(null);

    const submissionPayload = {
      jobId: session.jobId || null,
      answers: session.questions.map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        category: q.category,
        candidateAnswer: answers[q.id] || "",
      })),
    };

    submitMockInterview(submissionPayload)
      .then((res) => {
        setFeedback(res.data);
        setStep(3);
      })
      .catch((err) => {
        console.error("Failed to evaluate mock interview submission:", err);
        setError("Unable to evaluate interview submission. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const currentQuestion = session?.questions?.[currentQIndex];
  const totalQuestions = session?.questions?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Page Title Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <MessageSquareCode size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Mock Interview Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Practice targeted technical & behavioral interview questions with deterministic rubric evaluation.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SETUP & TARGET SELECTION */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Select Your Target Role
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose an active job posting or practice general software engineering interview questions.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Target Job Posting (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedJobId("")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedJobId === ""
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Briefcase size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>General Software Engineering</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Practice System Architecture, Core Java, Spring Boot, and STAR behavioral questions.
                </p>
              </button>

              {recommendedJobs.map((j) => (
                <button
                  key={j.jobId}
                  type="button"
                  onClick={() => setSelectedJobId(j.jobId.toString())}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedJobId === j.jobId.toString()
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-sm">
                    <span className="truncate">{j.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                      {j.overallMatchScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {j.company} • {j.location}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => handleStartInterview()}
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Session...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Start Practice Session
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INTERACTIVE QUESTIONS SESSION */}
      {step === 2 && session && currentQuestion && (
        <div className="space-y-6">
          {/* Stepper Progress Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
                Question {currentQIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Role: <strong className="text-slate-800 dark:text-slate-200">{session.jobTitle}</strong>
              </span>
            </div>

            <div className="flex gap-1">
              {session.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-7 h-2 rounded-full transition-all ${
                    idx === currentQIndex
                      ? "bg-indigo-600 w-9"
                      : answers[q.id] && answers[q.id].trim().length > 0
                      ? "bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Category: {currentQuestion.category}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.questionText}
            </h3>

            {currentQuestion.hint && (
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <HelpCircle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <strong>Tip: </strong> {currentQuestion.hint}
                </div>
              </div>
            )}

            {/* Answer Text Area */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Structured Answer:
              </label>
              <textarea
                rows={6}
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your response here... For technical questions, mention core principles and trade-offs. For behavioral questions, use the STAR framework (Situation, Task, Action, Result)."
                className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>
                  Words: {(answers[currentQuestion.id] || "").trim().split(/\s+/).filter(Boolean).length}
                </span>
                <span>
                  {(answers[currentQuestion.id] || "").trim().length > 100 ? "Good length" : "Aim for 30+ detailed words"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft size={14} /> Previous
              </button>

              {currentQIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  Next Question <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Evaluating Session...
                    </>
                  ) : (
                    <>
                      Submit & View Feedback <Award size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: COMPREHENSIVE FEEDBACK REPORT */}
      {step === 3 && feedback && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Mock Interview Feedback Report
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Deterministic rubric evaluation across Technical Accuracy, Completeness & Communication.
                </p>
              </div>

              <button
                onClick={() => handleStartInterview()}
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-indigo-100 transition-all self-start sm:self-auto"
              >
                <RotateCcw size={14} /> Practice Another Session
              </button>
            </div>

            {/* Score Ring & Key Takeaways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center justify-center p-2 text-center md:border-r border-slate-200 dark:border-slate-700/60">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-700"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={feedback.overallScore >= 75 ? "text-emerald-500" : feedback.overallScore >= 55 ? "text-indigo-600" : "text-amber-500"}
                      strokeDasharray={`${feedback.overallScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-2xl font-extrabold text-slate-900 dark:text-white">
                    {feedback.overallScore}%
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Overall Performance
                </span>
              </div>

              <div className="md:col-span-2 flex flex-col justify-center space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{feedback.technicalAccuracyScore}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Technical</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{feedback.completenessScore}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Completeness</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{feedback.communicationScore}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Communication</div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
                  <strong>Key Takeaway: </strong> {feedback.keyTakeaway}
                </div>
              </div>
            </div>

            {/* Question-by-Question Breakdown */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Detailed Question-by-Question Breakdown
              </h3>

              {feedback.questionFeedback?.map((qf) => (
                <div
                  key={qf.questionId}
                  className="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {qf.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                        Q{qf.questionId}: {qf.questionText}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      qf.score >= 75 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                      qf.score >= 50 ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" :
                      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      {qf.score}% Score
                    </span>
                  </div>

                  {/* Candidate Submitted Answer */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-500 dark:text-slate-400 block mb-1">Your Answer:</strong>
                    {qf.candidateAnswer ? (
                      <p className="italic">{qf.candidateAnswer}</p>
                    ) : (
                      <p className="text-slate-400 italic">No answer submitted for this question.</p>
                    )}
                  </div>

                  {/* Feedback Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Strengths */}
                    {qf.strengths && qf.strengths.length > 0 && (
                      <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                        <strong className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1 font-bold">
                          <CheckCircle2 size={13} className="text-emerald-600" /> Strengths:
                        </strong>
                        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                          {qf.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Concepts */}
                    {qf.missingConcepts && qf.missingConcepts.length > 0 && (
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                        <strong className="text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-1 font-bold">
                          <AlertTriangle size={13} className="text-amber-600" /> Improvement Tips:
                        </strong>
                        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                          {qf.missingConcepts.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Model Answer Guidance */}
                  {qf.modelAnswerAdvice && (
                    <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30 text-xs text-indigo-950 dark:text-indigo-200">
                      <strong className="flex items-center gap-1 mb-1 font-bold text-indigo-700 dark:text-indigo-400">
                        <Lightbulb size={13} /> Model Answer Guidance:
                      </strong>
                      <p>{qf.modelAnswerAdvice}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
