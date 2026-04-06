import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "../../api/client";

export default function Profile() {
  const profile = useMemo(() => {
    const token = getAuthToken();
    if (!token) return { name: "Dean User", email: "-" };

    try {
      const decoded = jwtDecode(token);
      const email = decoded?.sub || "-";
      const shortName = typeof email === "string" ? email.split("@")[0] : "Dean User";
      return {
        name: shortName || "Dean User",
        email,
      };
    } catch {
      return { name: "Dean User", email: "-" };
    }
  }, []);

  const firstInitial = String(profile.name || "D").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <Link
        to="/dashboard/department_dean"
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <ArrowLeft size={14} />
        Back To Dashboard
      </Link>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-3xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center text-3xl font-bold shadow">
            {firstInitial}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{profile.name}</h3>
            <p className="text-sm text-slate-500">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 text-sm">
          <div>
            <p className="text-slate-400">Role</p>
            <p className="font-medium">DEAN</p>
          </div>
          <div>
            <p className="text-slate-400">Account Source</p>
            <p className="font-medium">JWT Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
