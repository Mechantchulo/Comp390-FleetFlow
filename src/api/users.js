import { apiRequest } from "./client";

export function updateUserRole(userId, role) {
  return apiRequest(`/api/users/${userId}/role`, {
    method: "PATCH",
    auth: true,
    body: { role },
  });
}

export function listUsersByRole(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  return apiRequest(`/api/users${query}`, {
    method: "GET",
    auth: true,
  });
}

export function getUserById(userId) {
  return apiRequest(`/api/users/${userId}`, {
    method: "GET",
    auth: true,
  });
}

export async function listDrivers() {
  const byRole = (user) => {
    const rawRole = String(user?.role || "").toUpperCase();
    return rawRole === "DRIVER" || rawRole === "ROLE_DRIVER";
  };

  const endpoints = [
    () =>
      apiRequest("/api/users/drivers", {
        method: "GET",
        auth: true,
      }),
    () => listUsersByRole("DRIVER"),
    () =>
      apiRequest("/api/users/all", {
        method: "GET",
        auth: true,
      }),
  ];

  let lastError = null;

  for (const load of endpoints) {
    try {
      const users = await load();
      if (!Array.isArray(users)) continue;
      const drivers = users.filter(byRole);
      if (drivers.length > 0) return drivers;
      if (load === endpoints[0] || load === endpoints[1]) return users;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return [];
}
