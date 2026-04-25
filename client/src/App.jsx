import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Doctor routes */}
          <Route path="/doctor/dashboard" element={
            <PrivateRoute roles={["doctor"]}>
              <DoctorDashboard />
            </PrivateRoute>
          } />

          {/* Patient routes */}
          <Route path="/patient/dashboard" element={
            <PrivateRoute roles={["patient"]}>
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/book" element={
            <PrivateRoute roles={["patient"]}>
              <BookAppointment />
            </PrivateRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;