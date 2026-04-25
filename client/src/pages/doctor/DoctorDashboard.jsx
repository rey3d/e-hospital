import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: "", notes: "", prescription: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/doctor/appointments");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/doctor/appointments/${id}`, updateForm);
      setMessage("Appointment updated successfully!");
      setSelected(null);
      fetchAppointments();
    } catch (err) {
      setMessage("Update failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Doctor Dashboard</h2>
        {message && <p style={styles.success}>{message}</p>}

        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          appointments.map((apt) => (
            <div key={apt._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.patientName}>👤 {apt.patientId?.name}</p>
                  <p style={styles.meta}>{apt.date} at {apt.time}</p>
                  {apt.symptoms && <p style={styles.meta}>Symptoms: {apt.symptoms}</p>}
                </div>
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
              </div>

              {apt.notes && <p style={styles.meta}>📝 Notes: {apt.notes}</p>}
              {apt.prescription && <p style={styles.meta}>💊 Prescription: {apt.prescription}</p>}

              <button
                onClick={() => {
                  setSelected(apt._id);
                  setUpdateForm({ status: apt.status, notes: apt.notes, prescription: apt.prescription });
                  setMessage("");
                }}
                style={styles.updateBtn}
              >
                Update
              </button>

              {selected === apt._id && (
                <div style={styles.updateForm}>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    style={styles.input}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Add notes..."
                    value={updateForm.notes}
                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Add prescription..."
                    value={updateForm.prescription}
                    onChange={(e) => setUpdateForm({ ...updateForm, prescription: e.target.value })}
                    style={styles.input}
                  />
                  <button onClick={() => handleUpdate(apt._id)} style={styles.saveBtn}>Save</button>
                  <button onClick={() => setSelected(null)} style={styles.cancelBtn}>Cancel</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "800px", margin: "0 auto" },
  heading: { fontSize: "24px", marginBottom: "1.5rem", color: "#2d3748" },
  card: { backgroundColor: "#fff", borderRadius: "10px", padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" },
  patientName: { fontWeight: "bold", fontSize: "16px", margin: 0 },
  meta: { fontSize: "13px", color: "#718096", margin: "2px 0" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap" },
  updateBtn: { marginTop: "0.8rem", backgroundColor: "#4299e1", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
  updateForm: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  input: { padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "14px" },
  saveBtn: { backgroundColor: "#48bb78", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  cancelBtn: { backgroundColor: "#e2e8f0", color: "#2d3748", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  success: { color: "green", fontSize: "14px", marginBottom: "1rem" },
};

export default DoctorDashboard;