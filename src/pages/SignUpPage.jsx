import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../lib/authApi";
import { toBackendRole } from "../lib/roleMap";

export default function SignupPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const role = params.get("role") || "";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const restricted =
    role === "transport_manager" || role === "department_dean";

  const handleSignup = async (e) => {
    e.preventDefault();

    if (restricted) {
      alert("This role is provisioned by admin. Please contact system admin.");
      return;
    }

    const backendRole = toBackendRole[role];
    if (!backendRole) {
      alert("Invalid role selected.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        fullName,
        email,
        password,
        role: backendRole,
      });
      alert("Account created successfully. Please sign in.");
      navigate(`/login?role=${role}`);
    } catch (error) {
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-teal-50 p-6">
      <div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-500">Role: {role}</p>

        <form onSubmit={handleSignup}>
          <input
            className="mt-6 w-full rounded-lg border p-3"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
            disabled={loading || restricted}
            className="mt-5 w-full rounded-full bg-teal-600 py-3 text-white font-semibold disabled:opacity-60"
          >
            {restricted
              ? "Account created by admin"
              : loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
