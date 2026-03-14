// Generates the Vehicle Maintenance Status Report.
// Called by the Fleet Management page when the Transport Manager
// clicks "Download Maintenance Report".
//
// Input:  array of vehicle objects (see mockVehicles in mockReportData.js)
// Output: a jsPDF document object
//
// The caller is responsible for:
//   - Fetching the data
//   - Passing it to this function
//   - Taking the returned doc and passing it to PDFPreviewModal

import { createDoc, drawHeader, drawFooter, sectionHeading, BRAND, autoTable } from "../pdfBase";

// CONSTANTS SPECIFIC TO THIS REPORT 

const REPORT_TITLE = "Vehicle Maintenance Report";

// Vehicles are flagged when km since last service reaches this threshold.
const MAINTENANCE_THRESHOLD_KM = 5000;

// How close to the threshold before we show a warning (not yet flagged but close).
// We define "close" as within 500 km of the threshold.
const WARNING_BUFFER_KM = 500;


// Parameters:
//   vehicles — array of vehicle objects from GET /vehicles
//
// Returns:
//   jsPDF document object
//
// Throws if vehicles is not a non-empty array so the caller knows
// immediately that something went wrong with data fetching,
// rather than generating a blank PDF silently.

export function generateVehicleMaintenanceReport(vehicles) {
  
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    throw new Error(
      "generateVehicleMaintenanceReport: vehicles must be a non-empty array."
    );
  }

  const doc = createDoc("portrait");

  let y = drawHeader(doc, REPORT_TITLE);

  const summary = buildSummary(vehicles);

  y = drawSummarySection(doc, summary, y);

  // ── Sort vehicles: FLAGGED first, then WARNING, then OK.
  const sorted = sortVehicles(vehicles);

  y = drawVehiclesTable(doc, sorted, y);

  drawFooter(doc);

  return doc;
}


function buildSummary(vehicles) {
  let flagged = 0;
  let warning = 0;
  let ok = 0;
  let available = 0;
  let inUse = 0;
  let underMaintenance = 0;

  vehicles.forEach((v) => {
    const kmSince = v.currentMileage - v.lastServiceMileage;

    if (kmSince >= MAINTENANCE_THRESHOLD_KM) {
      flagged++;
    } else if (kmSince >= MAINTENANCE_THRESHOLD_KM - WARNING_BUFFER_KM) {
      warning++;
    } else {
      ok++;
    }

    if (v.status === "AVAILABLE") available++;
    else if (v.status === "IN_USE") inUse++;
    else if (v.status === "UNDER_MAINTENANCE") underMaintenance++;
  });

  return {
    total: vehicles.length,
    flagged,
    warning,
    ok,
    available,
    inUse,
    underMaintenance,
  };
}
//HELPER SORTING FUNCTION

function sortVehicles(vehicles) {
  // Assign a numeric priority to each vehicle based on maintenance status.
  // Lower number = higher priority = appears first in the table.
  function priority(v) {
    const kmSince = v.currentMileage - v.lastServiceMileage;
    if (kmSince >= MAINTENANCE_THRESHOLD_KM) return 0;       
    if (kmSince >= MAINTENANCE_THRESHOLD_KM - WARNING_BUFFER_KM) return 1; 
    return 2;                                                  // ok
  }

  return [...vehicles].sort((a, b) => {
    const diff = priority(a) - priority(b);
    if (diff !== 0) return diff;
    // Within same priority group, sort alphabetically by reg number
    return a.regNumber.localeCompare(b.regNumber);
  });
}

//  HELPER: DRAW SUMMARY SECTION 

function drawSummarySection(doc, summary, y) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const { left, right } = BRAND.margins;
  const contentWidth = pageWidth - left - right;

  y = sectionHeading(doc, "Fleet Summary", y);

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "plain",
    styles: {
      fontSize: BRAND.fontSize.tableBody,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: contentWidth / 3 },
      1: { cellWidth: contentWidth / 3 },
      2: { cellWidth: contentWidth / 3 },
    },
    body: [
      [
        {
          content: `Total Vehicles\n${summary.total}`,
          styles: {
            fontStyle: "bold",
            textColor: BRAND.textDark,
            fillColor: BRAND.tealLight,
            halign: "center",
          },
        },
        {
          content: `Flagged for Service\n${summary.flagged}`,
          styles: {
            fontStyle: "bold",
            // If there are flagged vehicles, show the count in red
            textColor: summary.flagged > 0 ? BRAND.flagRed : BRAND.textDark,
            fillColor: summary.flagged > 0 ? [255, 235, 235] : BRAND.tealLight,
            halign: "center",
          },
        },
        {
          content: `Approaching Service\n${summary.warning}`,
          styles: {
            fontStyle: "bold",
            textColor: summary.warning > 0 ? [180, 83, 9] : BRAND.textDark,
            fillColor: summary.warning > 0 ? [255, 247, 230] : BRAND.tealLight,
            halign: "center",
          },
        },
      ],
    ],
  });

  return doc.lastAutoTable.finalY + 10;
}

// DRAW VEHICLES TABLE 

function drawVehiclesTable(doc, vehicles, y) {
  const { left, right } = BRAND.margins;

  y = sectionHeading(doc, "Vehicle Status Details", y);

  // Build the table rows with calculated fields
  const rows = vehicles.map((v) => {
    const kmSince = v.currentMileage - v.lastServiceMileage;
    const isFlagged = kmSince >= MAINTENANCE_THRESHOLD_KM;
    const isWarning =
      !isFlagged && kmSince >= MAINTENANCE_THRESHOLD_KM - WARNING_BUFFER_KM;

    // Format the last service date from ISO string to readable format
    const serviceDate = v.lastServiceDate
      ? new Date(v.lastServiceDate).toLocaleDateString("en-KE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    // Determine the maintenance status label for the last column
    let maintenanceStatus;
    if (isFlagged) {
      maintenanceStatus = "SERVICE REQUIRED";
    } else if (isWarning) {
      maintenanceStatus = "DUE SOON";
    } else {
      maintenanceStatus = "OK";
    }

    return {
      // The data for each column
      cells: [
        v.regNumber,
        v.model || "N/A",
        v.capacity?.toString() ?? "N/A",
        v.status.replace("_", " "),
        `${v.currentMileage.toLocaleString()} km`,
        `${kmSince.toLocaleString()} km`,
        serviceDate,
        maintenanceStatus,
      ],
      // Flags so we can color the row
      isFlagged,
      isWarning,
    };
  });

  autoTable(doc, {
    startY: y,
    margin: { left, right },
    theme: "grid",

    // Column headers
    head: [
      [
        "Reg Number",
        "Model",
        "Capacity",
        "Status",
        "Current Mileage",
        "KM Since Service",
        "Last Serviced",
        "Maintenance",
      ],
    ],

    // Row data — just the cell values, not the metadata
    body: rows.map((r) => r.cells),

    // Header row styling
    headStyles: {
      fillColor: BRAND.teal,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: BRAND.fontSize.tableHeader,
      halign: "center",
    },

    // Default body cell styling
    bodyStyles: {
      fontSize: BRAND.fontSize.tableBody,
      textColor: BRAND.textDark,
    },

    // Column width hints — autoTable will distribute remaining space
    columnStyles: {
      0: { cellWidth: 24, halign: "center" }, // Reg Number
      1: { cellWidth: 30 },                   // Model
      2: { cellWidth: 16, halign: "center" }, // Capacity
      3: { cellWidth: 22, halign: "center" }, // Status
      4: { cellWidth: 26, halign: "right" },  // Current Mileage
      5: { cellWidth: 26, halign: "right" },  // KM Since Service
      6: { cellWidth: 24, halign: "center" }, // Last Serviced
      7: { cellWidth: 26, halign: "center" }, // Maintenance status
    },

    // Color each row based on maintenance status.
    // willDrawCell fires before each cell is drawn, letting us
    // override the fill color per row.
    willDrawCell: (data) => {
      // data.row.index is 0-based, matches our rows array
      if (data.section === "body") {
        const row = rows[data.row.index];
        if (row.isFlagged) {
          // Light red background for flagged rows
          data.cell.styles.fillColor = [255, 235, 235];
          data.cell.styles.textColor = BRAND.textDark;
        } else if (row.isWarning) {
          // Light amber background for warning rows
          data.cell.styles.fillColor = [255, 247, 230];
          data.cell.styles.textColor = BRAND.textDark;
        }
        // Last column gets bold text and status-appropriate color
        if (data.column.index === 7) {
          data.cell.styles.fontStyle = "bold";
          if (row.isFlagged) {
            data.cell.styles.textColor = BRAND.flagRed;
          } else if (row.isWarning) {
            data.cell.styles.textColor = [180, 83, 9]; // amber
          } else {
            data.cell.styles.textColor = [22, 101, 52]; // green
          }
        }
      }
    },
  });

  return doc.lastAutoTable.finalY + 10;
}