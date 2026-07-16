function ResumePreview() {
  return (
    <div className="bg-white text-black rounded-2xl p-6 shadow-lg sticky top-5">
      <h2 className="text-2xl font-bold">
        Resume Preview
      </h2>

      <hr className="my-4"/>

      <p className="text-gray-500">
        Your resume preview will appear here.
      </p>

      <div className="mt-8 space-y-4">

        <button className="w-full bg-violet-600 text-white py-3 rounded-xl">
          🤖 Analyze with AI
        </button>

        <button className="w-full bg-green-600 text-white py-3 rounded-xl">
          📄 Download PDF
        </button>

      </div>
    </div>
  );
}

export default ResumePreview;