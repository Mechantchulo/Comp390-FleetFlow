const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function parseBody(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseBody(res);
  if (!res.ok) {
    const message =
      typeof body === "string" && body ? body : "Login failed";
    throw new Error(`(${res.status}) ${message}`);
  }
  return body;
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseBody(res);
  if (!res.ok) {
    const message =
      typeof body === "string" && body ? body : "Registration failed";
    throw new Error(`(${res.status}) ${message}`);
  }
  return body;
}
