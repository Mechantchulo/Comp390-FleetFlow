import { useState } from "react";
import { createFuelRecord } from "../../api/fuelRecords";

export default function FuelLogs() {
  const [form, setForm] = useState({
    vehicleId: "",
    tripLogId: "",
    fuelAmount: "",
    fuelCost: "",
    fuelStation: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createFuelRecord({
        vehicleId: Number(form.vehicleId),
        tripLogId: form.tripLogId ? Number(form.tripLogId) : null,
        fuelAmount: Number(form.fuelAmount),
        fuelCost: Number(form.fuelCost),
        fuelStation: form.fuelStation,
      });
      window.alert("Fuel record submitted.");
      setForm({ vehicleId: "", tripLogId: "", fuelAmount: "", fuelCost: "", fuelStation: "" });
    } catch (error) {
      window.alert(error.message || "Failed to submit fuel record.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Fuel Logs</h1>
        <p className="mt-1 text-sm text-slate-500">Submit fuel usage records to backend.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Vehicle ID
            <input
              name="vehicleId"
              type="number"
              required
              value={form.vehicleId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-600">
            Trip Log ID (optional)
            <input
              name="tripLogId"
              type="number"
              value={form.tripLogId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-600">
            Fuel Amount
            <input
              name="fuelAmount"
              type="number"
              step="0.01"
              required
              value={form.fuelAmount}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-600">
            Fuel Cost
            <input
              name="fuelCost"
              type="number"
              step="0.01"
              required
              value={form.fuelCost}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-600 md:col-span-2">
            Fuel Station
            <input
              name="fuelStation"
              required
              value={form.fuelStation}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="md:col-span-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Submit Fuel Record
          </button>
        </form>
      </div>
    </div>
  );
}
