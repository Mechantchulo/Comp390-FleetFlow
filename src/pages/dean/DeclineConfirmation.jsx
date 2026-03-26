import React, { useState } from 'react';

const DeclineConfirmation = ({ requestId, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");

  return (
    <div className="modal-overlay">
      <div className="decline-modal">
        <h3>Decline Request {requestId}</h3>
        <p>Please provide a reason for declining this transport request. This will be sent to the requester.</p>
        
        <textarea 
          placeholder="Enter reason here (e.g., Vehicle maintenance, Overlapping schedule...)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Back</button>
          <button 
            className="confirm-decline-btn" 
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