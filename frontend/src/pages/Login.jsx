import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { Mail, Lock, LogIn, Compass } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(user);

      localStorage.setItem("fullName", response.data.fullName);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", response.data.role);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data || error.message);
    }
  };

 return (
  <div className="min-h-screen bg-[#0b1020] flex">

    {/* LEFT */}
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 p-16 flex-col justify-between text-white">

      <div>
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            🧭
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Career Compass
            </h1>

            <p className="text-purple-100">
              AI Powered Career Platform
            </p>
          </div>

        </div>

        <div className="mt-24">

          <h2 className="text-5xl font-bold leading-tight">
            Welcome Back 👋
          </h2>

          <p className="mt-8 text-xl text-purple-100 leading-9">
            Discover dream jobs, build ATS-friendly resumes,
            track applications and get AI-powered career insights
            all in one platform.
          </p>

        </div>
      </div>

      <div className="space-y-4 text-lg text-purple-100">

        <p>✔ Resume Builder</p>
        <p>✔ Smart Job Search</p>
        <p>✔ AI Career Insights</p>
        <p>✔ Application Tracker</p>

      </div>

    </div>

    {/* RIGHT */}

    <div className="flex-1 flex items-center justify-center p-10">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md p-10"
      >

        <div className="text-center">

          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-3xl">
            🧭
          </div>

          <h2 className="text-4xl font-bold text-white mt-6">
            Login
          </h2>

          <p className="text-slate-400 mt-2">
            Continue to Career Compass
          </p>

        </div>

        <div className="mt-10 space-y-6">

          <div className="relative">

            <Mail
              size={20}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 pl-12 text-white focus:border-violet-500 outline-none"
            />

          </div>

          <div className="relative">

            <Lock
              size={20}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 pl-12 text-white focus:border-violet-500 outline-none"
            />

          </div>

          <button
  type="submit"
  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
>
  <LogIn size={18} />
  Login
</button>

          <p className="text-center text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-violet-400 hover:text-violet-300 font-semibold"
            >
              Signup
            </Link>

          </p>

        </div>

      </form>

    </div>

  </div>
);
}

export default Login;