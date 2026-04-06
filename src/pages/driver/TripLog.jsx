import { useState } from "react";
import { endTripLog, startTripLog } from "../../api/tripLogs";

export default function TripLog() {
  const [assignmentId, setAssignmentId] = useState("");
  const [startMileage, setStartMileage] = useState("");
  const [tripLogId, setTripLogId] = useState("");
  const [endMileage, setEndMileage] = useState("");
  const [comments, setComments] = useState("");

  const handleStart = async (event) => {
    event.preventDefault();

    try {
      const created = await startTripLog({
        assignmentId: Number(assignmentId),
        startMileage: Number(startMileage),
      });
      setTripLogId(String(created.id));
      window.alert(`Trip started. Trip log ID: ${created.id}`);
    } catch (error) {
      window.alert(error.message || "Failed to start trip log.");
    }
  };

  const handleEnd = async (event) => {
    event.preventDefault();

    try {
      await endTripLog(Number(tripLogId), {
        endMileage: Number(endMileage),
        comments,
      });
      window.alert("Trip ended successfully.");
    } catch (error) {
      window.alert(error.message || "Failed to end trip log.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold mb-4 text-slate-800">Start Trip Log</h1>
          <form onSubmit={handleStart} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-slate-600">
              Assignment ID
              <input
                type="number"
                value={assignmentId}
                onChange={(event) => setAssignmentId(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                required
              />
            </label>

            <label className="text-sm text-slate-600">
              Start Mileage
              <input
                type="number"
                value={startMileage}
                onChange={(event) => setStartMileage(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                required
              />
            </label>

            <button
              type="submit"
              className="md:col-span-2 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Start Trip
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-800">End Trip Log</h2>
          <form onSubmit={handleEnd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-slate-600">
              Trip Log ID
              <input
                type="number"
                value={tripLogId}
                onChange={(event) => setTripLogId(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                required
              />
            </label>

            <label className="text-sm text-slate-600">
              End Mileage
              <input
                type="number"
                value={endMileage}
                onChange={(event) => setEndMileage(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                required
              />
            </label>

            <label className="text-sm text-slate-600 md:col-span-2">
              Comments
              <textarea
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                rows={3}
              />
            </label>

            <button
              type="submit"
              className="md:col-span-2 rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              End Trip
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
