import {
  createDoc,
  drawHeader,
  drawFooter,
  sectionHeading,
  BRAND,
  autoTable,
  drawCalendarGrid,
} from "../pdfBase";

const REPORT_TITLE = "Fleet Timetable";

export function generateManagerFleetTimetable(data) {
  if (!data || !Array.isArray(data.trips)) {
    throw new Error(
      "generateManagerFleetTimetable: data must include a trips array."
    );
  }

  const doc = createDoc("landscape");
  let y = drawHeader(doc, REPORT_TITLE);

  y = drawMetaBlock(doc, data, y);

  y = sectionHeading(doc, "Period Summary", y);
  y = drawSummarySection(doc, data, y);
  y = sectionHeading(doc, "Trip Schedule", y);

  const tripsByDate = buildTripsByDate(data.trips);

  drawCalendarGrid(doc, REPORT_TITLE, data.dateFrom, data.dateTo, tripsByDate, y);

  drawFooter(doc);
  return doc;
}

function drawMetaBlock(doc, data, y) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;

  const from = data.dateFrom
    ? new Date(data.dateFrom).toLocaleDateString("en-KE", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "N/A";

  const to = data.dateTo
    ? new Date(data.dateTo).toLocaleDateString("en-KE", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "N/A";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.teal);
  doc.text("Transport Manager", left, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(BRAND.fontSize.small);
  doc.setTextColor(...BRAND.textMid);
  doc.text(`${data.generatedBy || "N/A"}`, left, y + 5);
  doc.text(`Period: ${from} — ${to}`, left, y + 10);

  doc.setDrawColor(...BRAND.textLight);
  doc.setLineWidth(0.2);
  doc.line(left, y + 13, pageWidth - right, y + 13);

  return y + 18;
}

function drawSummarySection(doc, data, y) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;
  const contentWidth = pageWidth - left - right;
  const trips = data.trips;

  const total = trips.length;
  const completed = trips.filter((t) => t.status === "COMPLETED").length;
  const active = trips.filter((t) => t.status === "ACTIVE").length;
  const planned = trips.filter((t) => t.status === "PLANNED").length;
  const uniqueVehicles = new Set(trips.map((t) => t.vehiclePlate)).size;
  const uniqueDrivers = new Set(trips.map((t) => t.driverName)).size;

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: { fontSize: BRAND.fontSize.tableBody, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: contentWidth / 6 },
      1: { cellWidth: contentWidth / 6 },
      2: { cellWidth: contentWidth / 6 },
      3: { cellWidth: contentWidth / 6 },
      4: { cellWidth: contentWidth / 6 },
      5: { cellWidth: contentWidth / 6 },
    },
    body: [[
      {
        content: `Total Trips\n${total}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: BRAND.tealLight, textColor: BRAND.textDark },
      },
      {
        content: `Completed\n${completed}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: [220, 252, 231], textColor: [22, 101, 52] },
      },
      {
        content: `Active\n${active}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: [219, 234, 254], textColor: [30, 64, 175] },
      },
      {
        content: `Planned\n${planned}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: [255, 247, 230], textColor: [180, 83, 9] },
      },
      {
        content: `Vehicles\n${uniqueVehicles}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: BRAND.tealLight, textColor: BRAND.textDark },
      },
      {
        content: `Drivers\n${uniqueDrivers}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: BRAND.tealLight, textColor: BRAND.textDark },
      },
    ]],
  });

  return doc.lastAutoTable.finalY + 10;
}

// ─── HELPER: BUILD TRIPS BY DATE MAP ────────────────────────────────────────
//
// Converts the flat trips array into an object keyed by ISO date string.
// Each value is an array of formatted trip block strings.
// The calendar engine uses this map to populate each day cell.
//
// Manager format per trip block:
//   "07:45 — Lake Nakuru National Park"
//   "James Otieno  |  KCA 123A"

function buildTripsByDate(trips) {
  const map = {};

  trips.forEach((trip) => {
    if (!trip.tripDate) return;

    // Normalize the date key to YYYY-MM-DD
    const key = trip.tripDate.substring(0, 10);

    if (!map[key]) map[key] = [];

    const line1 = `${trip.departureTime || "N/A"} — ${trip.destination || "N/A"}`;
    const line2 = `${trip.driverName || "N/A"}  |  ${trip.vehiclePlate || "N/A"}`;

    map[key].push(`${line1}\n${line2}`);
  });

  return map;
}