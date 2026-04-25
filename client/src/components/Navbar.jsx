import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🏥 E-Hospital</div>

      <div style={styles.links}>
        {user?.role === "patient" && (
          <>
            <Link to="/patient/dashboard" style={styles.link}>My Appointments</Link>
            <Link to="/patient/book" style={styles.link}>Book Appointment</Link>
          </>
        )}

        {user?.role === "doctor" && (
          <Link to="/doctor/dashboard" style={styles.link}>My Appointments</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
        )}
      </div>

      <div style={styles.userInfo}>
        <span style={styles.userName}>👤 {user?.name}</span>
        <span style={styles.role}>{user?.role}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 2rem",
    backgroundColor: "#2b6cb0",
    color: "#fff",
    flexWrap: "wrap",
    gap: "1rem",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userName: {
    fontSize: "14px",
  },
  role: {
    fontSize: "12px",
    backgroundColor: "#bee3f8",
    color: "#2b6cb0",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  logoutBtn: {
    backgroundColor: "#fff",
    color: "#2b6cb0",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "13px",
  },
};

export default Navbar;