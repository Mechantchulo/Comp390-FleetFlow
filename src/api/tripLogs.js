import { apiRequest } from "./client";

export function startTripLog(payload) {
  return apiRequest("/api/trip-logs", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function endTripLog(id, payload) {
  return apiRequest(`/api/trip-logs/${id}/end`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export function getTripLogById(id) {
  return apiRequest(`/api/trip-logs/${id}`, {
    method: "GET",
    auth: true,
  });
}
