import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("doctors");
  const [loading, setLoading] = useState(true);

  // Form state for adding doctor
  const [doctorForm, setDoctorForm] = useState({
    name: "", email: "", password: "",
    phone: "", specialization: "", experience: "",
    fees: "", bio: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, usersRes, appointmentsRes] = await Promise.all([
        API.get("/admin/doctors"),
        API.get("/admin/users"),
        API.get("/admin/appointments"),
      ]);
      setDoctors(doctorsRes.data);
      setUsers(usersRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorFormChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await API.post("/admin/doctors", doctorForm);
      setFormSuccess("Doctor added successfully!");
      setDoctorForm({
        name: "", email: "", password: "",
        phone: "", specialization: "", experience: "",
        fees: "", bio: "",
      });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add doctor");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Admin Dashboard</h2>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div style={styles.statCard}>
            <h3>{doctors.length}</h3>
            <p>Total Doctors</p>
          </div>
          <div style={styles.statCard}>
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {["doctors", "users", "appointments", "addDoctor"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabBtn,
                backgroundColor: activeTab === tab ? "#2b6cb0" : "#e2e8f0",
                color: activeTab === tab ? "#fff" : "#2d3748",
              }}
            >
              {tab === "addDoctor" ? "Add Doctor" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Specialization</th>
                  <th style={styles.th}>Experience</th>
                  <th style={styles.th}>Fees</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td style={styles.td}>{doc.userId?.name}</td>
                    <td style={styles.td}>{doc.specialization}</td>
                    <td style={styles.td}>{doc.experience} yrs</td>
                    <td style={styles.td}>₹{doc.fees}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: doc.isApproved ? "#c6f6d5" : "#fed7d7",
                        color: doc.isApproved ? "#276749" : "#9b2c2c",
                      }}>
                        {doc.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor:
                          user.role === "admin" ? "#bee3f8" :
                          user.role === "doctor" ? "#c6f6d5" : "#fefcbf",
                        color:
                          user.role === "admin" ? "#2b6cb0" :
                          user.role === "doctor" ? "#276749" : "#975a16",
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          style={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Patient</th>
                  <th style={styles.th}>Doctor</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td style={styles.td}>{apt.patientId?.name}</td>
                    <td style={styles.td}>{apt.doctorId?.name}</td>
                    <td style={styles.td}>{apt.date}</td>
                    <td style={styles.td}>{apt.time}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor:
                          apt.status === "confirmed" ? "#c6f6d5" :
                          apt.status === "cancelled" ? "#fed7d7" :
                          apt.status === "completed" ? "#bee3f8" : "#fefcbf",
                        color:
                          apt.status === "confirmed" ? "#276749" :
                          apt.status === "cancelled" ? "#9b2c2c" :
                          apt.status === "completed" ? "#2b6cb0" : "#975a16",
                      }}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Doctor Tab */}
        {activeTab === "addDoctor" && (
          <div style={styles.formCard}>
            <h3 style={{ marginBottom: "1rem" }}>Add New Doctor</h3>
            {formError && <p style={styles.error}>{formError}</p>}
            {formSuccess && <p style={styles.success}>{formSuccess}</p>}
            <form onSubmit={handleAddDoctor}>
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Specialization", name: "specialization", type: "text" },
                { label: "Experience (years)", name: "experience", type: "number" },
                { label: "Fees (₹)", name: "fees", type: "number" },
                { label: "Bio", name: "bio", type: "text" },
              ].map((field) => (
                <div key={field.name} style={styles.formGroup}>
                  <label style={styles.label}>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={doctorForm[field.name]}
                    onChange={handleDoctorFormChange}
                    style={styles.input}
                    required={field.name !== "bio"}
                  />
                </div>
              ))}
              <button type="submit" style={styles.submitBtn}>Add Doctor</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "1100px", margin: "0 auto" },
  heading: { fontSize: "24px", marginBottom: "1.5rem", color: "#2d3748" },
  statsRow: { display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" },
  statCard: {
    flex: 1, minWidth: "140px", backgroundColor: "#ebf8ff",
    borderRadius: "10px", padding: "1rem", textAlign: "center",
  },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  tabBtn: { padding: "8px 18px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { backgroundColor: "#2b6cb0", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: "14px" },
  td: { padding: "10px 14px", borderBottom: "1px solid #e2e8f0", fontSize: "14px" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" },
  deleteBtn: { backgroundColor: "#fc8181", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer" },
  formCard: { backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", maxWidth: "500px" },
  formGroup: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "13px", marginBottom: "4px", color: "#4a5568" },
  input: { width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "14px", boxSizing: "border-box" },
  submitBtn: { backgroundColor: "#2b6cb0", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "0.5rem" },
  error: { color: "red", fontSize: "13px", marginBottom: "1rem" },
  success: { color: "green", fontSize: "13px", marginBottom: "1rem" },
};

export default AdminDashboard;