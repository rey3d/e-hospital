import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/appointments/my");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await API.put(`/appointments/${id}/cancel`);
      setMessage("Appointment cancelled.");
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Appointments</h2>
        {message && <p style={styles.success}>{message}</p>}

        {appointments.length === 0 ? (
          <p>No appointments yet. <a href="/patient/book">Book one now!</a></p>
        ) : (
          appointments.map((apt) => (
            <div key={apt._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.docName}>👨‍⚕️ Dr. {apt.doctorId?.name}</p>
                  <p style={styles.meta}>📅 {apt.date} at {apt.time}</p>
                  {apt.symptoms && <p style={styles.meta}>🤒 Symptoms: {apt.symptoms}</p>}
                  {apt.notes && <p style={styles.meta}>📝 Doctor Notes: {apt.notes}</p>}
                  {apt.prescription && <p style={styles.meta}>💊 Prescription: {apt.prescription}</p>}
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

              {apt.status === "pending" && (
                <button
                  onClick={() => handleCancel(apt._id)}
                  style={styles.cancelBtn}
                >
                  Cancel Appointment
                </button>
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
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  docName: { fontWeight: "bold", fontSize: "16px", margin: "0 0 4px" },
  meta: { fontSize: "13px", color: "#718096", margin: "2px 0" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", whiteSpace: "nowrap" },
  cancelBtn: { marginTop: "0.8rem", backgroundColor: "#fc8181", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" },
  success: { color: "green", fontSize: "14px", marginBottom: "1rem" },
};

export default PatientDashboard;