import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  if (!token || !email) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;