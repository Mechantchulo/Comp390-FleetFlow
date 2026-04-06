import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { LayoutDashboard, History, User, Settings, LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom'; 
const DeanDashboard = () => {
  const [requests, setRequests] = useState([])
  const [user, setUser] = useState({
    name: "Dr. Jane Doe"
  });
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-800">
   
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-[#2A9D8F] p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <h2 className="text-xl font-bold text-[#2A9D8F] uppercase tracking-wider">
            Fleetflow
          </h2>
        </div>
        <nav className="flex-1 space-y-4">
          <Link to="/dashboard/department_dean" className="flex items-center gap-3 text-[#2A9D8F] font-semibold bg-[#E6F4F1] p-3 rounded-lg">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/dean/pending" className="flex items-center gap-3 text-gray-500 hover:text-[#2A9D8F] p-3">
            <History size={18} /> Pending requests
          </Link>
          <Link to="/dean/history" className="flex items-center gap-3 text-gray-500 hover:text-[#2A9D8F] p-3">
            <History size={18} /> Request History
          </Link>
          <Link to="/dean/profile" className="flex items-center gap-3 text-gray-500 hover:text-[#2A9D8F] p-3">
            <User size={18} /> Profile
          </Link>
        </nav>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center gap-3 text-gray-500 p-3 cursor-pointer">
            <Settings size={18} /> Settings
          </div>
          <div className="flex items-center gap-3 text-red-500 p-3 cursor-pointer">
            <LogOut size={18} /> Logout
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Dean Approval Dashboard
            </h1>
            <p className="text-gray-500">
              Manage departmental transport requests and review history.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.faculty}</p>
            </div>
            <div className="w-12 h-12 bg-[#2A9D8F] rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Pending"
            count="12"
            icon={<Clock className="text-yellow-500" />}
            change="+5% from last week"
          />
          <StatCard
            title="Approved Today"
            count="08"
            icon={<CheckCircle className="text-green-500" />}
            change="+12% from yesterday"
          />
          <StatCard
            title="Declined Today"
            count="02"
            icon={<XCircle className="text-red-500" />}
            change="-2% from yesterday"
          />
        </section>

        {/* REQUESTS TABLE */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Pending Requests</h3>
            <button className="text-[#2A9D8F] text-sm font-semibold hover:underline">
              View All
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                <th className="pb-4">Request ID</th>
                <th className="pb-4">Requester</th>
                <th className="pb-4">Purpose</th>
                <th className="pb-4">Date & Dest.</th>
                <th className="pb-4 text-center">Pax</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req.id} className="text-sm"></tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <p className="font-medium text-gray-500">
                        No pending requests
                      </p>
                      <p className="text-xs">
                        Everything is currently up to date.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </section>
      </main>
    </div>
  );
};


// STAT CARD COMPONENT
const StatCard = ({ title, count, icon, change }) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-2">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold">{count}</p>
      </div>
      <div className="bg-[#E6F4F1] p-2 rounded-lg">
        {icon}
      </div>
    </div>
    <p className="text-xs text-gray-400 font-medium">
      <span className={change.includes('+') ? 'text-green-500' : 'text-red-400'}>
        {change.split(' ')[0]}
      </span>
      {" "}{change.split(' ').slice(1).join(' ')}
    </p>
  </div>
);

export default DeanDashboard;
