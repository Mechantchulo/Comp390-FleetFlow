import React, { useState, useEffect } from 'react';
import './RequestHistory.css';

const RequestHistory = () => {
  // Start with an EMPTY array
  const [history, setHistory] = useState([]);

  // This is where you will eventually fetch data from your SQL DB
  useEffect(() => {
    const fetchHistory = async () => {
      // Once your backend is ready, you'll fetch data here
      // For now, it stays empty ([])
    };
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Request History</h1>
        <p>View and manage all historical transport requests and their final status.</p>
      </div>

      <div className="table-card">
        <div className="table-actions">
          <h3>All Request History</h3>
          <input type="text" placeholder="Search staff or destination..." className="search-bar" />
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
            {history.length > 0 ? (
              history.map((item, index) => (
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
              // This shows when there is no data yet
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No history records found. Logs will appear here once requests are processed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="table-footer">
          Showing {history.length} historical records
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;