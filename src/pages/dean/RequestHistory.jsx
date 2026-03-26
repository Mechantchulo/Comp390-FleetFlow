import React, { useState, useEffect } from 'react';

const RequestHistory = () => {
  // 1. Initializing with Mock Data so you can see the table immediately
  const [history, setHistory] = useState([
    { id: "REQ-001", staff: "John Doe", dest: "Nairobi HQ", date: "2026-03-20", status: "Approved" },
    { id: "REQ-002", staff: "Jane Smith", dest: "Mombasa Branch", date: "2026-03-22", status: "Pending" },
    { id: "REQ-003", staff: "Alex Wong", dest: "Kisumu Office", date: "2026-03-24", status: "Cancelled" },
    { id: "REQ-004", staff: "Sarah Muse", dest: "Nakuru Hub", date: "2026-03-25", status: "Approved" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Logic to filter data based on the search bar input
  const filteredHistory = history.filter(item => 
    item.staff.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.dest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Request History</h1>
        <p>View and manage all historical transport requests and their status.</p>
      </div>

      <div className="table-card">
        <div className="table-actions">
          <h3>All Request History</h3>
          <input 
            type="text" 
            placeholder="Search staff or destination..." 
            className="search-bar" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="history-table">
          <thead>
            <tr>
              <th>REQUEST ID</th>
              <th>STAFF NAME</th>
              <th>DESTINATION</th>
              <th>ACTION DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.staff}</td>
                  <td>{item.dest}</td>
                  <td>{item.date}</td>
                  <td>
                
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      ● {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No records match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="table-footer">
          Showing {filteredHistory.length} historical records
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;