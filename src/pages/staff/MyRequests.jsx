import { useEffect, useMemo, useState } from "react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxIcon,
} from "../../assets/icons";
import { listTripRequests } from "../../api/trips";

const COLUMNS = ["Request ID", "Date", "Driver", "Destination", "Status", "Action"];

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function getStatusLabel(status) {
  if (!status) return "Unknown";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function MyRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        setRequests(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load trip requests.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const statusCounts = useMemo(() => {
    return requests.reduce(
      (acc, request) => {
        if (request.status === "PENDING") acc.pending += 1;
        if (request.status === "APPROVED") acc.approved += 1;
        if (request.status === "REJECTED") acc.rejected += 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
  }, [requests]);

  const tabs = [
    { id: "all", label: "All Requests", count: requests.length },
    { id: "pending", label: "Pending", count: statusCounts.pending },
    { id: "approved", label: "Approved", count: statusCounts.approved },
    { id: "rejected", label: "Rejected", count: statusCounts.rejected },
  ];

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const statusMatch =
        activeTab === "all" || request.status === activeTab.toUpperCase();

      const searchMatch =
        !query ||
        String(request.id).toLowerCase().includes(query) ||
        String(request.destination || "").toLowerCase().includes(query) ||
        String(request.purpose || "").toLowerCase().includes(query);

      return statusMatch && searchMatch;
    });
  }, [activeTab, requests, search]);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Manage and track all trip requests in one place.
      </p>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative max-w-sm w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by request ID, destination, or purpose"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 placeholder-gray-400"
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
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    active ? "bg-teal-400 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-3 border-b border-gray-100">
          {COLUMNS.map((col) => (
            <span key={col} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {col}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading requests...</div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">{error}</div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="grid grid-cols-6 items-center px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-800">#{req.id}</span>
              <span className="text-sm text-gray-600">{formatDate(req.departureTime)}</span>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold shrink-0">
                  DR
                </div>
                <span className="text-sm text-gray-700">Not assigned</span>
              </div>

              <span className="text-sm text-gray-600">{req.destination}</span>

              <span
                className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-medium ${
                  req.status === "PENDING"
                    ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                    : req.status === "APPROVED"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}
              >
                {getStatusLabel(req.status)}
              </span>

              <button
                className="text-sm font-semibold text-teal-600 hover:text-teal-700 text-left"
                onClick={() => window.alert(`${req.purpose || "No purpose provided"}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <InboxIcon className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-400">No requests yet</p>
            <p className="text-xs text-gray-300 mt-1">
              Trip requests will appear here once submitted.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {loading
              ? "Loading requests"
              : `Showing ${filteredRequests.length} request${filteredRequests.length === 1 ? "" : "s"}`}
          </span>
          <div className="flex gap-1">
            <button
              disabled
              className="p-1.5 rounded border border-gray-200 text-gray-400 opacity-40 cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              disabled
              className="p-1.5 rounded border border-gray-200 text-gray-400 opacity-40 cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
