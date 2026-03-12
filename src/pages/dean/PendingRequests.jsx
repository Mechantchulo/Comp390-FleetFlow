import React, { useState } from 'react';
import DeclineConfirmation from './DeclineConfirmation';

const PendingRequests = () => {

  const [requests, setRequests] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleApprove = (id) => {
    console.log("Approved request:", id);
  };

  const openDeclineModal = (id) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const handleFinalDecline = (id, reason) => {
    console.log(`Request ${id} declined. Reason: ${reason}`);

    setRequests(requests.filter(req => req.id !== id));
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-8">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📋 Pending Requests
        </h2>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <table className="w-full text-left">

          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
              <th className="pb-4">REQUEST ID</th>
              <th className="pb-4">REQUESTER</th>
              <th className="pb-4">PURPOSE</th>
              <th className="pb-4">DATE & DEST.</th>
              <th className="pb-4">PAX</th>
              <th className="pb-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {requests.length > 0 ? (

              requests.map((req) => (

                <tr key={req.id} className="text-sm">

                  <td className="py-4">{req.id}</td>

                  {/* REQUESTER */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 bg-[#E6F4F1] text-[#2A9D8F] rounded-full flex items-center justify-center font-bold">
                        {req.initials}
                      </div>

                      <div>
                        <p className="font-semibold">{req.name}</p>
                        <p className="text-xs text-gray-400">{req.dept}</p>
                      </div>

                    </div>
                  </td>

                  <td className="py-4">{req.purpose}</td>

                  <td className="py-4">
                    <p>{req.date}</p>
                    <p className="text-xs text-gray-400">{req.dest}</p>
                  </td>

                  <td className="py-4">{req.pax}</td>

                  {/* ACTION BUTTONS */}
                  <td className="py-4 text-right space-x-2">

                    <button
                      className="bg-[#2A9D8F] text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
                      onClick={() => handleApprove(req.id)}
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm hover:bg-red-100"
                      onClick={() => openDeclineModal(req.id)}
                    >
                      ×
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

      {/* DECLINE MODAL */}
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