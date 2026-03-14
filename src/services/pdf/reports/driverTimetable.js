import {
  createDoc,
  drawHeader,
  drawFooter,
  sectionHeading,
  BRAND,
  autoTable,
  drawCalendarGrid,
} from "../pdfBase";

const REPORT_TITLE = "Driver Timetable";

export function generateDriverTimetable(data) {
  if (!data || !Array.isArray(data.trips)) {
    throw new Error(
      "generateDriverTimetable: data must include a trips array."
    );
  }

  // Landscape — 7 day columns
  const doc = createDoc("landscape");
  let y = drawHeader(doc, REPORT_TITLE);

  // ── Driver metadata block
  y = drawDriverMetaBlock(doc, data, y);

  // ── Trip summary counts
  y = sectionHeading(doc, "Schedule Summary", y);
  y = drawSummarySection(doc, data, y);

  // ── Calendar grid
  y = sectionHeading(doc, "My Trip Schedule", y);

  const tripsByDate = buildTripsByDate(data.trips);

  drawCalendarGrid(
    doc,
    REPORT_TITLE,
    data.dateFrom,
    data.dateTo,
    tripsByDate,
    y
  );

  drawFooter(doc);
  return doc;
}

function drawDriverMetaBlock(doc, data, y) {
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
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.teal);
  doc.text(data.driverName || "Driver", left, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(BRAND.fontSize.small);
  doc.setTextColor(...BRAND.textMid);
  doc.text("Fleet Driver — Egerton University Transport Department", left, y + 5);
  doc.text(`Period: ${from} — ${to}`, left, y + 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(BRAND.fontSize.small);
  doc.setTextColor(...BRAND.textDark);
  doc.text(
    `${data.trips.length} trip${data.trips.length !== 1 ? "s" : ""} in this period`,
    pageWidth - right,
    y + 5,
    { align: "right" }
  );

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
  const planned = trips.filter(
    (t) => t.status === "PLANNED" || t.status === "ACTIVE"
  ).length;

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: { fontSize: BRAND.fontSize.tableBody, cellPadding: 4 },
    columnStyles: {
      0: { cellWidth: contentWidth / 3 },
      1: { cellWidth: contentWidth / 3 },
      2: { cellWidth: contentWidth / 3 },
    },
    body: [[
      {
        content: `Total Assigned\n${total}`,
        styles: { fontStyle: "bold", halign: "center", fillColor: BRAND.tealLight, textColor: BRAND.textDark },
      },
      {
        content: `Completed\n${completed}`,
        styles: {
          fontStyle: "bold", halign: "center",
          fillColor: completed > 0 ? [220, 252, 231] : BRAND.tealLight,
          textColor: completed > 0 ? [22, 101, 52] : BRAND.textDark,
        },
      },
      {
        content: `Upcoming\n${planned}`,
        styles: {
          fontStyle: "bold", halign: "center",
          fillColor: planned > 0 ? [255, 247, 230] : BRAND.tealLight,
          textColor: planned > 0 ? [180, 83, 9] : BRAND.textDark,
        },
      },
    ]],
  });

  return doc.lastAutoTable.finalY + 10;
}

function buildTripsByDate(trips) {
  const map = {};

  trips.forEach((trip) => {
    if (!trip.tripDate) return;

    const key = trip.tripDate.substring(0, 10);
    if (!map[key]) map[key] = [];

    const line1 = `${trip.departureTime || "N/A"} — ${trip.destination || "N/A"}`;
    const line2 = `${trip.vehicleModel || "N/A"}  |  ${trip.vehiclePlate || "N/A"}`;

    map[key].push(`${line1}\n${line2}`);
  });

  return map;
}