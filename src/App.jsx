import { Link, Route, Routes, useLocation } from "react-router-dom";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DeanDashboard from "./pages/dean/DeanDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";
import TransportManagerDashboard from "./pages/manager/TransportManagerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProfilePage from "./pages/dean/Profile";
import PendingRequests from "./pages/dean/PendingRequests";
import RequestHistory from "./pages/dean/RequestHistory";
import MyRequests from "./pages/staff/MyRequests";
import TripHistory from "./pages/staff/TripHistory";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();
  const showGlobalHomePill =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {showGlobalHomePill && (
        <Link
          to="/"
          aria-label="Go to welcome page"
          className="fixed left-6 top-6 z-50 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-2 text-teal-700 shadow-sm backdrop-blur-sm hover:bg-white"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-sm">
            🚚
          </span>
          <span className="text-sm font-bold">FleetFlow</span>
        </Link>
      )}

      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard/transport_manager"
          element={
            <ProtectedRoute allowedRoles={["TRANSPORT_MANAGER"]}>
              <TransportManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/operations_staff"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/department_dean"
          element={
            <ProtectedRoute allowedRoles={["DEAN"]}>
              <DeanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/fleet_driver"
          element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dean/pending"
          element={
            <ProtectedRoute allowedRoles={["DEAN"]}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dean/history"
          element={
            <ProtectedRoute allowedRoles={["DEAN"]}>
              <RequestHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dean/profile"
          element={
            <ProtectedRoute allowedRoles={["DEAN"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/myRequests"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/TripHistory"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <TripHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
