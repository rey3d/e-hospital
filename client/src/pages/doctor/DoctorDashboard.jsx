import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: "", notes: "", prescription: "" });
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => { fetchAppointments(); }, [statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      let query = "";
      if (statusFilter) query += `status=${statusFilter}&`;
      if (dateFilter) query += `date=${dateFilter}`;
      const { data } = await API.get(`/doctor/appointments?${query}`);
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

  const statusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h2>

        {message && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200">
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => { setStatusFilter(""); setDateFilter(""); }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition"
          >
            Clear
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">👤 {apt.patientId?.name}</p>
                    <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                    {apt.symptoms && <p className="text-sm text-gray-500 mt-1">🤒 {apt.symptoms}</p>}
                    {apt.notes && <p className="text-sm text-gray-500 mt-1">📝 {apt.notes}</p>}
                    {apt.prescription && <p className="text-sm text-gray-500 mt-1">💊 {apt.prescription}</p>}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelected(apt._id);
                    setUpdateForm({ status: apt.status, notes: apt.notes, prescription: apt.prescription });
                    setMessage("");
                  }}
                  className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
                >
                  Update
                </button>

                {selected === apt._id && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="text"
                      placeholder="Add prescription..."
                      value={updateForm.prescription}
                      onChange={(e) => setUpdateForm({ ...updateForm, prescription: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(apt._id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setSelected(null)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
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

export default DoctorDashboard;