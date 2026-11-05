const items = [
  {
    id: 1,
    name: "Black Backpack",
    category: "Bags",
    status: "Lost",
    description: "Black backpack with a laptop inside.",
    location: "Main Gate",
    date: "2026-10-24",
    image: "lott.jpg"
  },
  {
    id: 2,
    name: "iPhone",
    category: "Electronics",
    status: "Found",
    description: "Black phone found near the library.",
    location: "Library",
    date: "2026-10-23",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Phone"
  },
  {
    id: 3,
    name: "Wrist Watch",
    category: "Accessories",
    status: "Found",
    description: "Silver wrist watch left in a classroom.",
    location: "Lecture Hall",
    date: "2026-10-22",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Wrist+Watch"
  },
  {
    id: 4,
    name: "White Earbuds",
    category: "Electronics",
    status: "Lost",
    description: "White wireless earbuds in a charging case.",
    location: "Cafeteria",
    date: "2026-10-21",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Earbuds"
  },
  {
    id: 5,
    name: "Blue Notebook",
    category: "Books",
    status: "Found",
    description: "Blue notebook with handwritten class notes.",
    location: "Library",
    date: "2026-10-20",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Notebook"
  },
  {
    id: 6,
    name: "Blue Hoodie",
    category: "Clothing",
    status: "Lost",
    description: "Dark blue hoodie left after a lecture.",
    location: "Hostel",
    date: "2026-10-19",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Hoodie"
  },
  {
    id: 7,
    name: "Student ID Card",
    category: "Others",
    status: "Found",
    description: "Student identity card found on the walkway.",
    location: "Admin Block",
    date: "2026-10-18",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Student+ID"
  },
  {
    id: 8,
    name: "Laptop Charger",
    category: "Electronics",
    status: "Lost",
    description: "Laptop charger with a black cable.",
    location: "Computer Lab",
    date: "2026-10-17",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=Charger"
  },
  {
    id: 9,
    name: "House Keys",
    category: "Accessories",
    status: "Found",
    description: "A set of keys with a small keyring.",
    location: "Sports Ground",
    date: "2026-10-16",
    image: "https://placehold.co/600x400/e7edf5/243b5a?text=House+Keys"
  }
];

// Load reports saved from the Report Item page.
let savedReports = [];

try {
  savedReports = JSON.parse(
    localStorage.getItem("campusFindReports") || "[]"
  );

  if (!Array.isArray(savedReports)) {
    savedReports = [];
  }
} catch (error) {
  console.error("Could not load saved reports:", error);
}

items.unshift(...savedReports);

// Page elements.
const itemsGrid = document.getElementById("itemsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const resultsCount = document.getElementById("resultsCount");
const loadMoreButton = document.getElementById("loadMoreButton");
const emptyState = document.getElementById("emptyState");
const resetButton = document.getElementById("resetButton");
const itemDialog = document.getElementById("itemDialog");
const dialogContent = document.getElementById("dialogContent");
const closeDialog = document.getElementById("closeDialog");

const ITEMS_PER_PAGE = 6;

let visibleCount = ITEMS_PER_PAGE;
let filteredItems = [...items];

// Protect text before displaying it in HTML.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Format dates.
function formatDate(dateString) {
  if (!dateString) return "Date not provided";

  const date = new Date(dateString + "T12:00:00");

  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Format Nigerian phone numbers for WhatsApp.
function formatWhatsAppNumber(phone) {
  let number = String(phone || "").replace(/\D/g, "");

  // Convert Nigerian local numbers to international format.
  if (number.startsWith("0")) {
    number = "234" + number.substring(1);
  }

  return number;
}

// Create an item card.
function createCard(item) {
  const safeName = escapeHTML(item.name);
  const safeDescription = escapeHTML(item.description);
  const safeCategory = escapeHTML(item.category);
  const safeLocation = escapeHTML(item.location);
  const safeStatus = escapeHTML(item.status);
  const safeImage = escapeHTML(item.image);

  const phoneNumber = formatWhatsAppNumber(item.phone);

  const badgeClass = item.status === "Lost"
    ? "status-lost"
    : "status-found";

  return `
    <article class="item-card">

      <div class="item-image-wrap">
        <img
          class="item-image"
          src="${safeImage}"
          alt="${safeName}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x400/e7edf5/243b5a?text=Item+Photo'"
        >

        <span class="status-badge ${badgeClass}">
          ${safeStatus}
        </span>
      </div>

      <div class="item-info">

        <h3>${safeName}</h3>

        <p class="item-description">
          ${safeDescription}
        </p>

        <div class="item-meta">
          <span>▦ ${safeCategory}</span>
          <span>⌖ ${safeLocation}</span>
          <span>▣ ${formatDate(item.date)}</span>
        </div>

        ${
          phoneNumber
            ? `
              <a
                class="whatsapp-link"
                href="https://wa.me/${phoneNumber}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact on WhatsApp
              </a>
            `
            : ""
        }

        <div class="card-footer">

          <span>${safeStatus} item</span>

          <button
            class="view-button"
            data-item-id="${item.id}"
            type="button"
          >
            View Details
          </button>

        </div>

      </div>

    </article>
  `;
}

// Display items.
function renderItems() {
  const visibleItems = filteredItems.slice(0, visibleCount);

  itemsGrid.innerHTML = visibleItems.map(createCard).join("");

  resultsCount.textContent =
    `Showing ${visibleItems.length} of ${filteredItems.length} items`;

  emptyState.hidden = filteredItems.length !== 0;
  itemsGrid.hidden = filteredItems.length === 0;

  loadMoreButton.disabled =
    visibleCount >= filteredItems.length;
}

// Search and filter items.
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;

  filteredItems = items.filter(item => {

    const searchableText = [
      item.name,
      item.description,
      item.location,
      item.category
    ].join(" ").toLowerCase();

    const matchesSearch =
      searchableText.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" ||
      item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  visibleCount = ITEMS_PER_PAGE;

  renderItems();
}

// Show item details.
function showItemDetails(id) {
  const item = items.find(item => item.id === id);

  if (!item) return;

  const phoneNumber = formatWhatsAppNumber(item.phone);

  dialogContent.innerHTML = `
    <h2>${escapeHTML(item.name)}</h2>

    <img
      class="dialog-image"
      src="${escapeHTML(item.image)}"
      alt="${escapeHTML(item.name)}"
    >

    <div class="dialog-details">

      <p>
        <strong>Status:</strong>
        ${escapeHTML(item.status)}
      </p>

      <p>
        <strong>Category:</strong>
        ${escapeHTML(item.category)}
      </p>

      <p>
        <strong>Description:</strong>
        ${escapeHTML(item.description)}
      </p>

      <p>
        <strong>Location:</strong>
        ${escapeHTML(item.location)}
      </p>

      <p>
        <strong>Email:</strong>
        ${escapeHTML(item.email || "Not provided")}
      </p>

      <p>
        <strong>Phone:</strong>
        ${escapeHTML(item.phone || "Not provided")}
      </p>

      <p>
        <strong>Date reported:</strong>
        ${formatDate(item.date)}
      </p>

      ${
        phoneNumber
          ? `
            <a
              class="whatsapp-link"
              href="https://wa.me/${phoneNumber}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact on WhatsApp
            </a>
          `
          : ""
      }

    </div>
  `;

  if (!itemDialog.open) {
    itemDialog.showModal();
  }
}

// Event listeners.
searchInput.addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);

statusFilter.addEventListener("change", applyFilters);

loadMoreButton.addEventListener("click", () => {
  visibleCount += ITEMS_PER_PAGE;
  renderItems();
});

itemsGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-item-id]");

  if (button) {
    showItemDetails(Number(button.dataset.itemId));
  }
});

closeDialog.addEventListener("click", () => {
  itemDialog.close();
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "All";
  statusFilter.value = "All";

  applyFilters();
});

// Display items when the page loads.
renderItems();