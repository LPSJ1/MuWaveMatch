import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  if (!profile || !profile.is_admin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
