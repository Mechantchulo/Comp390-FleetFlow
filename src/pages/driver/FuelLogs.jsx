export default function FuelLogs() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Fuel Logs</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Date</th>
                         <th className="border p-2">Start Mileage</th>
                          <th className="border p-2">End Mileage</th>
                           <th className="border p-2">Distance</th>
                            <th className="border p-2">Fuel Used (Litres)</th>
                             <th className="border p-2">Comments</th>
                    </tr>
                    </thead>
                    <tbody>
                        {Logs.map((log, index)=>(
                            <tr key={index}>
                                <td className="p-2 border">{log.date}</td>
                                <td className="p-2 border">{log.startMileage}</td>
                                <td className="p-2 border">{log.endMileage}</td>
                                <td className="p-2 border">{log.distance}</td>
                                <td className="p-2 border">{log.fuelUsed}</td>
                                <td className="p-2 border">{log.comments}</td>
                            </tr>
                        ))}
                        </tbody>
            </table>




        </div>
    );}
