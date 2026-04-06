import { useEffect, useMemo, useState } from "react";
import DeclineConfirmation from "./DeclineConfirmation";
import {
  approveTripRequest,
  listTripRequests,
  rejectTripRequest,
} from "../../api/trips";

function initials(name) {
  if (!name) return "NA";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    async function loadPending() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        setRequests(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load pending requests.");
      } finally {
        setLoading(false);
      }
    }

    loadPending();
  }, []);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "PENDING"),
    [requests]
  );

  const handleApprove = async (id) => {
    try {
      await approveTripRequest(id);
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      window.alert(err.message || "Failed to approve request.");
    }
  };

  const openDeclineModal = (id) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const handleFinalDecline = async (id) => {
    try {
      await rejectTripRequest(id);
      setRequests((prev) => prev.filter((request) => request.id !== id));
      setIsModalOpen(false);
    } catch (err) {
      window.alert(err.message || "Failed to reject request.");
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Requests</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
              <th className="pb-4">REQUEST ID</th>
              <th className="pb-4">REQUESTER</th>
              <th className="pb-4">PURPOSE</th>
              <th className="pb-4">DATE & DEST.</th>
              <th className="pb-4">STATUS</th>
              <th className="pb-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-20 text-center text-gray-400">
                  Loading pending requests...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="py-20 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <tr key={req.id} className="text-sm">
                  <td className="py-4">#{req.id}</td>

                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F4F1] text-[#2A9D8F] rounded-full flex items-center justify-center font-bold">
                        {initials(req.requesterName)}
                      </div>

                      <div>
                        <p className="font-semibold">{req.requesterName || "Unknown"}</p>
                        <p className="text-xs text-gray-400">Requester</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">{req.purpose || "-"}</td>

                  <td className="py-4">
                    <p>{formatDate(req.departureTime)}</p>
                    <p className="text-xs text-gray-400">{req.destination || "-"}</p>
                  </td>

                  <td className="py-4">{req.status}</td>

                  <td className="py-4 text-right space-x-2">
                    <button
                      className="bg-[#2A9D8F] text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm hover:bg-red-100"
                      onClick={() => openDeclineModal(req.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-20 text-center text-gray-400">
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <DeclineConfirmation
          requestId={selectedRequestId}
          onConfirm={handleFinalDecline}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PendingRequests;
