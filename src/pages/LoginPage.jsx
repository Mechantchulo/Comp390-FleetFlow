import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../lib/authApi";
import { setAuthToken } from "../api/client";
import { getCurrentTokenRole, getDashboardRouteForRole } from "../lib/session";

export default function LoginPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = params.get("role") || "";
  const [selectedRole, setSelectedRole] = useState(role);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const restricted =
    selectedRole === "transport_manager" ||
    selectedRole === "department_dean" ||
    selectedRole === "fleet_driver" ||
    selectedRole === "admin";

  const roleParamToBackendRole = {
    transport_manager: "TRANSPORT_MANAGER",
    operations_staff: "STAFF",
    department_dean: "DEAN",
    fleet_driver: "DRIVER",
    admin: "ADMIN",
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      if (!data?.token) {
        throw new Error("No token returned by server.");
      }

      setAuthToken(data.token);
      const tokenRole = getCurrentTokenRole();
      const fallbackRole = roleParamToBackendRole[selectedRole] || null;
      navigate(getDashboardRouteForRole(tokenRole || fallbackRole), {
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
    navigate(`/signup?role=${selectedRole}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 p-6">
      <div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Role: {selectedRole || "Not selected"}
        </p>

        <form onSubmit={handleLogin}>
          <select
            className="mt-6 w-full rounded-lg border p-3"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="admin">Admin</option>
            <option value="transport_manager">Transport Manager</option>
            <option value="operations_staff">Operations Staff</option>
            <option value="department_dean">Department Dean</option>
            <option value="fleet_driver">Fleet Driver</option>
          </select>

          <input
            className="mt-3 w-full rounded-lg border p-3"
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
