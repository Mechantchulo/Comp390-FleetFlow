import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Bus,
  Car,
  CircleUserRound,
  ClipboardList,
  Gauge,
  Route,
  Settings,
} from "lucide-react";
import { createAssignment, listAssignments } from "../../api/assignments";
import { listTripRequests } from "../../api/trips";
import { listAllVehicles } from "../../api/vehicles";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  { key: "settings", label: "Settings", icon: Settings },
];

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

export default function TransportManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ tripRequestId: "", vehicleId: "", driverId: "" });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [requestsData, vehiclesData, assignmentsData] = await Promise.all([
          listTripRequests(),
          listAllVehicles(),
          listAssignments(),
        ]);

        setApprovedRequests(
          Array.isArray(requestsData)
            ? requestsData.filter((item) => item.status === "APPROVED")
            : []
        );
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load manager dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = useMemo(() => {
    const availableVehicles = vehicles.filter((item) => item.status === "AVAILABLE").length;
    const activeAssignments = assignments.filter((item) => item.status === "ASSIGNED").length;
    return [
      { label: "Total Vehicles", value: String(vehicles.length), icon: Bus },
      { label: "Active Assignments", value: String(activeAssignments), icon: Route },
      { label: "Available Vehicles", value: String(availableVehicles), icon: Car },
      { label: "Approved Requests", value: String(approvedRequests.length), icon: ClipboardList },
    ];
  }, [vehicles, assignments, approvedRequests]);

  const handleSubmit = async () => {
    if (!form.tripRequestId || !form.vehicleId || !form.driverId) {
      window.alert("Please fill all fields before submitting assignment.");
      return;
    }

    try {
      const created = await createAssignment({
        tripRequestId: Number(form.tripRequestId),
        vehicleId: Number(form.vehicleId),
        driverId: Number(form.driverId),
      });
      setAssignments((prev) => [created, ...prev]);
      setApprovedRequests((prev) => prev.filter((item) => item.id !== Number(form.tripRequestId)));
      setForm({ tripRequestId: "", vehicleId: "", driverId: "" });
      window.alert("Assignment created successfully.");
    } catch (err) {
      window.alert(err.message || "Failed to create assignment.");
    }
  };

  const activeItem = navItems.find((item) => item.key === activeTab);

  return (
    <main className="min-h-screen bg-slate-100 p-2 text-slate-700 md:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-sm lg:flex-row">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-[250px] lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 p-4 md:p-5">
            <div className="mb-1 flex items-center gap-2 text-teal-700">
              <Bus size={16} />
              <p className="text-sm font-bold">FLEETflow</p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Management Portal
            </p>
          </div>

          <nav className="flex-1 p-3 md:p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                  activeTab === item.key
                    ? "bg-teal-50 font-semibold text-teal-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
            <div className="flex w-full items-center gap-2 md:max-w-md">
              <Link
                to="/"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-teal-700"
              >
                <ArrowLeft size={12} />
                Welcome
              </Link>
              <div className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400">
                Fleet assignments and approved requests
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 md:gap-5">
              <Bell size={16} className="text-slate-500" />
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-700">Transport Manager</p>
                <p className="text-[11px] text-slate-400">FleetFlow</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 grid place-items-center">
                <CircleUserRound size={16} />
              </div>
            </div>
          </header>

          <div className="space-y-4 p-3 md:space-y-6 md:p-5">
            {activeTab === "dashboard" ? (
              <>
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                  <h2 className="mb-4 text-sm font-semibold text-slate-700">Create Assignment</h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Approved Trip</p>
                      <select
                        value={form.tripRequestId}
                        onChange={(e) => setForm((prev) => ({ ...prev, tripRequestId: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                      >
                        <option value="">Select approved trip</option>
                        {approvedRequests.map((item) => (
                          <option key={item.id} value={item.id}>
                            #{item.id} - {item.destination}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vehicle</p>
                      <select
                        value={form.vehicleId}
                        onChange={(e) => setForm((prev) => ({ ...prev, vehicleId: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                      >
                        <option value="">Select vehicle</option>
                        {vehicles.map((item) => (
                          <option key={item.id} value={item.id}>
                            #{item.id} - {item.plateNumber} ({item.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Driver ID</p>
                      <input
                        type="number"
                        value={form.driverId}
                        onChange={(e) => setForm((prev) => ({ ...prev, driverId: e.target.value }))}
                        placeholder="Enter driver user ID"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-4 w-full rounded-full bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Submit Assignment
                  </button>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                          <stat.icon size={16} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800">{loading ? "..." : stat.value}</p>
                    </article>
                  ))}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 md:px-5">
                    <h3 className="text-sm font-semibold text-slate-700">Recent Assignments</h3>
                    <span className="text-xs font-semibold text-teal-600">{assignments.length} total</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="text-[11px] uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Assignment</th>
                          <th className="px-5 py-3 font-semibold">Trip</th>
                          <th className="px-5 py-3 font-semibold">Vehicle</th>
                          <th className="px-5 py-3 font-semibold">Driver</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold">Assigned At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td className="px-5 py-3 text-slate-500" colSpan={6}>Loading assignments...</td>
                          </tr>
                        ) : assignments.length === 0 ? (
                          <tr>
                            <td className="px-5 py-3 text-slate-500" colSpan={6}>No assignments found.</td>
                          </tr>
                        ) : (
                          assignments.map((item) => (
                            <tr key={item.id} className="border-t border-slate-100">
                              <td className="px-5 py-3 text-teal-700">#{item.id}</td>
                              <td className="px-5 py-3">#{item.tripRequestId} - {item.destination || "-"}</td>
                              <td className="px-5 py-3">{item.vehiclePlateNumber || "-"}</td>
                              <td className="px-5 py-3">{item.driverName || `ID ${item.driverId}`}</td>
                              <td className="px-5 py-3">{item.status || "-"}</td>
                              <td className="px-5 py-3 text-slate-500">{formatDate(item.assignedAt)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-800">{activeItem?.label}</h2>
                <p className="mt-2 text-sm text-slate-500">Use this area for production settings and controls.</p>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
