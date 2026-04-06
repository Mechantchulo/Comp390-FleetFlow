import { apiRequest } from "./client";

export function updateUserRole(userId, role) {
  return apiRequest(`/api/users/${userId}/role`, {
    method: "PATCH",
    auth: true,
    body: { role },
  });
}
