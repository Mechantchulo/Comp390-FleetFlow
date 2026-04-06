import { apiRequest } from "./client";

export function createVehicle(payload) {
  return apiRequest("/api/vehicles/create", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function getVehicleById(id) {
  return apiRequest(`/api/vehicles/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function listAllVehicles() {
  return apiRequest("/api/vehicles/all", {
    method: "GET",
    auth: true,
  });
}

export function updateVehicle(id, payload) {
  return apiRequest(`/api/vehicles/${id}`, {
    method: "PUT",
    auth: true,
    body: payload,
  });
}

export function deleteVehicle(id) {
  return apiRequest(`/api/vehicles/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
