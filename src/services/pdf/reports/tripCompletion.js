
import {
  createDoc,
  drawHeader,
  drawFooter,
  sectionHeading,
  guardPageBreak,
  BRAND,
  autoTable,
} from "../pdfBase";

const REPORT_TITLE = "Trip Completion Report";

export function generateTripCompletionReport(data) {
  // ── Input validation
  if (!data || !data.request || !data.assignment || !data.tripLog) {
    throw new Error(
      "generateTripCompletionReport: data must include request, assignment, and tripLog."
    );
  }

  const { request, assignment, tripLog } = data;

  const doc = createDoc("portrait");
  let y = drawHeader(doc, REPORT_TITLE);

  y = drawReferenceLine(doc, request, y);
  y = guardPageBreak(doc, y, 50, REPORT_TITLE);
  y = sectionHeading(doc, "1. Trip Request Details", y);
  y = drawRequestSection(doc, request, y);
  y = guardPageBreak(doc, y, 50, REPORT_TITLE);
  y = sectionHeading(doc, "2. Assignment Details", y);
  y = drawAssignmentSection(doc, assignment, y);
  y = guardPageBreak(doc, y, 60, REPORT_TITLE);
  y = sectionHeading(doc, "3. Driver Trip Log", y);
  y = drawTripLogSection(doc, tripLog, y);
  y = guardPageBreak(doc, y, 30, REPORT_TITLE);
  y = sectionHeading(doc, "4. Driver Comments", y);
  y = drawCommentsSection(doc, tripLog, y);

  drawFooter(doc);

  return doc;
}

function drawReferenceLine(doc, request, y) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;

  const tripDate = request.tripDate
    ? new Date(request.tripDate).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(BRAND.fontSize.small);
  doc.setTextColor(...BRAND.textMid);

  doc.text(`Report Ref: RPT-${request.requestId}`, left, y);
  doc.text(`Trip Date: ${tripDate}`, pageWidth - right, y, {
    align: "right",
  });

  doc.setDrawColor(...BRAND.textLight);
  doc.setLineWidth(0.2);
  doc.line(left, y + 2, pageWidth - right, y + 2);

  return y + 8;
}

function drawRequestSection(doc, request, y) {
  const { left, right } = BRAND.margins;
  const pageWidth = doc.internal.pageSize.getWidth();
  const colWidth = (pageWidth - left - right) / 2 - 2;

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: {
      fontSize: BRAND.fontSize.tableBody,
      cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
    },
    columnStyles: {
      // Two pairs of columns: label | value | label | value
      0: { fontStyle: "bold", textColor: BRAND.textMid, cellWidth: 35 },
      1: { textColor: BRAND.textDark, cellWidth: colWidth - 35 },
      2: { fontStyle: "bold", textColor: BRAND.textMid, cellWidth: 35 },
      3: { textColor: BRAND.textDark, cellWidth: colWidth - 35 },
    },
    body: [
      ["Requester", request.requesterName || "N/A",
       "Course", request.courseName || "N/A"],
      ["Destination", request.destination || "N/A",
       "Trip Date", request.tripDate
          ? new Date(request.tripDate).toLocaleDateString("en-KE", {
              day: "numeric", month: "long", year: "numeric",
            })
          : "N/A"],
      ["Purpose", request.purpose || "N/A",
       "Group Size", request.groupSize?.toString() ?? "N/A"],
      ["Status", request.status || "N/A",
       "Notes", request.notes || "None"],
    ],
  });

  return doc.lastAutoTable.finalY + 10;
}

// Shows vehicle and driver details side by side.
// Two visual boxes: one for vehicle, one for driver.

function drawAssignmentSection(doc, assignment, y) {
  const { left, right } = BRAND.margins;
  const pageWidth = doc.internal.pageSize.getWidth();
  const colWidth = (pageWidth - left - right) / 2 - 2;

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: {
      fontSize: BRAND.fontSize.tableBody,
      cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: BRAND.textMid, cellWidth: 35 },
      1: { textColor: BRAND.textDark, cellWidth: colWidth - 35 },
      2: { fontStyle: "bold", textColor: BRAND.textMid, cellWidth: 35 },
      3: { textColor: BRAND.textDark, cellWidth: colWidth - 35 },
    },
    body: [
      ["Vehicle Plate", assignment.vehiclePlate || "N/A",
       "Driver Name", assignment.driverName || "N/A"],
      ["Vehicle Model", assignment.vehicleModel || "N/A",
       "Driver Contact", assignment.driverContact || "N/A"],
      ["Capacity", assignment.vehicleCapacity?.toString() ?? "N/A",
       "Assigned At", assignment.assignedAt
          ? new Date(assignment.assignedAt).toLocaleDateString("en-KE", {
              day: "numeric", month: "long", year: "numeric",
            })
          : "N/A"],
      ["Notes", assignment.assignmentNotes || "None", "", ""],
    ],
  });

  return doc.lastAutoTable.finalY + 10;
}

// Shows the driver's logged trip data with calculated fields.
// The calculated fields (distance, fuel efficiency) are computed
// here on the frontend — not fetched from the backend.

function drawTripLogSection(doc, tripLog, y) {
  const { left, right } = BRAND.margins;
  const pageWidth = doc.internal.pageSize.getWidth();
  const colWidth = (pageWidth - left - right) / 2 - 2;

  // ── Calculated fields
  const distanceKm =
    tripLog.endMileage != null && tripLog.startMileage != null
      ? (tripLog.endMileage - tripLog.startMileage).toFixed(1)
      : null;

  const fuelEfficiency =
    distanceKm != null && tripLog.fuelUsed > 0
      ? (distanceKm / tripLog.fuelUsed).toFixed(2)
      : null;

  const startTs = tripLog.startTime
    ? new Date(tripLog.startTime).toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const endTs = tripLog.endTime
    ? new Date(tripLog.endTime).toLocaleString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // ── Summary highlight boxes — distance and fuel front and center
  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: {
      fontSize: BRAND.fontSize.tableBody,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - left - right) / 3 },
      1: { cellWidth: (pageWidth - left - right) / 3 },
      2: { cellWidth: (pageWidth - left - right) / 3 },
    },
    body: [
      [
        {
          content: `Distance Traveled\n${distanceKm != null ? distanceKm + " km" : "N/A"}`,
          styles: {
            fontStyle: "bold",
            halign: "center",
            fillColor: BRAND.tealLight,
            textColor: BRAND.textDark,
          },
        },
        {
          content: `Fuel Used\n${tripLog.fuelUsed != null ? tripLog.fuelUsed + " L" : "N/A"}`,
          styles: {
            fontStyle: "bold",
            halign: "center",
            fillColor: BRAND.tealLight,
            textColor: BRAND.textDark,
          },
        },
        {
          content: `Fuel Efficiency\n${fuelEfficiency != null ? fuelEfficiency + " km/L" : "N/A"}`,
          styles: {
            fontStyle: "bold",
            halign: "center",
            fillColor: BRAND.tealLight,
            textColor: BRAND.textDark,
          },
        },
      ],
    ],
  });

  y = doc.lastAutoTable.finalY + 6;

  // ── Detailed log data
  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: {
      fontSize: BRAND.fontSize.tableBody,
      cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: BRAND.textMid, cellWidth: 35 },
      1: { textColor: BRAND.textDark, cellWidth: colWidth - 35 },
      2: { fontStyle: "bold", textColor: BRAND.textMid, cellWidth: 35 },
      3: { textColor: BRAND.textDark, cellWidth: colWidth - 35 },
    },
    body: [
      ["Start Mileage",
       tripLog.startMileage != null ? `${tripLog.startMileage.toLocaleString()} km` : "N/A",
       "End Mileage",
       tripLog.endMileage != null ? `${tripLog.endMileage.toLocaleString()} km` : "N/A"],
      ["Departure Time", startTs, "Return Time", endTs],
    ],
  });

  return doc.lastAutoTable.finalY + 10;
}

// Driver comments 
// splitTextToSize handles long comments that would overflow a single line.

function drawCommentsSection(doc, tripLog, y) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;

  const comment = tripLog.comments?.trim() || "No comments recorded.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(BRAND.fontSize.tableBody);
  doc.setTextColor(...BRAND.textDark);

  // Wrap text to fit within page margins
  const wrapped = doc.splitTextToSize(comment, pageWidth - left - right);
  doc.text(wrapped, left, y);

  // Each line is approximately 5mm tall at fontSize 9
  return y + wrapped.length * 5 + 6;
}