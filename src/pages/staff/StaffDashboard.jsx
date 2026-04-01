import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  TruckIcon,
} from "../../assets/icons";

/* Main dashboard */
export default function StaffDashboard({
  totalRequests = 0,
  approvedRequests = 0,
  pendingRequests = 2,
  recentRequests = [],
  onSubmitRequest,
  onViewDetails,
  onSearch,
}) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header onSearch={onSearch} />

        <main className="p-6 space-y-6">

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Requests"
              value={totalRequests}
              subtitle="+12% this month"
              icon={<DocumentTextIcon className="w-6 h-6" />}
              color="bg-teal-100 text-teal-600"
            />

            <StatCard
              title="Approved"
              value={approvedRequests}
              subtitle="90% Success rate"
              icon={<CheckCircleIcon className="w-6 h-6" />}
              color="bg-green-100 text-green-600"
            />

            <StatCard
              title="Pending"
              value={pendingRequests}
              subtitle="Awaiting review"
              icon={<ClockIcon className="w-6 h-6" />}
              color="bg-yellow-100 text-yellow-600"
            />
          </div>

          <RequestForm onSubmitRequest={onSubmitRequest} />

          <RequestTable
            requests={recentRequests}
            onViewDetails={onViewDetails}
          />
        </main>
      </div>
    </div>
  );
}

/*Sidebar*/
function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/" },
    { name: "My Requests", icon: ClipboardDocumentListIcon, path: "/staff/myRequests" },
    { name: "History", icon: ClockIcon, path: "/staff/TripHistory" },
    { name: "Profile", icon: UserIcon, path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-white border-r flex flex-col justify-between min-h-screen">

      <div>

        <div className="flex items-center gap-3 p-6">
          <div className="bg-teal-600 text-white p-2 rounded-lg">
            <TruckIcon className="w-5 h-5" />
          </div>

          <div>
            <h1 className="font-semibold text-gray-800">TMS Staff</h1>
            <p className="text-xs text-gray-500">Transport Hub</p>
          </div>
        </div>

        <nav className="px-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  active
                    ? "bg-teal-100 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

/*Header*/
function Header({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">

      <div className="relative w-full max-w-lg">
        <MagnifyingGlassIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />

        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search trips, requests..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex items-center gap-6 ml-6">
        <BellIcon className="w-6 h-6 text-gray-500" />
         {/*user profile */}
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />

          <span className="text-sm font-medium text-gray-700">
            User
          </span>
        </div>
      </div>
    </header>
  );
}

/*Stat card */
function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 flex justify-between items-center">

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
        <p className="text-xs text-green-500 mt-1">{subtitle}</p>
      </div>

      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    </div>
  );
}

/* Request form */
function RequestForm({ onSubmitRequest }) {
  const [form, setForm] = useState({
    purpose: "",
    destination: "",
    passengers: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitRequest) onSubmitRequest(form);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">

      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="font-semibold text-gray-800">New Bus Request</h2>
        <span className="text-xs text-gray-400 tracking-widest">
          TRIP FORM
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">

        <div>
          <label className="text-sm text-gray-600">Purpose of Trip</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="e.g. Client Site Visit, Team Offsite"
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">Destination</label>
            <input
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Location address"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Passengers</label>
            <input
              name="passengers"
              value={form.passengers}
              onChange={handleChange}
              placeholder="Number of people"
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

/* Request table */
function RequestTable({ requests, onViewDetails }) {

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">

      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-gray-800">Recent Requests</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No requests yet
                </td>
              </tr>
            )}

            {requests.map((req) => (
              <tr key={req.id} className="border-t hover:bg-gray-50">

                <td className="px-6 py-4 font-medium text-gray-700">
                  {req.id}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {req.destination}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {req.date}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[req.status]}`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails && onViewDetails(req)}
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Details
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
} 