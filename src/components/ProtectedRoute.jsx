import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../api/client";
import { getCurrentSessionRole, getDashboardRouteForRole } from "../lib/session";

export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const currentRole = getCurrentSessionRole();
  if (!currentRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.includes(currentRole)) {
    return children;
  }

  return <Navigate to={getDashboardRouteForRole(currentRole)} replace />;
}
