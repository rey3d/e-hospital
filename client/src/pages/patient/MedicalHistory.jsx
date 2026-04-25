import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const MedicalHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => { fetchHistory(); }, [statusFilter, dateFilter]);

  const fetchHistory = async () => {
    try {
      let query = "";
      if (statusFilter) query += `status=${statusFilter}&`;
      if (dateFilter) query += `date=${dateFilter}`;
      const { data } = await API.get(`/appointments/my?${query}`);
      const records = data.filter((apt) => apt.status === "completed" || apt.notes || apt.prescription);
      setAppointments(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "completed") return "bg-blue-100 text-blue-700";
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical History</h2>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="confirmed">Confirmed</option>
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
            <p className="text-4xl mb-3">🏥</p>
            <p>No medical records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-800">👨‍⚕️ Dr. {apt.doctorId?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">📅 {apt.date} at {apt.time}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {apt.symptoms && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Symptoms</p>
                      <p className="text-sm text-gray-700">🤒 {apt.symptoms}</p>
                    </div>
                  )}
                  {apt.notes && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Doctor Notes</p>
                      <p className="text-sm text-gray-700">📝 {apt.notes}</p>
                    </div>
                  )}
                  {apt.prescription && (
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">Prescription</p>
                      <p className="text-sm text-gray-700">💊 {apt.prescription}</p>
                    </div>
                  )}
                  {!apt.symptoms && !apt.notes && !apt.prescription && (
                    <p className="text-sm text-gray-400">No records added yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;