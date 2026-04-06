import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Gauge,
  Search,
  Settings,
  Truck,
  User,
} from "lucide-react";
import { createTripRequest, listTripRequests } from "../../api/trips";

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

export default function StaffDashboard({ onSubmitRequest, onViewDetails, onSearch }) {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        setAllRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        window.alert(error.message || "Failed to load trip requests.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const stats = useMemo(() => {
    const total = allRequests.length;
    const approved = allRequests.filter((item) => item.status === "APPROVED").length;
    const pending = allRequests.filter((item) => item.status === "PENDING").length;
    return { total, approved, pending };
  }, [allRequests]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allRequests;

    return allRequests.filter((item) => {
      return (
        String(item.id).toLowerCase().includes(query) ||
        String(item.destination || "").toLowerCase().includes(query) ||
        String(item.purpose || "").toLowerCase().includes(query)
      );
    });
  }, [allRequests, searchQuery]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSubmitRequest = async (form) => {
    if (onSubmitRequest) return onSubmitRequest(form);

    try {
      const normalizeDateTime = (value) => {
        if (!value) return value;
        return value.length === 16 ? `${value}:00` : value;
      };

      const response = await createTripRequest({
        purpose: form.purpose,
        destination: form.destination,
        departureTime: normalizeDateTime(form.departureTime),
        returnTime: normalizeDateTime(form.returnTime),
      });
      setAllRequests((prev) => [response, ...prev]);
      window.alert("Trip request submitted.");
    } catch (error) {
      window.alert(error.message || "Failed to submit request.");
    }
  };

  const handleViewDetails = (request) => {
    if (onViewDetails) return onViewDetails(request);
    window.alert(
      `Trip #${request.id}\nDestination: ${request.destination}\nPurpose: ${request.purpose}\nStatus: ${request.status}`
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 p-2 text-slate-700 md:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-sm lg:flex-row">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header onSearch={handleSearch} />

          <main className="p-3 md:p-5 space-y-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total Requests"
                value={String(stats.total)}
                subtitle="Live backend total"
                icon={<ClipboardList size={16} />}
                color="bg-teal-50 text-teal-700"
              />
              <StatCard
                title="Approved"
                value={String(stats.approved)}
                subtitle="Approved requests"
                icon={<CheckCircle2 size={16} />}
                color="bg-emerald-50 text-emerald-700"
              />
              <StatCard
                title="Pending"
                value={String(stats.pending)}
                subtitle="Awaiting dean/admin"
                icon={<Clock3 size={16} />}
                color="bg-amber-50 text-amber-700"
              />
            </section>

            <RequestForm onSubmitRequest={handleSubmitRequest} />

            <RequestTable
              requests={filteredRequests}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </main>
        </div>
      </div>
    </main>
  );
}

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: Gauge, path: "/dashboard/operations_staff" },
    { name: "My Requests", icon: ClipboardList, path: "/staff/myRequests" },
    { name: "History", icon: Clock3, path: "/staff/TripHistory" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-[250px] lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-100 p-4 md:p-5">
        <div className="mb-1 flex items-center gap-2 text-teal-700">
          <Truck size={16} />
          <p className="text-sm font-bold">FLEETflow</p>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Staff Portal</p>
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3 md:p-4">
        <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">
          <Settings size={16} />
          Settings
        </Link>
      </div>
    </aside>
  );
}

function Header({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
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
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search trips, requests..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 md:gap-5">
        <Bell size={16} className="text-slate-500" />
        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold text-slate-700">Operations Staff</p>
          <p className="text-[11px] text-slate-400">FleetFlow</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 grid place-items-center text-xs font-semibold">ST</div>
      </div>
    </header>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
      </div>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </article>
  );
}

function RequestForm({ onSubmitRequest }) {
  const [form, setForm] = useState({
    purpose: "",
    destination: "",
    departureTime: "",
    returnTime: "",
  });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmitRequest) onSubmitRequest(form);
    setForm({ purpose: "", destination: "", departureTime: "", returnTime: "" });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="font-semibold text-slate-800">New Trip Request</h2>
        <span className="text-xs tracking-widest text-slate-400">TRIP FORM</span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-sm text-slate-600">Purpose of Trip</label>
          <input
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="e.g. Client Site Visit, Team Offsite"
            className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Destination</label>
            <input
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Location address"
              className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={form.departureTime}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Return Time</label>
            <input
              type="datetime-local"
              name="returnTime"
              value={form.returnTime}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <button type="submit" className="mt-4 w-full rounded-full bg-teal-600 py-3 font-medium text-white hover:bg-teal-700">
          Submit Request
        </button>
      </form>
    </section>
  );
}

function RequestTable({ requests, onViewDetails, loading }) {
  const statusStyles = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-rose-100 text-rose-700",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="font-semibold text-slate-800">Recent Requests</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">Loading requests...</td>
              </tr>
            )}

            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">No requests yet</td>
              </tr>
            )}

            {requests.map((request) => (
              <tr key={request.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">#{request.id}</td>
                <td className="px-6 py-4 text-slate-600">{request.destination}</td>
                <td className="px-6 py-4 text-slate-500">{formatDate(request.departureTime)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[request.status] || "bg-slate-100 text-slate-700"}`}>
                    {request.status || "UNKNOWN"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails && onViewDetails(request)}
                    className="font-medium text-teal-600 hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
