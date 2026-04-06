import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EmptyIcon,
} from "../../assets/icons";
import { listTripRequests } from "../../api/trips";

const COLUMNS = ["Trip ID", "Date", "Destination", "Purpose", "Status", "Action"];

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

export default function TripHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        const list = Array.isArray(data) ? data : [];
        setTrips(list.filter((item) => item.status !== "PENDING"));
      } catch (err) {
        setError(err.message || "Failed to load trip history.");
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  const counts = useMemo(() => {
    return {
      approved: trips.filter((item) => item.status === "APPROVED").length,
      rejected: trips.filter((item) => item.status === "REJECTED").length,
    };
  }, [trips]);

  const tabs = [
    { id: "all", label: "All", count: trips.length },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();
    return trips.filter((trip) => {
      const statusMatch = activeTab === "all" || trip.status === activeTab.toUpperCase();
      const searchMatch =
        !query ||
        String(trip.id).toLowerCase().includes(query) ||
        String(trip.destination || "").toLowerCase().includes(query) ||
        String(trip.purpose || "").toLowerCase().includes(query);
      return statusMatch && searchMatch;
    });
  }, [activeTab, search, trips]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7 bg-slate-50 min-h-screen">
      <Link
        to="/dashboard/operations_staff"
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <ArrowLeft size={14} />
        Back To Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">Trip History</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">View approved and rejected trip requests.</p>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative max-w-sm w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, destination, or purpose"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-700 placeholder-slate-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-teal-500 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    active ? "bg-teal-400 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-3 border-b border-slate-100">
          {COLUMNS.map((col) => (
            <span key={col} className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              {col}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading trip history...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-rose-600">{error}</div>
        ) : filteredTrips.length > 0 ? (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="grid grid-cols-6 items-center px-6 py-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-bold text-slate-800">#{trip.id}</span>
              <span className="text-sm text-slate-600">{formatDate(trip.departureTime)}</span>
              <span className="text-sm text-slate-600">{trip.destination || "-"}</span>
              <span className="text-sm text-slate-600">{trip.purpose || "-"}</span>

              <span
                className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-medium ${
                  trip.status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-rose-50 text-rose-500 border border-rose-200"
                }`}
              >
                {trip.status}
              </span>

              <button
                className="text-sm font-semibold text-teal-600 hover:text-teal-700 text-left"
                onClick={() => window.alert(`Trip #${trip.id}\n${trip.purpose || "No purpose provided"}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <EmptyIcon className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-sm font-medium text-slate-400">No trip history</p>
            <p className="text-xs text-slate-300 mt-1">Approved and rejected requests will appear here.</p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {loading ? "Loading" : `Showing ${filteredTrips.length} trips`}
          </span>
          <div className="flex gap-1">
            <button disabled className="p-1.5 rounded border border-slate-200 text-slate-400 opacity-40 cursor-not-allowed">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button disabled className="p-1.5 rounded border border-slate-200 text-slate-400 opacity-40 cursor-not-allowed">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
