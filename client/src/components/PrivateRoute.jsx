//Protects frontend routes based on user authentication and role
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();

  console.log("PrivateRoute user:", user);
  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in but wrong role → go to login page
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  // All good → show the page
  return children;
};

export default PrivateRoute;