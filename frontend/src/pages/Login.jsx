import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

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
  console.log(error);

  console.log(error.response);

  console.log(error.response?.data);

  alert(error.response?.data || error.message);
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
        <h2>Login</h2>

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

        <button type="submit">
          Login
        </button>

        <Link to="/signup">
          Don't have an account? Signup
        </Link>
      </form>
    </div>
  );
}

export default Login;