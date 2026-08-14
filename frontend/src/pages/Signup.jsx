import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authService";
import { useToast } from "../context/ToastContext";

function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ROLE_USER",
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
      const response = await signup(user);
      showToast(response.data || "Account registered successfully! Please log in.", "success");
      navigate("/login");
    } catch (error) {
      console.log(error);
      showToast(error.response?.data || "Account creation failed. Email may already be registered.", "error");
    }
  };


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "80px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2>Create Account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={user.role}
          onChange={handleChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="ROLE_USER">Job Seeker (Candidate)</option>
          <option value="ROLE_RECRUITER">Employer / Recruiter</option>
        </select>

        <button type="submit">Signup</button>

        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
}

export default Signup;