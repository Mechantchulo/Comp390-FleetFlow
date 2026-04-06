import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, CircleUserRound, LayoutDashboard, LogOut, Map, Search, Settings, Truck } from "lucide-react";
import { listAssignments } from "../../api/assignments";
import { endTripLog, startTripLog } from "../../api/tripLogs";

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

export default function DriverDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startMileage, setStartMileage] = useState("");
  const [activeAssignmentId, setActiveAssignmentId] = useState("");
  const [activeTripLogId, setActiveTripLogId] = useState("");
  const [endMileage, setEndMileage] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    async function loadAssignments() {
      try {
        setLoading(true);
        const data = await listAssignments();
        setAssignments(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load assignments.");
      } finally {
        setLoading(false);
      }
    }

    loadAssignments();
  }, []);

  const handleStartTrip = async () => {
    if (!activeAssignmentId || !startMileage) {
      window.alert("Select an assignment and provide start mileage.");
      return;
    }

    try {
      const created = await startTripLog({
        assignmentId: Number(activeAssignmentId),
        startMileage: Number(startMileage),
      });
      setActiveTripLogId(String(created.id));
      window.alert(`Trip started. Trip log ID: ${created.id}`);
    } catch (err) {
      window.alert(err.message || "Failed to start trip log.");
    }
  };

  const handleEndTrip = async () => {
    if (!activeTripLogId || !endMileage) {
      window.alert("Provide trip log ID and end mileage.");
      return;
    }

    try {
      await endTripLog(Number(activeTripLogId), {
        endMileage: Number(endMileage),
        comments,
      });
      window.alert("Trip ended successfully.");
      setEndMileage("");
      setComments("");
    } catch (err) {
      window.alert(err.message || "Failed to end trip log.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-2 text-slate-700 md:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-sm lg:flex-row">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-[250px] lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 p-4 md:p-5">
            <div className="mb-1 flex items-center gap-2 text-teal-700">
              <Truck size={16} />
              <p className="text-sm font-bold">FLEETflow</p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Driver Portal
            </p>
          </div>

          <nav className="flex-1 p-3 md:p-4 space-y-1">
            <div className="flex items-center gap-3 text-teal-700 font-semibold bg-teal-50 px-3 py-2 rounded-lg">
              <LayoutDashboard size={16} /> Overview
            </div>
            <div className="flex items-center gap-3 text-slate-500 px-3 py-2 rounded-lg">
              <Map size={16} /> Assigned Trips
            </div>
          </nav>

          <div className="border-t border-slate-100 p-3 md:p-4 space-y-1">
            <div className="flex items-center gap-3 text-slate-500 px-3 py-2 rounded-lg">
              <Settings size={16} /> Settings
            </div>
            <div className="flex items-center gap-3 text-rose-500 px-3 py-2 rounded-lg">
              <LogOut size={16} /> Logout
            </div>
          </div>
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
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  readOnly
                  value="Driver trips and logs"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-500"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 md:gap-5">
              <Bell size={16} className="text-slate-500" />
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-700">Fleet Driver</p>
                <p className="text-[11px] text-slate-400">FleetFlow</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 grid place-items-center">
                <CircleUserRound size={16} />
              </div>
            </div>
          </header>

          <div className="p-3 md:p-5 space-y-6">
          <header>
            <h1 className="text-3xl font-bold">Driver Overview</h1>
            <p className="text-slate-500">Manage assigned trips and trip logs.</p>
          </header>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h3 className="text-lg font-bold mb-4">Trip Log Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Assignment</label>
                <select
                  value={activeAssignmentId}
                  onChange={(e) => setActiveAssignmentId(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                >
                  <option value="">Select assignment</option>
                  {assignments
                    .filter((item) => item.status === "ASSIGNED")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        #{item.id} - {item.destination || "-"}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">Start Mileage</label>
                <input
                  type="number"
                  value={startMileage}
                  onChange={(e) => setStartMileage(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartTrip}
              className="mt-4 w-full rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Start Trip Log
            </button>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-600">Trip Log ID</label>
                <input
                  type="number"
                  value={activeTripLogId}
                  onChange={(e) => setActiveTripLogId(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">End Mileage</label>
                <input
                  type="number"
                  value={endMileage}
                  onChange={(e) => setEndMileage(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Comments</label>
                <input
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleEndTrip}
              className="mt-4 rounded-full bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              End Trip Log
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h3 className="text-lg font-bold mb-4">My Assignments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b">
                    <th className="pb-3">Assignment ID</th>
                    <th className="pb-3">Destination</th>
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Assigned At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td className="py-4 text-slate-500" colSpan={5}>Loading assignments...</td>
                    </tr>
                  ) : assignments.length === 0 ? (
                    <tr>
                      <td className="py-4 text-slate-500" colSpan={5}>No assignments found.</td>
                    </tr>
                  ) : (
                    assignments.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4">#{item.id}</td>
                        <td className="py-4">{item.destination || "-"}</td>
                        <td className="py-4">{item.vehiclePlateNumber || "-"}</td>
                        <td className="py-4">{item.status || "-"}</td>
                        <td className="py-4 text-slate-500">{formatDate(item.assignedAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Truck size={14} /> Live data from backend services
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
