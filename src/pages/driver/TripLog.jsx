import { useState } from "react";

export default function TripLog() {
  const [startMileage, setStartMileage] = useState("");
  const [endMileage, setEndMileage] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [comments, setComments] = useState("");

  const distance =
    startMileage && endMileage ? endMileage - startMileage : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (endMileage < startMileage) {
        alert("End Mileage cannot be less than Start Mileage.");
        return;

    }
const distance = endMileage - startMileage;
console.log(distance);

    const tripData = {
      startMileage,
      endMileage,
      distance,
      fuelUsed,
      timestamp,
      comments,
    };

    console.log("Trip Log Submitted:", tripData);

  
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Trip Log Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Start Mileage */}
        <div>
          <label className="block mb-1">Start Mileage</label>
          <input
            type="number"
            value={startMileage}
            onChange={(e) => setStartMileage(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* End Mileage */}
        <div>
          <label className="block mb-1">End Mileage</label>
          <input
            type="number"
            value={endMileage}
            onChange={(e) => setEndMileage(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Distance */}
        <div>
          <label className="block mb-1">Distance Travelled</label>
          <input
            type="number"
            value={distance}
            className="w-full border p-2 rounded bg-gray-100"
            readOnly
          />
        </div>

        {/* Fuel Used */}
        <div>
          <label className="block mb-1">Fuel Used (Litres)</label>
          <input
            type="number"
            value={fuelUsed}
            onChange={(e) => setFuelUsed(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Timestamp */}
        <div>
          <label className="block mb-1">Trip Time</label>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Comments */}
        <div>
          <label className="block mb-1">Driver Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          Submit Trip Log
        </button>

      </form>
    </div>
  );
}