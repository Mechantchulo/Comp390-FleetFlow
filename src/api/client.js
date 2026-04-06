const configuredBase = (import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/$/, "");
const API_BASE =
  configuredBase || (import.meta.env.DEV ? "http://localhost:8080" : "");

const TOKEN_STORAGE_KEY = "token";

export class ApiError extends Error {
  constructor(status, message, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getResponseContentType(response) {
  return response.headers.get("content-type") || "";
}

async function parseResponseBody(response) {
  const contentType = getResponseContentType(response);
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function toErrorMessage(payload, fallback) {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  return fallback;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = false,
    token,
  } = options;

  const requestHeaders = { ...headers };

  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const authToken = token || getAuthToken();
    if (!authToken) {
      throw new ApiError(401, "Missing authentication token", null);
    }
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const message = toErrorMessage(payload, `Request failed (${response.status})`);
    throw new ApiError(response.status, message, payload);
  }

  return payload;
}
