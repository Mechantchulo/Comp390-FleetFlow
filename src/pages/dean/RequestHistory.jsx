import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { listTripRequests } from "../../api/trips";

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

export default function RequestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        setHistory(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load request history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return history.filter((item) => {
      if (!query) return true;
      return (
        String(item.requesterName || "").toLowerCase().includes(query) ||
        String(item.destination || "").toLowerCase().includes(query)
      );
    });
  }, [history, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard/department_dean"
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Back To Dashboard
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Request History</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all historical transport requests and their status.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-700">All Request History</h3>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff or destination..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-teal-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Request ID</th>
                  <th className="px-6 py-3">Staff Name</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3">Action Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                      Loading request history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-rose-600">
                      {error}
                    </td>
                  </tr>
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-teal-700">#{item.id}</td>
                      <td className="px-6 py-4 text-slate-700">
                        {item.requesterName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.destination || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(item.departureTime)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "REJECTED"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                      No records match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
            Showing {filteredHistory.length} historical records
          </div>
        </section>
      </div>
    </div>
  );
}
