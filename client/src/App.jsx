import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/login";
import Register from "./pages/Register";

// Temporary dashboard placeholders
const AdminDashboard = () => <h2>Admin Dashboard — Coming Soon</h2>;
const DoctorDashboard = () => <h2>Doctor Dashboard — Coming Soon</h2>;
const PatientDashboard = () => <h2>Patient Dashboard — Coming Soon</h2>;

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <PrivateRoute roles={["doctor"]}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute roles={["patient"]}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>


        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;