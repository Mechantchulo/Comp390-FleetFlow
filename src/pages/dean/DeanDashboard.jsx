import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, History, User, Settings, LogOut, CheckCircle, XCircle, Clock } from "lucide-react";
import { listTripRequests } from "../../api/trips";

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

const DeanDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const stats = useMemo(() => {
    const pending = requests.filter((item) => item.status === "PENDING").length;
    const approved = requests.filter((item) => item.status === "APPROVED").length;
    const rejected = requests.filter((item) => item.status === "REJECTED").length;
    return { pending, approved, rejected };
  }, [requests]);

  const pendingRequests = useMemo(
    () => requests.filter((item) => item.status === "PENDING").slice(0, 8),
    [requests]
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <aside className="w-64 bg-white border-r flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="text-xl font-bold text-teal-700 uppercase tracking-wider">Fleetflow</h2>
        </div>

        <nav className="flex-1 space-y-4">
          <Link to="/dashboard/department_dean" className="flex items-center gap-3 text-teal-700 font-semibold bg-teal-50 p-3 rounded-lg">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/dean/pending" className="flex items-center gap-3 text-slate-500 hover:text-teal-700 p-3">
            <History size={18} /> Pending requests
          </Link>
          <Link to="/dean/history" className="flex items-center gap-3 text-slate-500 hover:text-teal-700 p-3">
            <History size={18} /> Request History
          </Link>
          <Link to="/dean/profile" className="flex items-center gap-3 text-slate-500 hover:text-teal-700 p-3">
            <User size={18} /> Profile
          </Link>
        </nav>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center gap-3 text-slate-500 p-3 cursor-pointer">
            <Settings size={18} /> Settings
          </div>
          <div className="flex items-center gap-3 text-rose-500 p-3 cursor-pointer">
            <LogOut size={18} /> Logout
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <header className="mb-8">
          <Link
            to="/"
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-teal-700"
          >
            <ArrowLeft size={12} />
            Welcome
          </Link>
          <h1 className="text-3xl font-bold">Dean Approval Dashboard</h1>
          <p className="text-slate-500">Review and approve transport requests.</p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Pending" count={loading ? "..." : String(stats.pending)} icon={<Clock className="text-amber-500" />} />
          <StatCard title="Approved" count={loading ? "..." : String(stats.approved)} icon={<CheckCircle className="text-emerald-500" />} />
          <StatCard title="Rejected" count={loading ? "..." : String(stats.rejected)} icon={<XCircle className="text-rose-500" />} />
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Latest Pending Requests</h3>
            <Link to="/dean/pending" className="text-teal-700 text-sm font-semibold hover:underline">View All</Link>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b">
                <th className="pb-4">Request ID</th>
                <th className="pb-4">Requester</th>
                <th className="pb-4">Purpose</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Destination</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No pending requests.</td>
                </tr>
              ) : (
                pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="py-4">#{req.id}</td>
                    <td className="py-4">{req.requesterName || "Unknown"}</td>
                    <td className="py-4">{req.purpose || "-"}</td>
                    <td className="py-4">{formatDate(req.departureTime)}</td>
                    <td className="py-4">{req.destination || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ title, count, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold">{count}</p>
      </div>
      <div className="bg-teal-50 p-2 rounded-lg">{icon}</div>
    </div>
  </div>
);

export default DeanDashboard;
