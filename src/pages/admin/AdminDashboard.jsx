import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bus,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  FileDown,
  FileText,
  Filter,
  Fuel,
  Gauge,
  Search,
  Settings,
  ShieldCheck,
  TriangleAlert,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { createAssignment, updateAssignmentStatus } from "../../api/assignments";
import { getFuelRecordsByVehicle } from "../../api/fuelRecords";
import { getTripLogById } from "../../api/tripLogs";
import { approveTripRequest, getTripLogsByTripRequestId, listTripRequests, rejectTripRequest } from "../../api/trips";
import { updateUserRole } from "../../api/users";
import { listAllVehicles } from "../../api/vehicles";

const kpiCardMeta = [
  { key: "tripsToday", label: "Total Trips Today", icon: Bus },
  { key: "activeDrivers", label: "Active Drivers", icon: CircleUserRound },
  { key: "pendingApprovals", label: "Pending Approvals", icon: Clock3 },
  { key: "fleetAvailability", label: "Fleet Availability", icon: Car },
  { key: "maintenanceOpen", label: "Open Maintenance Issues", icon: Wrench },
  { key: "delayedCanceled", label: "Delayed / Canceled Trips", icon: TriangleAlert },
  { key: "fuelUsage", label: "Fuel Usage Snapshot", icon: Fuel },
  { key: "policyFlags", label: "Policy Violation Flags", icon: ShieldCheck },
];

const navItems = [
  { key: "overview", label: "Overview", icon: Gauge },
  { key: "operations", label: "Operations Monitor", icon: Bus },
  { key: "approvals", label: "Requests & Approvals", icon: CheckCircle2 },
  { key: "fleet", label: "Fleet & Maintenance", icon: Wrench },
  { key: "analytics", label: "Driver & Staff Analytics", icon: Users },
  { key: "incidents", label: "Incidents & Alerts", icon: AlertTriangle },
  { key: "reports", label: "Reports & Exports", icon: FileText },
  { key: "governance", label: "Governance", icon: Settings },
];

const systemHealth = [];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [tripRows, setTripRows] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [adminActions, setAdminActions] = useState([]);
  const [maintenanceRows, setMaintenanceRows] = useState([]);
  const [utilizationData, setUtilizationData] = useState([]);
  const [tripCompletionTrend, setTripCompletionTrend] = useState([]);
  const [fuelEfficiencyRows, setFuelEfficiencyRows] = useState([]);
  const [staffTrendRows, setStaffTrendRows] = useState([]);
  const [driverAvailability, setDriverAvailability] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [fuelRecords, setFuelRecords] = useState([]);
  const [fuelLoading, setFuelLoading] = useState(false);
  const [roleUpdateForm, setRoleUpdateForm] = useState({ userId: "", role: "DEAN" });
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [investigatedTrip, setInvestigatedTrip] = useState("");
  const [reportDates, setReportDates] = useState({ start: "2026-03-30", end: "2026-04-05" });

  const pendingRequestsCount = useMemo(
    () => requests.filter((request) => request.status === "Pending").length,
    [requests]
  );

  const delayedTripsCount = useMemo(
    () => tripRows.filter((trip) => trip.state === "Delayed").length,
    [tripRows]
  );

  const kpiCards = useMemo(() => {
    const totalTripsToday = requests.filter((request) => request.date === new Date().toISOString().slice(0, 10)).length;
    const fleetCount = vehicles.length;
    const maintenanceCount = vehicleStatus.filter((item) => item.label === "Maintenance").reduce((acc, item) => acc + item.value, 0);
    const fuelTotal = fuelRecords.reduce((acc, item) => acc + Number(item?.liters || item?.amount || 0), 0);

    const valuesByKey = {
      tripsToday: String(totalTripsToday),
      activeDrivers: "--",
      pendingApprovals: String(pendingRequestsCount),
      fleetAvailability: fleetCount ? `${Math.round(((fleetCount - maintenanceCount) / fleetCount) * 100)}%` : "--",
      maintenanceOpen: String(maintenanceCount),
      delayedCanceled: String(delayedTripsCount),
      fuelUsage: fuelTotal > 0 ? `${fuelTotal.toFixed(1)} L` : "--",
      policyFlags: String(incidents.filter((item) => String(item.category).toLowerCase().includes("policy")).length),
    };

    return kpiCardMeta.map((meta) => ({
      ...meta,
      value: valuesByKey[meta.key] ?? "--",
      trend: "--",
      trendType: "warning",
    }));
  }, [requests, pendingRequestsCount, vehicles, vehicleStatus, delayedTripsCount, fuelRecords, incidents]);

  const addToast = (type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  useEffect(() => {
    if (!toasts.length) return;

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2600);

    return () => clearTimeout(timeout);
  }, [toasts]);

  useEffect(() => {
    async function loadAdminReads() {
      setRequestsLoading(true);

      try {
        const [tripRequests, fleetVehicles] = await Promise.all([
          listTripRequests(),
          listAllVehicles().catch(() => []),
        ]);

        const normalizedRequests = Array.isArray(tripRequests)
          ? tripRequests.map((request) => ({
              id: request.id ? String(request.id) : "N/A",
              requester: request.requesterName || request.requester || request.department || "Unknown",
              role: normalizeRole(request.role),
              department: request.department || "Unknown",
              urgency: normalizeUrgency(request.urgency),
              date: normalizeDate(request.date || request.departureTime || request.createdAt),
              status: normalizeTripStatus(request.status),
              destination: request.destination || "Unknown",
            }))
          : [];

        setRequests(normalizedRequests);
        setTripRows(
          normalizedRequests.map((request) => ({
            id: request.id,
            route: request.destination || "Unknown",
            state: request.status === "Approved" ? "Ongoing" : request.status === "Declined" ? "Canceled" : "Pending",
            driver: "Not assigned",
            vehicle: "Unassigned",
            eta: "--",
            delayMins: 0,
          }))
        );

        const normalizedVehicles = Array.isArray(fleetVehicles)
          ? fleetVehicles.map((vehicle) => ({
              id: vehicle.id || vehicle.vehicleId || vehicle.plateNumber || vehicle.registrationNumber,
              label: vehicle.name || vehicle.plateNumber || vehicle.registrationNumber || `Vehicle ${vehicle.id}`,
            }))
          : [];

        const safeVehicles = normalizedVehicles.filter((vehicle) => vehicle.id);
        setVehicles(safeVehicles);
        setVehicleStatus([
          { label: "Available", value: safeVehicles.length, tone: "success" },
          { label: "In Use", value: 0, tone: "warning" },
          { label: "Maintenance", value: 0, tone: "critical" },
        ]);
        setUtilizationData([]);
        setMaintenanceRows([]);
        setTripCompletionTrend([]);
        setFuelEfficiencyRows([]);
        setStaffTrendRows([]);
        setDriverAvailability([]);
        setIncidents([]);
        setAdminActions([]);
      } catch (error) {
        setRequestsError(error.message || "Could not sync admin reads from API.");
        addToast("error", "Failed to load some admin data from backend.");
      } finally {
        setRequestsLoading(false);
      }
    }

    loadAdminReads();
  }, []);

  const requestColumns = [
    {
      key: "id",
      label: "Request",
      searchable: true,
      sortable: true,
      render: (row) => <span className="font-semibold text-teal-700">{row.id}</span>,
    },
    { key: "requester", label: "Requester", searchable: true, sortable: true },
    { key: "department", label: "Department", searchable: true, sortable: true },
    { key: "urgency", label: "Urgency", sortable: true, render: (row) => <StatusBadge status={row.urgency} /> },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status", sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => handleApprove(row)}
            className="rounded-md border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleAssign(row)}
            className="rounded-md border border-teal-200 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
          >
            Assign
          </button>
          <button
            type="button"
            onClick={() => askDecline(row)}
            className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Decline
          </button>
        </div>
      ),
    },
  ];

  const tripColumns = [
    {
      key: "id",
      label: "Trip",
      searchable: true,
      sortable: true,
      render: (row) => <span className="font-semibold text-teal-700">{row.id}</span>,
    },
    { key: "route", label: "Route", searchable: true, sortable: true },
    { key: "driver", label: "Driver", searchable: true, sortable: true },
    { key: "vehicle", label: "Vehicle", searchable: true, sortable: true },
    { key: "state", label: "State", sortable: true, render: (row) => <StatusBadge status={row.state} /> },
    { key: "eta", label: "ETA", sortable: true },
    { key: "delayMins", label: "Delay (min)", sortable: true },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => investigateTrip(row)}
            className="rounded-md border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50"
          >
            Investigate
          </button>
          <button
            type="button"
            onClick={() => askCancelTrip(row)}
            className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  const incidentColumns = [
    { key: "id", label: "Incident", searchable: true, sortable: true, render: (row) => <span className="font-semibold text-teal-700">{row.id}</span> },
    { key: "category", label: "Category", searchable: true, sortable: true },
    { key: "tripRef", label: "Trip Ref", searchable: true, sortable: true },
    { key: "severity", label: "Severity", sortable: true, render: (row) => <StatusBadge status={row.severity} /> },
    { key: "detail", label: "Detail", searchable: true, sortable: false },
    { key: "status", label: "Status", sortable: true, render: (row) => <StatusBadge status={row.status} /> },
  ];

  const governanceColumns = [
    { key: "id", label: "Action ID", searchable: true, sortable: true, render: (row) => <span className="font-semibold text-teal-700">{row.id}</span> },
    { key: "actor", label: "Actor", searchable: true, sortable: true },
    { key: "action", label: "Action", searchable: true, sortable: false },
    { key: "target", label: "Target", searchable: true, sortable: true },
    { key: "time", label: "Time", sortable: true },
    { key: "outcome", label: "Outcome", sortable: true, render: (row) => <StatusBadge status={row.outcome} /> },
  ];

  const requestFilters = [
    {
      key: "role",
      label: "Role",
      options: ["All", ...Array.from(new Set(requests.map((request) => request.role))).filter(Boolean)],
    },
    {
      key: "department",
      label: "Department",
      options: ["All", ...Array.from(new Set(requests.map((request) => request.department))).filter(Boolean)],
    },
    {
      key: "urgency",
      label: "Urgency",
      options: ["All", ...Array.from(new Set(requests.map((request) => request.urgency))).filter(Boolean)],
    },
    {
      key: "status",
      label: "Status",
      options: ["All", ...Array.from(new Set(requests.map((request) => request.status))).filter(Boolean)],
    },
  ];

  const tripFilters = [
    { key: "state", label: "State", options: ["All", ...Array.from(new Set(tripRows.map((trip) => trip.state))).filter(Boolean)] },
    { key: "vehicle", label: "Vehicle", options: ["All", ...Array.from(new Set(tripRows.map((trip) => trip.vehicle))).filter(Boolean)] },
  ];

  const incidentFilters = [
    { key: "category", label: "Category", options: ["All", ...Array.from(new Set(incidents.map((item) => item.category))).filter(Boolean)] },
    { key: "severity", label: "Severity", options: ["All", ...Array.from(new Set(incidents.map((item) => item.severity))).filter(Boolean)] },
    { key: "status", label: "Status", options: ["All", ...Array.from(new Set(incidents.map((item) => item.status))).filter(Boolean)] },
  ];

  const governanceFilters = [
    { key: "outcome", label: "Outcome", options: ["All", ...Array.from(new Set(adminActions.map((item) => item.outcome))).filter(Boolean)] },
  ];

  async function handleApprove(request) {
    try {
      await approveTripRequest(request.id);
      setRequests((prev) => prev.map((item) => (item.id === request.id ? { ...item, status: "Approved" } : item)));
      addToast("success", `Request ${request.id} approved.`);
    } catch (error) {
      addToast("error", error.message || `Failed to approve ${request.id}.`);
    }
  }

  async function handleAssign(request) {
    try {
      await createAssignment({
        tripRequestId: request.id,
        destination: request.destination,
        status: "ASSIGNED",
      });
      setRequests((prev) => prev.map((item) => (item.id === request.id ? { ...item, status: "Assigned" } : item)));
      addToast("success", `Request ${request.id} assigned to transport desk.`);
    } catch (error) {
      addToast("error", error.message || `Failed to assign ${request.id}.`);
    }
  }

  function askDecline(request) {
    setConfirmDialog({
      title: "Decline Request",
      description: `Are you sure you want to decline ${request.id}? This action is destructive and will notify the requester.`,
      confirmLabel: "Decline Request",
      tone: "critical",
      onConfirm: async () => {
        try {
          await rejectTripRequest(request.id);
          setRequests((prev) => prev.map((item) => (item.id === request.id ? { ...item, status: "Declined" } : item)));
          addToast("error", `Request ${request.id} declined.`);
        } catch (error) {
          addToast("error", error.message || `Failed to decline ${request.id}.`);
        }
      },
    });
  }

  function askCancelTrip(trip) {
    setConfirmDialog({
      title: "Cancel Trip",
      description: `Cancel ${trip.id} for ${trip.route}? The driver and request owner will receive cancellation alerts.`,
      confirmLabel: "Cancel Trip",
      tone: "critical",
      onConfirm: async () => {
        try {
          await updateAssignmentStatus(trip.id, "CANCELED");
          addToast("error", `${trip.id} canceled and escalation logged.`);
        } catch (error) {
          addToast("error", error.message || `Failed to cancel ${trip.id}.`);
        }
      },
    });
  }

  async function investigateTrip(trip) {
    setActiveTab("incidents");
    setInvestigatedTrip(trip.id);
    try {
      const [tripLogs, singleLog] = await Promise.all([
        getTripLogsByTripRequestId(trip.id).catch(() => []),
        getTripLogById(trip.id).catch(() => null),
      ]);
      const totalLogs = (Array.isArray(tripLogs) ? tripLogs.length : 0) + (singleLog ? 1 : 0);
      addToast("warning", `Investigating ${trip.id}. Loaded ${totalLogs} trip log entries.`);
    } catch (error) {
      addToast("warning", `Investigating ${trip.id}. Trip logs are not available yet.`);
    }
  }

  async function loadFuelRecords() {
    if (!selectedVehicleId) {
      addToast("warning", "Select a vehicle first.");
      return;
    }

    setFuelLoading(true);
    try {
      const rows = await getFuelRecordsByVehicle(selectedVehicleId);
      setFuelRecords(Array.isArray(rows) ? rows : []);
      addToast("success", `Loaded fuel records for ${selectedVehicleId}.`);
    } catch (error) {
      setFuelRecords([]);
      addToast("error", error.message || "Could not load fuel records for selected vehicle.");
    } finally {
      setFuelLoading(false);
    }
  }

  async function handleRoleUpdate() {
    if (!roleUpdateForm.userId.trim()) {
      addToast("warning", "Enter a user ID before updating role.");
      return;
    }

    try {
      await updateUserRole(roleUpdateForm.userId.trim(), roleUpdateForm.role);
      addToast("success", `Updated user ${roleUpdateForm.userId.trim()} role to ${roleUpdateForm.role}.`);
    } catch (error) {
      addToast("error", error.message || "Role update failed.");
    }
  }

  function exportWeeklyCSV() {
    const header = ["Request ID", "Requester", "Department", "Urgency", "Date", "Status"];
    const lines = requests.map((row) => [row.id, row.requester, row.department, row.urgency, row.date, row.status]);
    const csvText = [header, ...lines].map((line) => line.join(",")).join("\n");

    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fleetflow-weekly-report-${reportDates.start}-to-${reportDates.end}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast("success", "Weekly CSV report exported.");
  }

  function exportWeeklyPDF() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("FleetFlow Weekly Operations Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Range: ${reportDates.start} to ${reportDates.end}`, 14, 23);
    doc.text(`Pending approvals: ${pendingRequestsCount}`, 14, 30);
    doc.text(`Delayed trips: ${delayedTripsCount}`, 14, 36);

    doc.text("Requests Snapshot", 14, 46);
    requests.slice(0, 6).forEach((row, index) => {
      doc.text(`${row.id} | ${row.department} | ${row.urgency} | ${row.status}`, 14, 54 + index * 6);
    });

    doc.save(`fleetflow-weekly-report-${reportDates.start}-to-${reportDates.end}.pdf`);
    addToast("success", "Weekly PDF report exported.");
  }

  const overviewPanel = (
    <div className="space-y-4 md:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Dashboard Blueprint</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Information Architecture</p>
            <p className="mt-1 text-xs text-slate-600">Overview, operations monitor, approvals, fleet control, analytics, incidents, reports, and governance.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Page Layout Blueprint</p>
            <p className="mt-1 text-xs text-slate-600">Left sidebar navigation, sticky top header, and modular content sections for quick decision-making.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Visual Style Spec</p>
            <p className="mt-1 text-xs text-slate-600">Slate surfaces, teal accents, rounded cards, thin borders, subtle shadows, and consistent status colors.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Component Inventory</p>
            <p className="mt-1 text-xs text-slate-600">KPI cards, sortable tables, filters, pagination, confirmation dialogs, toast feedback, and report actions.</p>
          </article>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Approve Request</p>
            <p className="mt-1 text-xs text-slate-600">Review request context, apply filters, and use quick actions to approve, decline, or assign.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Investigate Delayed Trip</p>
            <p className="mt-1 text-xs text-slate-600">Open operations monitor, escalate from delayed trip row, and resolve in incidents queue.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Export Weekly Report</p>
            <p className="mt-1 text-xs text-slate-600">Set date range, export CSV/PDF instantly, and follow scheduled weekly report settings.</p>
          </article>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                <card.icon size={16} />
              </div>
              <span className={trendClass(card.trendType)}>{card.trend}</span>
            </div>
            <p className="text-xs text-slate-400">{card.label}</p>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Real-Time Operations Snapshot</h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Live
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <CompactStatusCard title="Driver Availability" rows={driverAvailability} />
            <CompactStatusCard title="Vehicle Status" rows={vehicleStatus} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Open Alerts</h3>
          {incidents.filter((incident) => incident.status !== "Closed").length === 0 ? (
            <p className="text-xs text-slate-500">No open incidents returned by backend.</p>
          ) : (
            <div className="space-y-3">
              {incidents
                .filter((incident) => incident.status !== "Closed")
                .slice(0, 3)
                .map((incident) => (
                  <div key={incident.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700">{incident.id}</span>
                      <StatusBadge status={incident.severity} />
                    </div>
                    <p className="text-xs text-slate-500">{incident.detail}</p>
                  </div>
                ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-100 p-2 text-slate-700 md:p-4">
      <div className="mx-auto flex min-h-screen max-w-[1320px] flex-col overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-sm lg:flex-row">
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-[260px] lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-100 p-4 md:p-5">
            <div className="mb-1 flex items-center gap-2 text-teal-700">
              <Bus size={16} />
              <p className="text-sm font-bold">FLEETflow</p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Admin Operations Center</p>
          </div>

          <nav className="flex-1 p-3 md:p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
              {navItems
                .filter((item) => item.key !== "governance")
                .map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm lg:w-full lg:gap-3 ${
                      activeTab === item.key ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-500 hover:bg-slate-100"
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
              onClick={() => setActiveTab("governance")}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm lg:gap-3 ${
                activeTab === "governance" ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Settings size={16} />
              Governance
            </button>
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
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search trips, requests, drivers, incidents..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-600 outline-none placeholder:text-slate-400 focus:border-teal-400"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 md:gap-5">
              <button type="button" className="relative text-slate-500 hover:text-slate-700" aria-label="Notifications">
                <Bell size={16} />
                <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500" />
              </button>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-700">Avery Mwangi</p>
                <p className="text-[11px] text-slate-400">System Admin</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-teal-200/80" />
            </div>
          </header>

          <div className="space-y-4 p-3 md:space-y-6 md:p-5">
            {activeTab === "overview" && overviewPanel}

            {activeTab === "operations" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <h2 className="mb-1 text-sm font-semibold text-slate-700">Real-Time Operations Monitor</h2>
                <p className="mb-4 text-xs text-slate-500">Track live trip states with driver and vehicle readiness for dispatch decisions.</p>
                <SmartTable
                  title="Live Trip States"
                  columns={tripColumns}
                  rows={tripRows}
                  filters={tripFilters}
                  pageSize={4}
                  initialLoadDelay={0}
                />
              </section>
            )}

            {activeTab === "approvals" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">Unified Request & Approval Center</h2>
                    <p className="text-xs text-slate-500">Pending requests across departments with quick approve, decline, and assign actions.</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                    {pendingRequestsCount} Pending
                  </span>
                </div>
                {requestsLoading && (
                  <p className="mb-3 text-xs text-slate-500">Syncing approval queue from backend...</p>
                )}
                {requestsError && (
                  <p className="mb-3 text-xs text-rose-600">{requestsError}</p>
                )}
                <SmartTable
                  title="Pending Requests"
                  columns={requestColumns}
                  rows={requests}
                  filters={requestFilters}
                  pageSize={5}
                  initialLoadDelay={900}
                />
              </section>
            )}

            {activeTab === "fleet" && (
              <div className="space-y-4">
                <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold text-slate-700">Fleet Utilization</h2>
                    {utilizationData.length === 0 ? (
                      <p className="text-xs text-slate-500">No utilization data returned by backend.</p>
                    ) : (
                      <div className="space-y-3">
                        {utilizationData.map((item) => (
                          <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                              <span>{item.label}</span>
                              <span className="font-semibold text-slate-700">{item.utilization}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${item.utilization}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="mb-3 text-sm font-semibold text-slate-700">Upcoming & Overdue Maintenance</h2>
                    {maintenanceRows.length === 0 ? (
                      <p className="text-xs text-slate-500">No maintenance records returned by backend.</p>
                    ) : (
                      <div className="space-y-3">
                        {maintenanceRows.map((row) => (
                          <div key={`${row.unit}-${row.schedule}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-700">{row.unit}</p>
                              <StatusBadge status={row.status} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Due: {row.schedule}</p>
                            <p className="text-xs text-slate-500">Health: <span className="font-semibold text-slate-700">{row.health}</span></p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-semibold text-slate-700">Fuel Records by Vehicle</h2>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                    <label className="relative inline-flex items-center">
                      <Fuel size={12} className="pointer-events-none absolute left-2 text-slate-400" />
                      <select
                        value={selectedVehicleId}
                        onChange={(event) => setSelectedVehicleId(event.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-7 pr-8 text-sm text-slate-600 outline-none focus:border-teal-400"
                      >
                        <option value="">Select vehicle...</option>
                        {vehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="pointer-events-none absolute right-2 text-slate-400" />
                    </label>
                    <button
                      type="button"
                      onClick={loadFuelRecords}
                      className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                    >
                      Load Fuel Records
                    </button>
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    {fuelLoading ? (
                      <p className="text-xs text-slate-500">Loading fuel records...</p>
                    ) : fuelRecords.length === 0 ? (
                      <p className="text-xs text-slate-500">No fuel records loaded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {fuelRecords.slice(0, 5).map((record, index) => (
                          <div key={record.id || index} className="flex items-center justify-between text-xs text-slate-600">
                            <span>{record.date || record.createdAt || "Record"}</span>
                            <span className="font-semibold text-slate-700">{record.liters || record.amount || "-"} L</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-sm font-semibold text-slate-700">Trip Completion Trends</h2>
                  {tripCompletionTrend.length === 0 ? (
                    <p className="text-xs text-slate-500">No trip completion trend data returned by backend.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                      {tripCompletionTrend.map((row) => (
                        <div key={row.day} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{row.day}</p>
                          <p className="mt-2 text-lg font-bold text-emerald-600">{row.onTime}</p>
                          <p className="text-[11px] text-slate-500">On-time</p>
                          <p className="mt-1 text-sm font-semibold text-amber-600">{row.delayed}</p>
                          <p className="text-[11px] text-slate-500">Delayed</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">Fuel Efficiency by Driver/Vehicle</h3>
                    {fuelEfficiencyRows.length === 0 ? (
                      <p className="text-xs text-slate-500">No fuel efficiency analytics returned by backend.</p>
                    ) : (
                      <div className="space-y-3">
                        {fuelEfficiencyRows.map((row) => (
                          <div key={row.subject} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div className="mb-1 flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-700">{row.subject}</p>
                              <span className="text-xs font-semibold text-slate-700">{row.efficiency} km/L</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(100, row.efficiency * 7)}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>

                  <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">Staff Request Trends</h3>
                    {staffTrendRows.length === 0 ? (
                      <p className="text-xs text-slate-500">No staff trend analytics returned by backend.</p>
                    ) : (
                      <div className="space-y-2">
                        {staffTrendRows.map((row) => (
                          <div key={row.department} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-xs font-semibold text-slate-700">{row.department}</p>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-800">{row.weeklyRequests}</p>
                              <p className="text-[11px] text-slate-500">{row.change} week over week</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                </section>
              </div>
            )}

            {activeTab === "incidents" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-700">Incidents & Alerts</h2>
                    <p className="text-xs text-slate-500">Delay, safety, fuel anomaly, and policy violations for rapid triage.</p>
                  </div>
                  {investigatedTrip && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                      Investigating {investigatedTrip}
                    </span>
                  )}
                </div>
                <SmartTable
                  title="Incident Queue"
                  columns={incidentColumns}
                  rows={incidents}
                  filters={incidentFilters}
                  pageSize={4}
                  initialLoadDelay={950}
                />
              </section>
            )}

            {activeTab === "reports" && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <h2 className="text-sm font-semibold text-slate-700">Reports & Exports</h2>
                <p className="mt-1 text-xs text-slate-500">Generate date-range reports and export to CSV or PDF. Schedule support is staged for backend integration.</p>

                <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-4">
                  <InputField
                    label="Start Date"
                    value={reportDates.start}
                    onChange={(value) => setReportDates((prev) => ({ ...prev, start: value }))}
                  />
                  <InputField
                    label="End Date"
                    value={reportDates.end}
                    onChange={(value) => setReportDates((prev) => ({ ...prev, end: value }))}
                  />
                  <ActionButton icon={FileDown} label="Export CSV" onClick={exportWeeklyCSV} />
                  <ActionButton icon={FileText} label="Export PDF" onClick={exportWeeklyPDF} />
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scheduled Reports</h3>
                  <p className="mt-2 text-sm text-slate-600">Schedule source: <span className="font-semibold text-slate-800">Backend configuration required</span></p>
                  <p className="text-sm text-slate-600">Recipients: <span className="font-semibold text-slate-800">Not loaded</span></p>
                </div>
              </section>
            )}

            {activeTab === "governance" && (
              <div className="space-y-4">
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                  <h2 className="mb-3 text-sm font-semibold text-slate-700">Admin Governance Panel</h2>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">User Management</p>
                      <p className="mt-2 text-sm text-slate-600">Active users: <span className="font-semibold text-slate-800">--</span></p>
                      <p className="text-sm text-slate-600">Pending invites: <span className="font-semibold text-amber-700">--</span></p>
                      <div className="mt-3 space-y-2">
                        <input
                          type="text"
                          value={roleUpdateForm.userId}
                          onChange={(event) => setRoleUpdateForm((prev) => ({ ...prev, userId: event.target.value }))}
                          placeholder="User ID"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-teal-400"
                        />
                        <div className="flex gap-2">
                          <select
                            value={roleUpdateForm.role}
                            onChange={(event) => setRoleUpdateForm((prev) => ({ ...prev, role: event.target.value }))}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-teal-400"
                          >
                            <option value="DEAN">DEAN</option>
                            <option value="TRANSPORT_MANAGER">TRANSPORT_MANAGER</option>
                            <option value="DRIVER">DRIVER</option>
                            <option value="STAFF">STAFF</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <button
                            type="button"
                            onClick={handleRoleUpdate}
                            className="rounded-lg border border-teal-200 bg-teal-50 px-2 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role Permissions</p>
                      <p className="mt-2 text-sm text-slate-600">Custom role rules: <span className="font-semibold text-slate-800">--</span></p>
                      <p className="text-sm text-slate-600">Recent changes: <span className="font-semibold text-teal-700">--</span></p>
                    </article>
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Health</p>
                      <div className="mt-2 space-y-1.5">
                        {systemHealth.map((service) => (
                          <div key={service.name} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">{service.name}</span>
                            <StatusBadge status={service.status} />
                          </div>
                        ))}
                      </div>
                    </article>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                  <SmartTable
                    title="Recent Admin Actions"
                    columns={governanceColumns}
                    rows={adminActions}
                    filters={governanceFilters}
                    pageSize={4}
                    initialLoadDelay={900}
                  />
                </section>
              </div>
            )}
          </div>
        </section>
      </div>

      {confirmDialog && (
        <ConfirmDialog
          {...confirmDialog}
          onClose={() => setConfirmDialog(null)}
          onConfirm={() => {
            confirmDialog.onConfirm();
            setConfirmDialog(null);
          }}
        />
      )}

      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} type={toast.type} message={toast.message} />
        ))}
      </div>
    </main>
  );
}

function SmartTable({ title, columns, rows, filters, pageSize = 5, initialLoadDelay = 0 }) {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(
    () => filters?.reduce((acc, filter) => ({ ...acc, [filter.key]: "All" }), {}) || {}
  );
  const [sort, setSort] = useState({ key: "", direction: "asc" });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("ready");
    }, initialLoadDelay);
    return () => clearTimeout(timer);
  }, [initialLoadDelay]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedFilters, sort]);

  const processedRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = rows.filter((row) => {
      const matchesQuery = !normalizedQuery
        || columns.some((column) => {
          if (!column.searchable) return false;
          const value = String(row[column.key] ?? "").toLowerCase();
          return value.includes(normalizedQuery);
        });

      const matchesFilters = (filters || []).every((filter) => {
        const current = selectedFilters[filter.key];
        if (!current || current === "All") return true;
        return String(row[filter.key]) === current;
      });

      return matchesQuery && matchesFilters;
    });

    if (!sort.key) return filtered;

    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];

      if (typeof av === "number" && typeof bv === "number") {
        return sort.direction === "asc" ? av - bv : bv - av;
      }

      return sort.direction === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, columns, filters, query, selectedFilters, sort]);

  const totalPages = Math.max(1, Math.ceil(processedRows.length / pageSize));
  const currentRows = processedRows.slice((page - 1) * pageSize, page * pageSize);

  const setFilterValue = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  };

  const retryLoad = () => {
    setStatus("loading");
    setTimeout(() => setStatus("ready"), 600);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="w-36 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2 text-xs text-slate-600 outline-none focus:border-teal-400 md:w-44"
            />
          </div>
          {(filters || []).map((filter) => (
            <label key={filter.key} className="relative inline-flex items-center">
              <Filter size={12} className="pointer-events-none absolute left-2 text-slate-400" />
              <select
                value={selectedFilters[filter.key] || "All"}
                onChange={(event) => setFilterValue(filter.key, event.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-6 pr-7 text-xs text-slate-600 outline-none focus:border-teal-400"
              >
                {filter.options.map((option) => (
                  <option key={`${filter.key}-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 text-slate-400" />
            </label>
          ))}
        </div>
      </div>

      {status === "loading" && <TableState type="loading" message="Loading table data..." />}
      {status === "error" && <TableState type="error" message="Could not load table data." onRetry={retryLoad} />}

      {status === "ready" && processedRows.length === 0 && <TableState type="empty" message="No records match your current filters." />}

      {status === "ready" && processedRows.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className={`px-3 py-2 font-semibold ${column.key === "actions" ? "text-right" : ""}`}>
                      {column.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700"
                        >
                          <span>{column.label}</span>
                          {sort.key === column.key && <span>{sort.direction === "asc" ? "^" : "v"}</span>}
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.id || JSON.stringify(row)} className="border-t border-slate-100">
                    {columns.map((column) => (
                      <td
                        key={`${row.id || row[column.key]}-${column.key}`}
                        className={`px-3 py-2 text-xs text-slate-600 ${column.key === "actions" ? "text-right" : ""}`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <p>
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, processedRows.length)} of {processedRows.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                {page}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TableState({ type, message, onRetry }) {
  const iconByType = {
    loading: <Clock3 size={16} className="text-amber-600" />,
    empty: <CalendarDays size={16} className="text-slate-500" />,
    error: <XCircle size={16} className="text-rose-600" />,
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-4 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        {iconByType[type]}
        <span>{message}</span>
      </div>
      {type === "error" && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-teal-200 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
        >
          Retry
        </button>
      )}
    </div>
  );
}

function CompactStatusCard({ title, rows }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-500">No backend data.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{row.label}</span>
              <span className={metricPillClass(row.tone)}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <label>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="relative">
        <CalendarDays size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-2 text-sm text-slate-600 outline-none focus:border-teal-400"
        />
      </div>
    </label>
  );
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function ConfirmDialog({ title, description, confirmLabel, tone, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-center gap-2 text-slate-700">
          <AlertTriangle size={16} className={tone === "critical" ? "text-rose-600" : "text-amber-600"} />
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold text-white ${
              tone === "critical" ? "bg-rose-600 hover:bg-rose-700" : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ type, message }) {
  return (
    <div className={`pointer-events-auto rounded-lg border px-3 py-2 text-sm shadow-sm ${toastClass(type)}`}>
      {message}
    </div>
  );
}

function normalizeTripStatus(status) {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "APPROVED") return "Approved";
  if (normalized === "REJECTED") return "Declined";
  if (normalized === "ASSIGNED") return "Assigned";
  if (normalized === "PENDING") return "Pending";
  return status ? String(status) : "Pending";
}

function normalizeUrgency(urgency) {
  const normalized = String(urgency || "").toUpperCase();
  if (normalized === "CRITICAL") return "Critical";
  if (normalized === "HIGH") return "High";
  if (normalized === "MEDIUM") return "Medium";
  if (normalized === "LOW") return "Low";
  return "Medium";
}

function normalizeRole(role) {
  const normalized = String(role || "").toUpperCase();
  if (normalized === "DEAN") return "Dean";
  if (normalized === "TRANSPORT_MANAGER") return "Transport Manager";
  if (normalized === "DRIVER") return "Driver";
  if (normalized === "ADMIN") return "Admin";
  if (normalized === "STAFF") return "Staff";
  return "Staff";
}

function normalizeDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toISOString().slice(0, 10);
}

function trendClass(type) {
  if (type === "success") return "text-xs font-semibold text-emerald-600";
  if (type === "warning") return "text-xs font-semibold text-amber-600";
  return "text-xs font-semibold text-rose-600";
}

function metricPillClass(tone) {
  if (tone === "success") return "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700";
  if (tone === "warning") return "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700";
  if (tone === "critical") return "rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700";
  return "rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700";
}

function toastClass(type) {
  if (type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (type === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function StatusBadge({ status }) {
  const normalized = String(status).toLowerCase();

  const className = (() => {
    if (["approved", "completed", "healthy", "good", "success", "open", "available", "ongoing", "upcoming"].includes(normalized)) {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    if (["warning", "pending", "assigned", "investigating", "latency", "fair", "medium", "high", "delayed", "in use", "reviewed"].includes(normalized)) {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }
    return "border-rose-200 bg-rose-50 text-rose-700";
  })();

  const icon = normalized === "critical" || normalized === "declined" || normalized === "degraded"
    ? <XCircle size={12} />
    : normalized === "warning" || normalized === "pending" || normalized === "delayed"
      ? <TriangleAlert size={12} />
      : <CheckCircle2 size={12} />;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      {icon}
      {status}
    </span>
  );
}
