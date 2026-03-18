import { useState } from "react";
import {
  Bell,
  Bus,
  Calendar,
  Car,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  FileText,
  Gauge,
  MapPinned,
  Route,
  Settings,
  Users,
} from "lucide-react";

const stats = [
  { label: "Total Buses", value: "45", delta: "+2%", deltaColor: "text-emerald-500", icon: Bus },
  { label: "Active Trips", value: "12", delta: "+5%", deltaColor: "text-emerald-500", icon: Route },
  { label: "Available Drivers", value: "8", delta: "-1%", deltaColor: "text-rose-500", icon: CircleUserRound },
  { label: "Pending Requests", value: "5", delta: "+12%", deltaColor: "text-emerald-500", icon: ClipboardList },
];

const requests = [
  { id: "#REQ-9042", requester: "Sales Department", destination: "Tech Convention Center", date: "Oct 12, 2023" },
  { id: "#REQ-9038", requester: "HR Team", destination: "Mountain Retreat", date: "Oct 15, 2023" },
  { id: "#REQ-9026", requester: "Engineering", destination: "Client Site - West", date: "Oct 19, 2023" },
];

const busOptions = [
  { value: "", label: "Select a vehicle..." },
  { value: "bus-014", label: "Bus 014 - Isuzu 30 Seater" },
  { value: "bus-021", label: "Bus 021 - Coaster 24 Seater" },
  { value: "bus-007", label: "Bus 007 - Nissan Civilian" },
];

const driverOptions = [
  { value: "", label: "Select a driver..." },
  { value: "driver-john", label: "John Kamau" },
  { value: "driver-lilian", label: "Lilian Akinyi" },
  { value: "driver-timon", label: "Omondi Timon" },
];

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  { label: "Active Trips", icon: Route },
  { label: "Driver Management", icon: Users },
  { label: "Fleet", icon: Car },
  { label: "Reports", icon: FileText },
  { label: "Profile", icon: CircleUserRound },
];

export default function TransportManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [allocationForm, setAllocationForm] = useState({
    busId: "",
    driverId: "",
    destination: "",
    date: "",
    time: "",
  });

  const items = [
    ...navItems.map((item) => ({
      ...item,
      key: item.key || item.label.toLowerCase().replace(/\s+/g, "_"),
    })),
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const activeItem = items.find((item) => item.key === activeTab);

  const updateAllocationField = (field, value) => {
    setAllocationForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAllocationSubmit = () => {
    const { busId, driverId, destination, date, time } = allocationForm;
    if (!busId || !driverId || !destination || !date || !time) {
      alert("Please fill all allocation fields before submitting.");
      return;
    }
    alert("Allocation submitted.");
  };

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

          <nav className="flex-1 p-3 md:p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {items
              .filter((item) => item.key !== "settings")
              .map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm lg:w-full lg:gap-3 ${
                  activeTab === item.key
                    ? "bg-teal-50 font-semibold text-teal-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            </div>
          </nav>

          <div className="border-t border-slate-100 p-3 md:p-4">
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm lg:gap-3 ${
                activeTab === "settings"
                  ? "bg-teal-50 font-semibold text-teal-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
            <div className="w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 md:max-w-md">
              Search trips, drivers, or vehicles...
            </div>
            <div className="ml-auto flex items-center gap-3 md:gap-5">
              <Bell size={16} className="text-slate-500" />
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-700">Alex Morgan</p>
                <p className="text-[11px] text-slate-400">Transport Manager</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-300/70" />
            </div>
          </header>

          <div className="space-y-4 p-3 md:space-y-6 md:p-5">
            {activeTab === "dashboard" ? (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                  <h2 className="mb-4 text-sm font-semibold text-slate-700">New Allocation</h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Select Bus">
                      <div className="relative">
                        <select
                          value={allocationForm.busId}
                          onChange={(e) => updateAllocationField("busId", e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-8 text-sm text-slate-600 outline-none focus:border-teal-400"
                        >
                          {busOptions.map((option) => (
                            <option key={option.value || "empty-bus"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </FormField>

                    <FormField label="Select Driver">
                      <div className="relative">
                        <select
                          value={allocationForm.driverId}
                          onChange={(e) => updateAllocationField("driverId", e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-8 text-sm text-slate-600 outline-none focus:border-teal-400"
                        >
                          {driverOptions.map((option) => (
                            <option key={option.value || "empty-driver"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </FormField>

                    <FormField label="Route Destination" full>
                      <div className="relative">
                        <MapPinned size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={allocationForm.destination}
                          onChange={(e) => updateAllocationField("destination", e.target.value)}
                          placeholder="e.g. Airport Terminal 2"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-teal-400"
                        />
                      </div>
                    </FormField>

                    <FormField label="Date">
                      <div className="relative">
                        <Calendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          value={allocationForm.date}
                          onChange={(e) => updateAllocationField("date", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-600 outline-none focus:border-teal-400"
                        />
                      </div>
                    </FormField>

                    <FormField label="Time">
                      <div className="relative">
                        <Calendar size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="time"
                          value={allocationForm.time}
                          onChange={(e) => updateAllocationField("time", e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-600 outline-none focus:border-teal-400"
                        />
                      </div>
                    </FormField>
                  </div>

                  <button
                    type="button"
                    onClick={handleAllocationSubmit}
                    className="mt-4 w-full rounded-full bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    Submit Allocation
                  </button>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                          <stat.icon size={16} />
                        </div>
                        <p className={`text-xs font-semibold ${stat.deltaColor}`}>{stat.delta}</p>
                      </div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    </article>
                  ))}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 md:px-5">
                    <h3 className="text-sm font-semibold text-slate-700">New Requests</h3>
                    <span className="text-xs font-semibold text-teal-600">3 Pending</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm md:min-w-[760px]">
                      <thead className="text-[11px] uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Request ID</th>
                          <th className="px-5 py-3 font-semibold">Requester</th>
                          <th className="px-5 py-3 font-semibold">Destination</th>
                          <th className="px-5 py-3 font-semibold">Date</th>
                          <th className="px-5 py-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => (
                          <tr key={request.id} className="border-t border-slate-100">
                            <td className="px-5 py-3 text-teal-600">{request.id}</td>
                            <td className="px-5 py-3">{request.requester}</td>
                            <td className="px-5 py-3 text-slate-500">{request.destination}</td>
                            <td className="px-5 py-3 text-slate-500">{request.date}</td>
                            <td className="px-5 py-3">
                              <div className="flex justify-end gap-2">
                                <button type="button" className="rounded-md border border-emerald-200 px-2 py-1 text-xs text-emerald-600">
                                  Approve
                                </button>
                                <button type="button" className="rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600">
                                  Decline
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <TabPlaceholder
                title={activeItem?.label || "Section"}
                description={`This ${activeItem?.label?.toLowerCase() || "section"} module is now connected and ready for detailed implementation.`}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function FormField({ label, full, children }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      {children}
    </div>
  );
}

function TabPlaceholder({ title, description }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-400">
        Placeholder content for {title}. You can now switch tabs and build each module independently.
      </div>
    </section>
  );
}
