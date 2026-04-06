import { useEffect, useMemo, useState } from "react";
import { listTripRequests } from "../../api/trips";

function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

const RequestHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await listTripRequests();
        setHistory(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load request history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return history.filter((item) => {
      if (!query) return true;
      return (
        String(item.requesterName || "").toLowerCase().includes(query) ||
        String(item.destination || "").toLowerCase().includes(query)
      );
    });
  }, [history, searchTerm]);

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
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                  Loading request history...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
                  {error}
                </td>
              </tr>
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>{item.requesterName || "Unknown"}</td>
                  <td>{item.destination || "-"}</td>
                  <td>{formatDate(item.departureTime)}</td>
                  <td>
                    <span className={`status-badge ${String(item.status || "").toLowerCase()}`}>
                      ● {item.status || "UNKNOWN"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                  No records match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">Showing {filteredHistory.length} historical records</div>
      </div>
    </div>
  );
};

export default RequestHistory;
