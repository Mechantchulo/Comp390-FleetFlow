import { apiRequest } from "./client";

export function createFuelRecord(payload) {
  return apiRequest("/api/fuel-records", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export function getFuelRecordsByVehicle(vehicleId) {
  return apiRequest(`/api/vehicles/${vehicleId}/fuel-records`, {
    method: "GET",
    auth: true,
  });
}
