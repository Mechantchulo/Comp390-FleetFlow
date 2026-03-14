import { useState } from "react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EmptyIcon,
  FilterIcon,
} from "../assets/historyIcons";

const TABS = [
  { id: "all",       label: "All",       count: null },
  { id: "completed", label: "Completed", count: 38  },
  { id: "cancelled", label: "Cancelled", count: 9   },
];

const COLUMNS = ["Trip ID", "Date", "Driver", "Route", "Duration", "Status", "Action"];

export default function History() {
  const [activeTab, setActiveTab]   = useState("all");
  const [search,    setSearch]      = useState("");

  const trips = []; // replace with real data

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">

      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        View and review all past trip activity.
      </p>

      {/* Search + filter tabs */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative max-w-sm w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Driver, or Route"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => {
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
                {tab.count !== null && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      active
                        ? "bg-teal-400 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter button — right-aligned */}
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
          <FilterIcon className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header row */}
        <div className="grid grid-cols-7 px-6 py-3 border-b border-gray-100">
          {COLUMNS.map((col) => (
            <span
              key={col}
              className="text-xs font-semibold text-gray-400 uppercase tracking-wide"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Body */}
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="grid grid-cols-7 items-center px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-800">{trip.id}</span>
              <span className="text-sm text-gray-600">{trip.date}</span>

              {/* Driver with avatar */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold flex-shrink-0">
                  {trip.driverInitials}
                </div>
                <span className="text-sm text-gray-700">{trip.driver}</span>
              </div>

              <span className="text-sm text-gray-600">{trip.route}</span>
              <span className="text-sm text-gray-600">{trip.duration}</span>

              {/* Status badge */}
              <span
                className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-medium ${
                  trip.status === "Completed"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-red-50 text-red-500 border border-red-200"
                }`}
              >
                {trip.status}
              </span>

              <button className="text-sm font-semibold text-teal-600 hover:text-teal-700 text-left">
                View Details
              </button>
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <EmptyIcon className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-400">No trip history</p>
            <p className="text-xs text-gray-300 mt-1">
              Completed and cancelled trips will appear here.
            </p>
          </div>
        )}

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {trips.length > 0
              ? `Showing 1 to ${trips.length} of ${trips.length} trips`
              : "Showing 0 trips"}
          </span>
          <div className="flex gap-1">
            <button
              disabled={trips.length === 0}
              className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              disabled={trips.length === 0}
              className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}