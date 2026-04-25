import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("doctors");
  const [loading, setLoading] = useState(true);
  const [doctorForm, setDoctorForm] = useState({
    name: "", email: "", password: "", phone: "",
    specialization: "", experience: "", fees: "", bio: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [d, u, a] = await Promise.all([
        API.get("/admin/doctors"),
        API.get("/admin/users"),
        API.get("/admin/appointments"),
      ]);
      setDoctors(d.data);
      setUsers(u.data);
      setAppointments(a.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      await API.post("/admin/doctors", doctorForm);
      setFormSuccess("Doctor added successfully!");
      setDoctorForm({ name: "", email: "", password: "", phone: "", specialization: "", experience: "", fees: "", bio: "" });
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add doctor");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const tabs = ["doctors", "users", "appointments", "addDoctor"];

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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Users", value: users.length, color: "bg-blue-50 text-blue-700" },
            { label: "Total Doctors", value: doctors.length, color: "bg-green-50 text-green-700" },
            { label: "Total Appointments", value: appointments.length, color: "bg-purple-50 text-purple-700" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-5 text-center`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab === "addDoctor" ? "Add Doctor" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["Name", "Specialization", "Experience", "Fees", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr key={doc._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium">{doc.userId?.name}</td>
                    <td className="px-4 py-3">{doc.specialization}</td>
                    <td className="px-4 py-3">{doc.experience} yrs</td>
                    <td className="px-4 py-3">₹{doc.fees}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${doc.isApproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
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
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["Name", "Email", "Role", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "admin" ? "bg-blue-100 text-blue-700" :
                        user.role === "doctor" ? "bg-green-100 text-green-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
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
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["Patient", "Doctor", "Date", "Time", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, i) => (
                  <tr key={apt._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3">{apt.patientId?.name}</td>
                    <td className="px-4 py-3">{apt.doctorId?.name}</td>
                    <td className="px-4 py-3">{apt.date}</td>
                    <td className="px-4 py-3">{apt.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(apt.status)}`}>
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
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Doctor</h3>
            {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
            {formSuccess && <p className="text-green-500 text-sm mb-3">{formSuccess}</p>}
            <form onSubmit={handleAddDoctor} className="space-y-4">
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
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={doctorForm[field.name]}
                    onChange={(e) => setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value })}
                    required={field.name !== "bio"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Add Doctor
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;