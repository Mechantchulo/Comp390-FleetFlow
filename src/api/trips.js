import { apiRequest } from "./client";

export function createTripRequest(payload) {
  return apiRequest("/api/trips", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function listTripRequests() {
  return apiRequest("/api/trips", {
    method: "GET",
    auth: true,
  });
}

export function getTripRequestById(id) {
  return apiRequest(`/api/trips/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function approveTripRequest(id) {
  return apiRequest(`/api/trips/${id}/approve`, {
    method: "PATCH",
    auth: true,
  });
}

export function rejectTripRequest(id) {
  return apiRequest(`/api/trips/${id}/reject`, {
    method: "PATCH",
    auth: true,
  });
}

export function getTripLogsByTripRequestId(tripId) {
  return apiRequest(`/api/trips/${tripId}/logs`, {
    method: "GET",
    auth: true,
  });
}
