import { useState } from "react";

const DeclineConfirmation = ({ requestId, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800">Decline Request #{requestId}</h3>
        <p className="mt-2 text-sm text-slate-500">
          Provide a reason for declining this request. This message can be shown to the requester.
        </p>

        <textarea
          placeholder="Enter reason (e.g. Vehicle unavailable, schedule conflict...)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-4 min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-400"
        />

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            onClick={onCancel}
          >
            Back
          </button>
          <button
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            onClick={() => onConfirm(requestId, reason)}
            disabled={!reason.trim()}
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineConfirmation;
