import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/register", formData);
      login(data);

      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your phone number"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#2d3748",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.4rem",
    fontSize: "14px",
    color: "#4a5568",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.8rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#48bb78",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "1rem",
    textAlign: "center",
  },
  link: {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "14px",
  },
};

export default Register;