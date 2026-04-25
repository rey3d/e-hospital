import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between flex-wrap gap-4 shadow-md">
      {/* Brand */}
      <div className="text-xl font-bold tracking-wide">🏥 E-Hospital</div>

      {/* Links */}
      <div className="flex gap-6 text-sm font-medium">
        {user?.role === "patient" && (
          <>
            <Link to="/patient/dashboard" className="hover:text-blue-200 transition">My Appointments</Link>
            <Link to="/patient/book" className="hover:text-blue-200 transition">Book Appointment</Link>
            <Link to="/patient/history" className="hover:text-blue-200 transition">Medical History</Link>
          </>
        )}
        {user?.role === "doctor" && (
          <Link to="/doctor/dashboard" className="hover:text-blue-200 transition">My Appointments</Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-sm">👤 {user?.name}</span>
        <span className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full font-bold capitalize">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-700 text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-blue-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;