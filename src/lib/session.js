import { jwtDecode } from "jwt-decode";
import { clearAuthToken, getAuthRole, getAuthToken } from "../api/client";

const roleToRoute = {
  ADMIN: "/dashboard/admin",
  DEAN: "/dashboard/department_dean",
  STAFF: "/dashboard/operations_staff",
  TRANSPORT_MANAGER: "/dashboard/transport_manager",
  DRIVER: "/dashboard/fleet_driver",
};

function normalizeRoleFromToken(decodedToken) {
  if (!decodedToken || typeof decodedToken !== "object") return null;

  const directRole = decodedToken.role || decodedToken.authority;
  if (typeof directRole === "string" && directRole.trim()) {
    return directRole.trim();
  }

  const roles = decodedToken.roles || decodedToken.authorities;
  if (Array.isArray(roles) && roles.length > 0) {
    const firstRole = roles[0];
    if (typeof firstRole === "string") return firstRole;
    if (firstRole && typeof firstRole.authority === "string") {
      return firstRole.authority;
    }
  }

  return null;
}

export function getCurrentTokenRole() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const rawRole = normalizeRoleFromToken(decoded);
    if (!rawRole) return null;
    return rawRole.startsWith("ROLE_") ? rawRole.replace("ROLE_", "") : rawRole;
  } catch {
    return null;
  }
}

export function getCurrentSessionRole() {
  const storedRole = getAuthRole();
  if (storedRole && storedRole.trim()) return storedRole.trim();
  return getCurrentTokenRole();
}

export function getDashboardRouteForRole(role) {
  return roleToRoute[role] || "/";
}

export function clearSession() {
  clearAuthToken();
}
