//HII NI YA KUTEST OUTLOOK YA THE REPORTS WILL BE DELETED LATER WHEN WE HOOK WITH THE BACK END
// src/services/pdf/mockReportData.js
//
// Mock data for PDF report development.
// Mirrors the exact shape the backend API will return.
// DELETE this file once all backend endpoints are confirmed working.
// Every field here corresponds to a column in the ERD.

// ─── REPORT 2: VEHICLE MAINTENANCE ──────────────────────────────────────────

export const mockVehicles = [
  {
    vehicleId: "v001",
    regNumber: "KCA 123A",
    model: "Toyota Coaster",
    capacity: 30,
    status: "FLAGGED",
    currentMileage: 47800,
    lastServiceMileage: 42000,
    lastServiceDate: "2025-11-15",
  },
  {
    vehicleId: "v002",
    regNumber: "KCB 456B",
    model: "Isuzu NQR",
    capacity: 45,
    status: "IN_USE",
    currentMileage: 31200,
    lastServiceMileage: 28500,
    lastServiceDate: "2026-01-10",
  },
  {
    vehicleId: "v003",
    regNumber: "KCC 789C",
    model: "Toyota HiAce",
    capacity: 14,
    status: "AVAILABLE",
    currentMileage: 19500,
    lastServiceMileage: 17000,
    lastServiceDate: "2026-02-01",
  },
  {
    vehicleId: "v004",
    regNumber: "KCD 321D",
    model: "Rosa Bus",
    capacity: 35,
    status: "FLAGGED",
    currentMileage: 88100,
    lastServiceMileage: 82500,
    lastServiceDate: "2025-09-20",
  },
  {
    vehicleId: "v005",
    regNumber: "KCE 654E",
    model: "Isuzu FRR",
    capacity: 50,
    status: "AVAILABLE",
    currentMileage: 54300,
    lastServiceMileage: 53100,
    lastServiceDate: "2026-03-01",
  },
];

// ─── REPORT 1: TRIP COMPLETION ───────────────────────────────────────────────

export const mockTripCompletion = {
  request: {
    requestId: "req-001",
    requesterName: "Dr. Jane Mwangi",
    courseName: "BIO 301 Field Study",
    purpose: "Field research trip to Lake Nakuru",
    destination: "Lake Nakuru National Park",
    tripDate: "2026-03-10",
    groupSize: 24,
    status: "COMPLETED",
    notes: "Students require return by 6PM",
  },
  assignment: {
    assignmentId: "asgn-001",
    vehiclePlate: "KCA 123A",
    vehicleModel: "Toyota Coaster",
    vehicleCapacity: 30,
    driverName: "James Otieno",
    driverContact: "+254 712 345678",
    assignmentNotes: "Ensure fuel is full before departure",
    assignedAt: "2026-03-09T14:30:00",
  },
  tripLog: {
    logId: "log-001",
    startMileage: 47200,
    endMileage: 47580,
    fuelUsed: 28.5,
    startTime: "2026-03-10T07:45:00",
    endTime: "2026-03-10T18:10:00",
    comments: "Trip completed without incident. Students returned safely.",
  },
};

// ─── REPORT 3: DEAN REQUEST HISTORY ─────────────────────────────────────────

export const mockDeanRequests = {
  dateFrom: "2026-03-01",
  dateTo: "2026-03-14",
  generatedBy: "Prof. Samuel Kariuki",
  requests: [
    {
      requestId: "req-001",
      requesterName: "Dr. Jane Mwangi",
      purpose: "Field research trip",
      destination: "Lake Nakuru National Park",
      tripDate: "2026-03-10",
      groupSize: 24,
      status: "APPROVED",
      approvedAt: "2026-03-08T10:15:00",
      approvalComment: "Approved. Ensure transport request is filed.",
    },
    {
      requestId: "req-002",
      requesterName: "Mr. Peter Kamau",
      purpose: "Engineering site visit",
      destination: "Naivasha Industrial Area",
      tripDate: "2026-03-12",
      groupSize: 18,
      status: "APPROVED",
      approvedAt: "2026-03-09T09:00:00",
      approvalComment: "Approved.",
    },
    {
      requestId: "req-003",
      requesterName: "Ms. Alice Wanjiru",
      purpose: "Agriculture field practical",
      destination: "Njoro Research Farm",
      tripDate: "2026-03-13",
      groupSize: 30,
      status: "DECLINED",
      approvedAt: "2026-03-10T11:30:00",
      approvalComment: "Declined. Insufficient notice period.",
    },
    {
      requestId: "req-004",
      requesterName: "Dr. Robert Odhiambo",
      purpose: "Medical outreach program",
      destination: "Rongai Health Centre",
      tripDate: "2026-03-14",
      groupSize: 12,
      status: "PENDING",
      approvedAt: null,
      approvalComment: null,
    },
  ],
};

// ─── REPORT 4: DRIVER PERSONAL TIMETABLE ────────────────────────────────────

export const mockDriverTimetable = {
  driverName: "James Otieno",
  driverId: "usr-004",
  dateFrom: "2026-03-10",
  dateTo: "2026-03-16",
  trips: [
    {
      assignmentId: "asgn-001",
      tripDate: "2026-03-10",
      destination: "Lake Nakuru National Park",
      departureTime: "07:45",
      vehiclePlate: "KCA 123A",
      vehicleModel: "Toyota Coaster",
      groupSize: 24,
      status: "COMPLETED",
    },
    {
      assignmentId: "asgn-005",
      tripDate: "2026-03-13",
      destination: "Naivasha Industrial Area",
      departureTime: "08:00",
      vehiclePlate: "KCA 123A",
      vehicleModel: "Toyota Coaster",
      groupSize: 18,
      status: "PLANNED",
    },
  ],
};

// ─── REPORT 5: MANAGER FLEET TIMETABLE ──────────────────────────────────────

export const mockManagerTimetable = {
  dateFrom: "2026-03-10",
  dateTo: "2026-03-16",
  generatedBy: "Transport Manager",
  trips: [
    {
      assignmentId: "asgn-001",
      tripDate: "2026-03-10",
      departureTime: "07:45",
      driverName: "James Otieno",
      vehiclePlate: "KCA 123A",
      destination: "Lake Nakuru National Park",
      groupSize: 24,
      status: "COMPLETED",
    },
    {
      assignmentId: "asgn-002",
      tripDate: "2026-03-11",
      departureTime: "09:00",
      driverName: "Mary Njeri",
      vehiclePlate: "KCB 456B",
      destination: "Naivasha Industrial Area",
      groupSize: 18,
      status: "COMPLETED",
    },
    {
      assignmentId: "asgn-003",
      tripDate: "2026-03-12",
      departureTime: "08:30",
      driverName: "John Maina",
      vehiclePlate: "KCC 789C",
      destination: "Rongai Health Centre",
      groupSize: 12,
      status: "ACTIVE",
    },
    {
      assignmentId: "asgn-004",
      tripDate: "2026-03-14",
      departureTime: "07:00",
      driverName: "James Otieno",
      vehiclePlate: "KCA 123A",
      destination: "Eldoret Airport",
      groupSize: 8,
      status: "PLANNED",
    },
    {
      assignmentId: "asgn-005",
      tripDate: "2026-03-15",
      departureTime: "08:00",
      driverName: "Mary Njeri",
      vehiclePlate: "KCB 456B",
      destination: "Kisumu City Campus",
      groupSize: 35,
      status: "PLANNED",
    },
  ],
};