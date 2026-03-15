// This file is the shared foundation for every PDF report in FleetFlow.
// No report is generated here. This file only exports reusable constants
// and helper functions that every report file will import.

// If a design decision changes globally (color, margins, font size),
// you change it here and every report updates automatically.

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

export { autoTable };

// BRAND CONSTANTS

export const BRAND = {

  teal: [13, 148, 136],

  tealLight: [204, 240, 237],

  textDark: [30, 30, 30],
  textMid: [80, 80, 80],
  textLight: [140, 140, 140],

  flagRed: [220, 38, 38],

  // Page margins in mm
  margins: {
    top: 20,
    bottom: 20,
    left: 14,
    right: 14,
  },

  // Font sizes
  fontSize: {
    headerTitle: 15,
    headerSub: 8,
    reportTitle: 10,
    sectionHeading: 10,
    tableHeader: 9,
    tableBody: 9,
    footer: 7,
    small: 7,
  },
};


export function createDoc(orientation = "portrait") {
  return new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });
}

// HEADER

export function drawHeader(doc, reportTitle) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;

  doc.setFillColor(...BRAND.teal);
  doc.rect(0, 0, pageWidth, 24, "F");

  // ── Left side: system name and institution
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(BRAND.fontSize.headerTitle);
  doc.text("FleetFlow", left, 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(BRAND.fontSize.headerSub);
  doc.text("Egerton University — Transport Department", left, 16);

  // ── Right side: report title and generated timestamp
  doc.setFont("helvetica", "bold");
  doc.setFontSize(BRAND.fontSize.reportTitle);
  doc.text(reportTitle.toUpperCase(), pageWidth - right, 10, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(BRAND.fontSize.small);

  const now = new Date();
  const timestamp = now.toLocaleString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${timestamp}`, pageWidth - right, 17, {
    align: "right",
  });

  
  return 24 + 8; 
}



export function drawFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { left, right, bottom } = BRAND.margins;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Separator line above footer
    doc.setDrawColor(...BRAND.textLight);
    doc.setLineWidth(0.2);
    doc.line(left, pageHeight - bottom + 2, pageWidth - right, pageHeight - bottom + 2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(BRAND.fontSize.footer);
    doc.setTextColor(...BRAND.textLight);

    doc.text(
      "Egerton University Transport Department.",
      left,
      pageHeight - bottom + 7
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - right,
      pageHeight - bottom + 7,
      { align: "right" }
    );
  }
}

export function sectionHeading(doc, label, y) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(BRAND.fontSize.sectionHeading);
  doc.setTextColor(...BRAND.teal);
  doc.text(label, left, y);

  doc.setDrawColor(...BRAND.teal);
  doc.setLineWidth(0.4);
  doc.line(left, y + 1.5, pageWidth - right, y + 1.5);

  return y + 8;
}

export function guardPageBreak(doc, currentY, spaceNeeded, reportTitle) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const { bottom } = BRAND.margins;

  if (currentY + spaceNeeded > pageHeight - bottom - 10) {
    doc.addPage();
    return drawHeader(doc, reportTitle);
  }

  return currentY;
}
// ─── CALENDAR GRID ENGINE ────────────────────────────────────────────────────
//
// Shared calendar grid renderer used by both the Driver Timetable
// and the Manager Fleet Timetable reports.
//
// Parameters:
//   doc         — jsPDF instance
//   reportTitle — for redrawing header on new pages
//   dateFrom    — ISO date string, start of period
//   dateTo      — ISO date string, end of period
//   tripsByDate — plain object keyed by ISO date string "YYYY-MM-DD"
//                 each value is an array of trip block strings to display
//                 e.g. { "2026-03-10": ["07:45 — Lake Nakuru\nKCA 123A"] }
//   startY      — Y position to begin drawing
//
// Returns: final Y position after the last week row

export function drawCalendarGrid(doc, reportTitle, dateFrom, dateTo, tripsByDate, startY) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right, bottom } = BRAND.margins;
  const contentWidth = pageWidth - left - right;
  const colWidth = contentWidth / 7;

  const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ── Draw the day-of-week header row once
  autoTable(doc, {
    startY,
    margin: { left, right },
    theme: "plain",
    styles: { cellPadding: 0 },
    columnStyles: {
      0: { cellWidth: colWidth },
      1: { cellWidth: colWidth },
      2: { cellWidth: colWidth },
      3: { cellWidth: colWidth },
      4: { cellWidth: colWidth },
      5: { cellWidth: colWidth },
      6: { cellWidth: colWidth },
    },
    body: [
      DAY_HEADERS.map((d) => ({
        content: d,
        styles: {
          fillColor: BRAND.teal,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: BRAND.fontSize.tableHeader,
          halign: "center",
          cellPadding: 3,
        },
      })),
    ],
  });

  let y = doc.lastAutoTable.finalY;

  // ── Build the array of weeks in the period
  const weeks = buildWeeks(dateFrom, dateTo);

  // ── Draw one table row per week
  weeks.forEach((week) => {
    // Estimate how tall this week row needs to be based on
    // the maximum number of trips in any single day that week.
    // Each trip block is approximately 10mm tall.
    // Minimum cell height is 14mm so day numbers always have room.
    const maxTripsInWeek = Math.max(
      ...week.map((day) => {
        if (!day) return 0;
        const key = toISODate(day);
        return (tripsByDate[key] || []).length;
      })
    );
    const estimatedHeight = Math.max(14, maxTripsInWeek * 10 + 8);

    // If this week row won't fit on the current page, add a new page
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + estimatedHeight > pageHeight - bottom - 10) {
      doc.addPage();
      y = drawHeader(doc, reportTitle);
      // Redraw day headers on the new page
      autoTable(doc, {
        startY: y,
        margin: { left, right },
        theme: "plain",
        styles: { cellPadding: 0 },
        columnStyles: {
          0: { cellWidth: colWidth },
          1: { cellWidth: colWidth },
          2: { cellWidth: colWidth },
          3: { cellWidth: colWidth },
          4: { cellWidth: colWidth },
          5: { cellWidth: colWidth },
          6: { cellWidth: colWidth },
        },
        body: [
          DAY_HEADERS.map((d) => ({
            content: d,
            styles: {
              fillColor: BRAND.teal,
              textColor: [255, 255, 255],
              fontStyle: "bold",
              fontSize: BRAND.fontSize.tableHeader,
              halign: "center",
              cellPadding: 3,
            },
          })),
        ],
      });
      y = doc.lastAutoTable.finalY;
    }

    // Build the 7 cells for this week row
    const cells = week.map((day) => {
      if (!day) {
        // Empty cell — day is outside the selected period
        return {
          content: "",
          styles: {
            fillColor: [245, 245, 245],
            cellPadding: 3,
            minCellHeight: estimatedHeight,
          },
        };
      }

      const key = toISODate(day);
      const trips = tripsByDate[key] || [];
      const dayNum = day.getDate();
      const isToday = key === toISODate(new Date());

      // Build cell content: day number + trip blocks
      // Each trip block is a string passed in by the report file
      const tripText = trips.length > 0 ? "\n" + trips.join("\n\n") : "";
      const content = `${dayNum}${tripText}`;

      return {
        content,
        styles: {
          // Highlight today's cell with a light teal background
          fillColor: isToday ? BRAND.tealLight : [255, 255, 255],
          textColor: BRAND.textDark,
          fontSize: BRAND.fontSize.tableBody,
          cellPadding: 3,
          minCellHeight: estimatedHeight,
          valign: "top",
          // Day number at the top is handled by the first line of content
        },
      };
    });

    autoTable(doc, {
      startY: y,
      margin: { left, right },
      theme: "grid",
      styles: { cellPadding: 0, lineColor: [200, 200, 200], lineWidth: 0.2 },
      columnStyles: {
        0: { cellWidth: colWidth },
        1: { cellWidth: colWidth },
        2: { cellWidth: colWidth },
        3: { cellWidth: colWidth },
        4: { cellWidth: colWidth },
        5: { cellWidth: colWidth },
        6: { cellWidth: colWidth },
      },
      body: [cells],

      // Color the day number differently from trip text
      // We bold the first line (day number) of each cell
      willDrawCell: (data) => {
        if (data.section === "body") {
          const day = week[data.column.index];
          if (!day) return;
          const key = toISODate(day);
          const trips = tripsByDate[key] || [];
          // If the cell has trips, the day number line gets teal text
          if (trips.length > 0) {
            data.cell.styles.textColor = BRAND.teal;
          }
        }
      },
    });

    y = doc.lastAutoTable.finalY;
  });

  return y;
}

// ─── CALENDAR UTILITY: BUILD WEEKS ──────────────────────────────────────────
//
// Takes a date range and returns an array of weeks.
// Each week is an array of 7 Date objects (or null for days outside the range).
// Week starts on Sunday.
//
// Example output for a 10-day range starting on a Wednesday:
// [
//   [null, null, null, Date(day1), Date(day2), Date(day3), Date(day4)],
//   [Date(day5), Date(day6), ..., Date(day10), null, null, null]
// ]

function buildWeeks(dateFrom, dateTo) {
  const start = new Date(dateFrom);
  const end = new Date(dateTo);

  // Normalize to midnight to avoid timezone hour issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const weeks = [];
  let current = new Date(start);

  // Move current back to the Sunday of the week containing start
  const startDayOfWeek = current.getDay(); // 0 = Sunday
  current.setDate(current.getDate() - startDayOfWeek);

  while (current <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(current);
      // Only include days that are within the actual selected range
      if (day >= start && day <= end) {
        week.push(day);
      } else {
        week.push(null);
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

// ─── CALENDAR UTILITY: TO ISO DATE ──────────────────────────────────────────
//
// Converts a Date object to a "YYYY-MM-DD" string for use as a map key.
// We cannot use date.toISOString() directly because that returns UTC time
// which can shift the date by one day for users in UTC+ timezones like Kenya.

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}