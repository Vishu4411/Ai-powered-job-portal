import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
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
      const response = await signup(user);

      alert(response.data);

      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Signup Failed");
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
        <h2>Signup</h2>

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

        <button type="submit">Signup</button>

        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
}

export default Signup;