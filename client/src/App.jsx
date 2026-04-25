import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MedicalHistory from "./pages/patient/MedicalHistory";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/doctor/dashboard" element={
            <PrivateRoute roles={["doctor"]}><DoctorDashboard /></PrivateRoute>
          } />
          <Route path="/patient/dashboard" element={
            <PrivateRoute roles={["patient"]}><PatientDashboard /></PrivateRoute>
          } />
          <Route path="/patient/book" element={
            <PrivateRoute roles={["patient"]}><BookAppointment /></PrivateRoute>
          } />
          <Route path="/patient/history" element={
            <PrivateRoute roles={["patient"]}><MedicalHistory /></PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;