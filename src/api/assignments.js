import { apiRequest } from "./client";

export function createAssignment(payload) {
  return apiRequest("/api/assignments", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function listAssignments() {
  return apiRequest("/api/assignments", {
    method: "GET",
    auth: true,
  });
}

export function getAssignmentById(id) {
  return apiRequest(`/api/assignments/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function updateAssignmentStatus(id, status) {
  return apiRequest(`/api/assignments/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: { status },
  });
}
