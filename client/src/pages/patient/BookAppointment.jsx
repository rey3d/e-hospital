import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", symptoms: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get("/doctor/all");
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBook = async (doctorId) => {
    setMessage("");
    setError("");
    try {
      await API.post("/appointments", {
        doctorId,
        date: form.date,
        time: form.time,
        symptoms: form.symptoms,
      });
      setMessage("Appointment booked successfully!");
      setSelected(null);
      setForm({ date: "", time: "", symptoms: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Book an Appointment</h2>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          {doctors.map((doc) => (
            <div key={doc._id} style={styles.card}>
              <h3 style={styles.docName}>Dr. {doc.userId?.name}</h3>
              <p style={styles.spec}>🩺 {doc.specialization}</p>
              <p style={styles.meta}>⏳ {doc.experience} years experience</p>
              <p style={styles.meta}>💰 ₹{doc.fees} per visit</p>
              {doc.bio && <p style={styles.meta}>📋 {doc.bio}</p>}
              <p style={styles.meta}>
                📅 {doc.availableDays?.join(", ")}
              </p>

              <button
                onClick={() => {
                  setSelected(doc._id);
                  setMessage("");
                  setError("");
                }}
                style={styles.bookBtn}
              >
                Book Now
              </button>

              {selected === doc._id && (
                <div style={styles.bookForm}>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Describe your symptoms..."
                    value={form.symptoms}
                    onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                    style={styles.input}
                  />
                  <button onClick={() => handleBook(doc.userId?._id)} style={styles.confirmBtn}>Confirm Booking</button>
                  <button onClick={() => setSelected(null)} style={styles.cancelBtn}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", maxWidth: "1100px", margin: "0 auto" },
  heading: { fontSize: "24px", marginBottom: "1.5rem", color: "#2d3748" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" },
  card: { backgroundColor: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" },
  docName: { fontSize: "18px", margin: "0 0 0.3rem", color: "#2d3748" },
  spec: { color: "#4299e1", fontWeight: "bold", fontSize: "14px", margin: "0 0 0.5rem" },
  meta: { fontSize: "13px", color: "#718096", margin: "3px 0" },
  bookBtn: { marginTop: "1rem", backgroundColor: "#4299e1", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", width: "100%" },
  bookForm: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
  input: { padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e0", fontSize: "14px" },
  confirmBtn: { backgroundColor: "#48bb78", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  cancelBtn: { backgroundColor: "#e2e8f0", color: "#2d3748", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" },
  success: { color: "green", fontSize: "14px", marginBottom: "1rem" },
  error: { color: "red", fontSize: "14px", marginBottom: "1rem" },
};

export default BookAppointment;