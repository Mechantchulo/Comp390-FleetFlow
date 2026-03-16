import React, { useState } from 'react';
import { LayoutDashboard, Fuel, Map, User, Settings, LogOut, Truck } from 'lucide-react';

const DriverDashboard = () => {

  // for storing the trips
  const [trips, setTrips] = useState([]);

  // for trip info inputs
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");

  // for driver stats inputs
  const [activeTrips, setActiveTrips] = useState("");
  const [completedTrips, setCompletedTrips] = useState("");
  const [fuelLogs, setFuelLogs] = useState("");

  const addTrip = () => {

    if (!destination || !date || !passengers) return;

    const newTrip = {
      id: "#TP-" + Math.floor(Math.random() * 1000),
      destination,
      date,
      passengers
    };

    setTrips([...trips, newTrip]);

    setDestination("");
    setDate("");
    setPassengers("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col p-6">

        <div className="flex items-center gap-2 mb-10">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20}/>
          </div>
          <h2 className="text-xl font-bold text-teal-700 uppercase tracking-wider">
            Fleetflow
          </h2>
        </div>

        <nav className="flex-1 space-y-4">
git 
          <div className="flex items-center gap-3 text-teal-600 font-semibold bg-teal-50 p-3 rounded-lg cursor-pointer">
            <LayoutDashboard size={17}/> Overview
          </div>

          <div className="flex items-center gap-3 text-gray-500 hover:text-teal-600 p-3 cursor-pointer">
            <Map size={17}/> Trip Management
          </div>

          <div className="flex items-center gap-3 text-gray-500 hover:text-teal-600 p-3 cursor-pointer">
            <Fuel size={17}/> Fuel Logs
          </div>

          <div className="flex items-center gap-3 text-gray-500 hover:text-teal-600 p-3 cursor-pointer">
            <User size={17}/> Profile
          </div>

        </nav>

        <div className="border-t pt-4 space-y-4">

          <div className="flex items-center gap-3 text-gray-500 p-3 cursor-pointer">
            <Settings size={17}/> Settings
          </div>

          <div className="flex items-center gap-3 text-red-500 p-3 cursor-pointer">
            <LogOut size={17}/> Logout
          </div>

        </div>

      </aside>


      
      <main className="flex-1 p-10">

        
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Driver Overview</h1>
          <p className="text-gray-500">
            Manage your trips and update driver statistics.
          </p>
        </header>


        //Stat inputs
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <StatInput
            title="Active Trips"
            value={activeTrips}
            setValue={setActiveTrips}
          />

          <StatInput
            title="Completed Trips"
            value={completedTrips}
            setValue={setCompletedTrips}
          />

          <StatInput
            title="Fuel Logs"
            value={fuelLogs}
            setValue={setFuelLogs}
          />

        </section>


        {/* ADD TRIP FORM */}
        <section className="bg-white p-6 rounded-2xl border shadow-sm mb-10">

          <h3 className="text-lg font-bold mb-4">Add Trip</h3>

          <div className="flex flex-wrap gap-4">

            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e)=>setDestination(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Passengers"
              value={passengers}
              onChange={(e)=>setPassengers(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              onClick={addTrip}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Add Trip
            </button>

          </div>

        </section>


        {/* TRIPS TABLE */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">

          <h3 className="text-lg font-bold mb-6">Trip List</h3>

          <table className="w-full text-left">

            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b">
                <th className="pb-4">Trip ID</th>
                <th className="pb-4">Destination</th>
                <th className="pb-4">Date</th>
                <th className="pb-4 text-center">Passengers</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {trips.map((trip)=>(
                <tr key={trip.id}>

                  <td className="py-4 text-gray-400">{trip.id}</td>
                  <td className="py-4">{trip.destination}</td>
                  <td className="py-4">{trip.date}</td>
                  <td className="py-4 text-center">{trip.passengers}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
};


const StatInput = ({title,value,setValue}) => (

  <div className="bg-white p-6 rounded-2xl border shadow-sm">

    <p className="text-gray-400 text-sm">{title}</p>

    <input
      type="number"
      value={value}
      onChange={(e)=>setValue(e.target.value)}
      className="border p-2 rounded w-full mt-3"
    />

  </div>

);

export default DriverDashboard;