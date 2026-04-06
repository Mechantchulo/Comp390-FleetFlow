import { useState } from "react";
import { Link } from "react-router-dom";
import { generateVehicleMaintenanceReport } from "../services/pdf/reports/vehicleMaintenance";
import { mockVehicles } from "../services/pdf/mockReportData";
import { generateTripCompletionReport } from "../services/pdf/reports/tripCompletion";
import { mockTripCompletion } from "../services/pdf/mockReportData";
import { generateDeanRequestHistoryReport } from "../services/pdf/reports/deanRequestHistory";
import { mockDeanRequests } from "../services/pdf/mockReportData";
import { generateManagerFleetTimetable } from "../services/pdf/reports/managerFleetTimetable";
import { mockManagerTimetable } from "../services/pdf/mockReportData";
import { generateDriverTimetable } from "../services/pdf/reports/driverTimetable";
import { mockDriverTimetable } from "../services/pdf/mockReportData";

// PDF TEST ACTIONS
// These functions are only called from the dev menu.
// to be deleted.

function testVehicleMaintenancePDF() {
  try {
    const doc = generateVehicleMaintenanceReport(mockVehicles);
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err.message}`);
  }
}

function testTripCompletionPDF() {
  try {
    const doc = generateTripCompletionReport(mockTripCompletion);
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err.message}`);
  }
}

function testDeanRequestHistoryPDF() {
  try {
    const doc = generateDeanRequestHistoryReport(mockDeanRequests);
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err.message}`);
  }
}

function testManagerFleetTimetablePDF() {
  try {
    const doc = generateManagerFleetTimetable(mockManagerTimetable);
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err.message}`);
  }
}

function testDriverTimetablePDF() {
  try {
    const doc = generateDriverTimetable(mockDriverTimetable);
    const url = doc.output("bloburl");
    window.open(url, "_blank");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert(`PDF generation failed: ${err.message}`);
  }
}

// Each item is either a navigation link (has `to`) or an action (has `onClick`).

const links = [
  { to: "/dashboard/transport_manager", label: "Transport Manager Dashboard" },
  { to: "/dashboard/admin", label: "Admin Operations Dashboard" },
  { to: "/dashboard/operations_staff", label: "Operations Staff Dashboard" },
  { to: "/dashboard/department_dean", label: "Department Dean Dashboard" },
  { to: "/dashboard/fleet_driver", label: "Fleet Driver Dashboard" },
  { onClick: testVehicleMaintenancePDF, label: "Vehicle Maintenance PDF" },
  { onClick: testTripCompletionPDF, label: "Trip Completion PDF" },
  { onClick: testDeanRequestHistoryPDF, label: "Dean Request History PDF" },
  { onClick: testManagerFleetTimetablePDF, label: "Manager Fleet Timetable PDF" },
  { onClick: testDriverTimetablePDF, label: "Driver Timetable PDF" },
];

const itemClass =
  "pointer-events-auto rounded-md bg-white/40 px-3 py-2 text-sm text-slate-700 backdrop-blur-sm hover:bg-white/70 text-left w-full";

export default function DevMenu() {
  const [open, setOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-700"
      >
        ☰
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 w-72 p-1 pointer-events-none">
          <p className="mb-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Dev Dashboard Links
          </p>
          <div className="flex flex-col gap-2">
            {links.map((item) =>
              item.to ? (

                <Link
                  key={item.to}
                  to={item.to}
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className={itemClass}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// import { useState } from "react";
// import { Link } from "react-router-dom";

// const links = [
//   { to: "/dashboard/transport_manager", label: "Transport Manager Dashboard" },
//   { to: "/dashboard/operations_staff", label: "Operations Staff Dashboard" },
//   { to: "/dashboard/department_dean", label: "Department Dean Dashboard" },
//   { to: "/dashboard/fleet_driver", label: "Fleet Driver Dashboard" },
// ];

// export default function DevMenu() {
//   const [open, setOpen] = useState(false);

//   if (!import.meta.env.DEV) return null;

//   return (
//     <div className="relative z-50">
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-700"
//       >
//         ☰
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 z-50 w-72 p-1 pointer-events-none">
//           <p className="mb-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//             Dev Dashboard Links
//           </p>
//           <div className="flex flex-col gap-2">
//             {links.map((item) => (
//               <Link
//                 key={item.to}
//                 to={item.to}
//                 className="pointer-events-auto rounded-md bg-white/40 px-3 py-2 text-sm text-slate-700 backdrop-blur-sm hover:bg-white/70"
//                 onClick={() => setOpen(false)}
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
