// Get saved reports from localStorage.
const reports = JSON.parse(
    localStorage.getItem("campusFindReports") || "[]"
);

// Your existing sample items.
const sampleItems = [
    { status: "Lost" },
    { status: "Found" },
    { status: "Found" },
    { status: "Lost" },
    { status: "Found" },
    { status: "Lost" },
    { status: "Found" },
    { status: "Lost" },
    { status: "Found" }
];


const allItems = [...sampleItems, ...reports];

// Calculate statistics.
const total = allItems.length;

const lost = allItems.filter(
    item => item.status === "Lost"
).length;

const found = allItems.filter(
    item => item.status === "Found"
).length;

// Display statistics.
document.getElementById("totalItems").textContent = total;

document.getElementById("lostItems").textContent = lost;

document.getElementById("foundItems").textContent = found;