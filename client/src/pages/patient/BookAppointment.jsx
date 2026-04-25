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
  const [specFilter, setSpecFilter] = useState("");

  useEffect(() => { fetchDoctors(); }, [specFilter]);

  const fetchDoctors = async () => {
    try {
      let query = specFilter ? `specialization=${specFilter}` : "";
      const { data } = await API.get(`/doctor/all?${query}`);
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (doctorUserId) => {
    setMessage("");
    setError("");
    if (!form.date || !form.time) {
      setError("Please select a date and time");
      return;
    }
    try {
      await API.post("/appointments", {
        doctorId: doctorUserId,
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

  const specializations = [...new Set(doctors.map((d) => d.specialization))];

  if (loading) return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

        {message && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Specializations</option>
            {specializations.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => setSpecFilter("")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition"
          >
            Clear
          </button>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">👨‍⚕️</p>
            <p>No doctors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div key={doc._id} className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-lg font-bold text-gray-800">Dr. {doc.userId?.name}</h3>
                <p className="text-blue-500 font-semibold text-sm mt-1">🩺 {doc.specialization}</p>
                <p className="text-gray-500 text-sm mt-1">⏳ {doc.experience} years experience</p>
                <p className="text-gray-500 text-sm mt-1">💰 ₹{doc.fees} per visit</p>
                {doc.bio && <p className="text-gray-500 text-sm mt-1">📋 {doc.bio}</p>}
                <p className="text-gray-500 text-sm mt-1">📅 {doc.availableDays?.join(", ")}</p>

                <button
                  onClick={() => { setSelected(doc._id); setMessage(""); setError(""); }}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg transition"
                >
                  Book Now
                </button>

                {selected === doc._id && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Describe symptoms..."
                      value={form.symptoms}
                      onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => handleBook(doc.userId?._id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;