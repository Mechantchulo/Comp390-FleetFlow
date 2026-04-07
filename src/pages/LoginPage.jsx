import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../lib/authApi";
import { setAuthRole, setAuthToken } from "../api/client";
import { getCurrentTokenRole, getDashboardRouteForRole } from "../lib/session";

export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const requestedRole = params.get("role") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const restricted =
    requestedRole === "transport_manager" ||
    requestedRole === "department_dean" ||
    requestedRole === "fleet_driver" ||
    requestedRole === "admin";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      if (!data?.token) {
        throw new Error("No token returned by server.");
      }

      setAuthToken(data.token);
      const backendRole = typeof data.role === "string" ? data.role.trim() : "";
      if (backendRole) setAuthRole(backendRole);

      const resolvedRole = backendRole || getCurrentTokenRole();
      if (!resolvedRole) {
        throw new Error("Login succeeded, but no role was returned.");
      }

      navigate(getDashboardRouteForRole(resolvedRole), {
        replace: true,
      });
    } catch (error) {
      alert(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    if (restricted) {
      alert("This role is provisioned by admin. Please contact system admin.");
      return;
    }
    navigate(`/signup?role=${requestedRole || "operations_staff"}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 p-6">
      <div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Role: {requestedRole || "operations_staff"}
        </p>

        <form onSubmit={handleLogin}>
          <input
            className="mt-6 w-full rounded-lg border p-3"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="mt-3 w-full rounded-lg border p-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-full bg-teal-600 py-3 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleCreateAccount}
          className="mt-3 w-full text-sm text-teal-700 underline"
        >
          Don’t have an account? Create one
        </button>
      </div>
    </main>
  );
}
