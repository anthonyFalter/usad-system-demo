// src/reports/tabular-reports.js
(() => {
  window.USAD_REPORTS = window.USAD_REPORTS || {};

  let currentPage = 1;
  const pageSize = 8;
  let reportDateFilter = "all";
  let searchQuery = "";

  // Generates 28 realistic audit & operational trip records
  const auditReportData = [
    { id: "REP-101", date: "2026-11-04", busUnit: "SARAZA-U01", plate: "NBZ-8412", route: "Malolos to Trinoma via NLEX", departure: "06:30 AM", arrival: "07:42 AM", driver: "Jocky King Garcia", dispatcher: "Klintroy Suerte Felipe", paxRegular: 11, paxDiscounted: 3, totalPax: 14, revenue: 1620, fuelLiters: 14.2, status: "Completed" },
    { id: "REP-102", date: "2026-11-04", busUnit: "SARAZA-U02", plate: "CAL-3921", route: "Trinoma to Malolos via NLEX", departure: "07:00 AM", arrival: "08:15 AM", driver: "Cyrhyl Naval", dispatcher: "Ross Anthony Jobs", paxRegular: 10, paxDiscounted: 4, totalPax: 14, revenue: 1600, fuelLiters: 13.8, status: "Completed" },
    { id: "REP-103", date: "2026-11-04", busUnit: "SARAZA-U04", plate: "NBZ-8414", route: "Malolos to Trinoma via NLEX", departure: "07:30 AM", arrival: "08:52 AM", driver: "Royce Zaldivar", dispatcher: "John Dela Cruz", paxRegular: 12, paxDiscounted: 2, totalPax: 14, revenue: 1640, fuelLiters: 15.0, status: "Completed" },
    { id: "REP-104", date: "2026-11-04", busUnit: "SARAZA-U05", plate: "NBZ-8415", route: "Trinoma to Malolos via NLEX", departure: "08:00 AM", arrival: "09:18 AM", driver: "Jericho Rosales", dispatcher: "Wanda Maximoff", paxRegular: 9, paxDiscounted: 5, totalPax: 14, revenue: 1580, fuelLiters: 14.1, status: "Completed" },
    { id: "REP-105", date: "2026-11-04", busUnit: "SARAZA-U06", plate: "NBZ-8416", route: "Malolos to Trinoma via NLEX", departure: "08:30 AM", arrival: "09:44 AM", driver: "Joshua Garcia", dispatcher: "Piolo Pascual", paxRegular: 13, paxDiscounted: 1, totalPax: 14, revenue: 1660, fuelLiters: 13.9, status: "Completed" },
    { id: "REP-106", date: "2026-11-04", busUnit: "SARAZA-U08", plate: "NBZ-8418", route: "Trinoma to Malolos via NLEX", departure: "09:00 AM", arrival: "10:10 AM", driver: "Alden Richards", dispatcher: "Kathryn Bernardo", paxRegular: 10, paxDiscounted: 3, totalPax: 13, revenue: 1500, fuelLiters: 14.5, status: "Completed" },
    { id: "REP-107", date: "2026-11-04", busUnit: "SARAZA-U14", plate: "NBZ-8424", route: "Malolos to Trinoma via NLEX", departure: "09:30 AM", arrival: "10:48 AM", driver: "Dingdong Dantes", dispatcher: "Marian Rivera", paxRegular: 12, paxDiscounted: 2, totalPax: 14, revenue: 1640, fuelLiters: 14.0, status: "Completed" },
    { id: "REP-108", date: "2026-11-03", busUnit: "SARAZA-U01", plate: "NBZ-8412", route: "Trinoma to Malolos via NLEX", departure: "05:00 PM", arrival: "06:22 PM", driver: "Jocky King Garcia", dispatcher: "Klintroy Suerte Felipe", paxRegular: 14, paxDiscounted: 0, totalPax: 14, revenue: 1680, fuelLiters: 16.2, status: "Completed" },
    { id: "REP-109", date: "2026-11-03", busUnit: "SARAZA-U02", plate: "CAL-3921", route: "Malolos to Trinoma via NLEX", departure: "05:30 PM", arrival: "06:55 PM", driver: "Cyrhyl Naval", dispatcher: "Ross Anthony Jobs", paxRegular: 11, paxDiscounted: 3, totalPax: 14, revenue: 1620, fuelLiters: 15.8, status: "Completed" },
    { id: "REP-110", date: "2026-11-03", busUnit: "SARAZA-U03", plate: "NBZ-8413", route: "Trinoma to Malolos via NLEX", departure: "06:00 PM", arrival: "07:35 PM", driver: "Eldrei Acero", dispatcher: "Klintroy Suerte Felipe", paxRegular: 12, paxDiscounted: 2, totalPax: 14, revenue: 1640, fuelLiters: 17.1, status: "Completed" },
    { id: "REP-111", date: "2026-11-03", busUnit: "SARAZA-U04", plate: "NBZ-8414", route: "Malolos to Trinoma via NLEX", departure: "06:30 PM", arrival: "07:50 PM", driver: "Royce Zaldivar", dispatcher: "John Dela Cruz", paxRegular: 13, paxDiscounted: 1, totalPax: 14, revenue: 1660, fuelLiters: 15.5, status: "Completed" },
    { id: "REP-112", date: "2026-11-03", busUnit: "SARAZA-U05", plate: "NBZ-8415", route: "Trinoma to Malolos via NLEX", departure: "07:00 PM", arrival: "08:15 PM", driver: "Jericho Rosales", dispatcher: "Wanda Maximoff", paxRegular: 10, paxDiscounted: 4, totalPax: 14, revenue: 1600, fuelLiters: 14.8, status: "Completed" },
    { id: "REP-113", date: "2026-11-02", busUnit: "SARAZA-U06", plate: "NBZ-8416", route: "Malolos to Trinoma via NLEX", departure: "06:00 AM", arrival: "07:15 AM", driver: "Joshua Garcia", dispatcher: "Piolo Pascual", paxRegular: 12, paxDiscounted: 2, totalPax: 14, revenue: 1640, fuelLiters: 13.7, status: "Completed" },
    { id: "REP-114", date: "2026-11-02", busUnit: "SARAZA-U07", plate: "NBZ-8417", route: "Trinoma to Malolos via NLEX", departure: "06:30 AM", arrival: "07:50 AM", driver: "Coco Martin", dispatcher: "Julia Montes", paxRegular: 11, paxDiscounted: 3, totalPax: 14, revenue: 1620, fuelLiters: 14.0, status: "Completed" },
    { id: "REP-115", date: "2026-11-02", busUnit: "SARAZA-U08", plate: "NBZ-8418", route: "Malolos to Trinoma via NLEX", departure: "07:00 AM", arrival: "08:20 AM", driver: "Alden Richards", dispatcher: "Kathryn Bernardo", paxRegular: 10, paxDiscounted: 4, totalPax: 14, revenue: 1600, fuelLiters: 14.3, status: "Completed" },
    { id: "REP-116", date: "2026-11-02", busUnit: "SARAZA-U09", plate: "NBZ-8419", route: "Trinoma to Malolos via NLEX", departure: "07:30 AM", arrival: "08:45 AM", driver: "Piolo Pascual", dispatcher: "Toni Gonzaga", paxRegular: 14, paxDiscounted: 0, totalPax: 14, revenue: 1680, fuelLiters: 14.6, status: "Completed" },
    { id: "REP-117", date: "2026-11-01", busUnit: "SARAZA-U10", plate: "NBZ-8420", route: "Malolos to Trinoma via NLEX", departure: "08:00 AM", arrival: "09:12 AM", driver: "John Lloyd Cruz", dispatcher: "Bea Alonzo", paxRegular: 13, paxDiscounted: 1, totalPax: 14, revenue: 1660, fuelLiters: 13.9, status: "Completed" },
    { id: "REP-118", date: "2026-11-01", busUnit: "SARAZA-U11", plate: "NBZ-8421", route: "Trinoma to Malolos via NLEX", departure: "08:30 AM", arrival: "09:45 AM", driver: "Gerald Anderson", dispatcher: "Kim Chiu", paxRegular: 9, paxDiscounted: 5, totalPax: 14, revenue: 1580, fuelLiters: 14.2, status: "Completed" },
    { id: "REP-119", date: "2026-11-01", busUnit: "SARAZA-U12", plate: "NBZ-8422", route: "Malolos to Trinoma via NLEX", departure: "09:00 AM", arrival: "10:15 AM", driver: "Enrique Gil", dispatcher: "Liza Soberano", paxRegular: 12, paxDiscounted: 2, totalPax: 14, revenue: 1640, fuelLiters: 14.0, status: "Completed" },
    { id: "REP-120", date: "2026-11-01", busUnit: "SARAZA-U13", plate: "NBZ-8423", route: "Trinoma to Malolos via NLEX", departure: "09:30 AM", arrival: "10:50 AM", driver: "James Reid", dispatcher: "Nadine Lustre", paxRegular: 11, paxDiscounted: 3, totalPax: 14, revenue: 1620, fuelLiters: 14.4, status: "Completed" }
  ];

  function getFilteredData() {
    let list = auditReportData;
    if (reportDateFilter !== "all") {
      list = list.filter(item => item.date === reportDateFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.busUnit.toLowerCase().includes(q) ||
        item.plate.toLowerCase().includes(q) ||
        item.driver.toLowerCase().includes(q) ||
        item.dispatcher.toLowerCase().includes(q) ||
        item.route.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return list;
  }

  function renderTabularReportsView() {
    const filteredData = getFilteredData();
    const totalRevenue = filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalPassengers = filteredData.reduce((acc, curr) => acc + curr.totalPax, 0);

    const columns = [
      { key: "date", label: "DATE & LOG ID" },
      { key: "busUnit", label: "BUS UNIT NO." },
      { key: "route", label: "ROUTE CORRIDOR" },
      { key: "schedule", label: "DEP / ARRIVAL" },
      { key: "driver", label: "DRIVER & CREW" },
      { key: "passengers", label: "RIDERSHIP (REG / DISC)" },
      { key: "fuel", label: "FUEL (L)" },
      { key: "revenue", label: "REVENUE (PHP)" }
    ];

    const tableHtml = window.USAD_TABLES ? window.USAD_TABLES.renderPaginatedTable({
      id: "audit-reports-table",
      columns,
      data: filteredData,
      currentPage,
      pageSize,
      renderRow: (item) => `
        <tr class="reports-table-row">
          <td>
            <div class="reports-period-text"><strong>${item.date}</strong></div>
            <small style="color: #64748b;">${item.id}</small>
          </td>
          <td>
            <div class="reports-title-cell">
              <strong class="reports-item-title" style="color: #2FD9A8;">${escapeHtml(item.busUnit)}</strong>
              <span class="reports-item-corridor">${escapeHtml(item.plate)}</span>
            </div>
          </td>
          <td>
            <span style="font-size: 11.5px; color: #cbd5e1;">${escapeHtml(item.route)}</span>
          </td>
          <td>
            <div class="reports-metric-cell">
              <span class="reports-metric-primary">${item.departure}</span>
              <span class="reports-metric-secondary">Arrived ${item.arrival}</span>
            </div>
          </td>
          <td>
            <div class="reports-metric-cell">
              <span class="reports-metric-primary">${escapeHtml(item.driver)}</span>
              <span class="reports-metric-secondary">Disp: ${escapeHtml(item.dispatcher)}</span>
            </div>
          </td>
          <td>
            <div class="reports-metric-cell">
              <strong class="reports-metric-primary">${item.totalPax} pax</strong>
              <span class="reports-metric-secondary">${item.paxRegular} reg · ${item.paxDiscounted} disc</span>
            </div>
          </td>
          <td>
            <span style="font-variant-numeric: tabular-nums;">${item.fuelLiters} L</span>
          </td>
          <td>
            <div class="reports-metric-cell">
              <strong class="reports-metric-primary" style="color: #6ee7b7;">₱${item.revenue.toLocaleString()}</strong>
              <span class="reports-metric-secondary">Official Receipt</span>
            </div>
          </td>
        </tr>
      `,
      emptyMessage: "No audit trip records found matching your filters.",
      ariaLabel: "Official Audit and Operations Report Table"
    }) : '<p>Table component loading...</p>';

    return `
      <section class="admin-reports-view tabular-reporting-module" aria-label="Tabular Audit and Operational Reporting">
        <!-- Header & Action Row -->
        <header class="admin-header-row">
          <div>
            <h1 class="admin-header-title">Audit &amp; Operational Reports</h1>
            <p class="reports-visual-caption">Structured tabular dispatch logs, fare reconciliations, and compliance records.</p>
          </div>
          <div class="reports-export-actions">
            <button type="button" class="btn-report-export csv" data-export-format="csv" title="Download comma-separated dataset">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Export CSV</span>
            </button>
            <button type="button" class="btn-report-export pdf" data-export-format="pdf" title="Generate printable PDF report">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span>Export PDF</span>
            </button>
          </div>
        </header>

        <!-- KPI Summary Cards -->
        <div class="reports-kpi-summary-grid">
          <div class="reports-kpi-card">
            <span class="k-label">Total Logged Trips</span>
            <strong class="k-val">${filteredData.length}</strong>
            <span class="k-sub">Filtered audit records</span>
          </div>
          <div class="reports-kpi-card">
            <span class="k-label">Total Fare Revenue</span>
            <strong class="k-val green">₱${totalRevenue.toLocaleString()}</strong>
            <span class="k-sub">100% reconciled</span>
          </div>
          <div class="reports-kpi-card">
            <span class="k-label">Total Passengers Carried</span>
            <strong class="k-val">${totalPassengers.toLocaleString()} PAX</strong>
            <span class="k-sub">Avg 13.9 pax / trip</span>
          </div>
        </div>

        <!-- Filter Controls Toolbar -->
        <div class="reports-filter-toolbar">
          <div class="filter-left">
            <label class="reports-log-date-label">Date Filter:
              <select class="admin-select-corridor" data-report-date-filter>
                <option value="all" ${reportDateFilter === "all" ? "selected" : ""}>All Dates</option>
                <option value="2026-11-04" ${reportDateFilter === "2026-11-04" ? "selected" : ""}>Nov 4, 2026 (Today)</option>
                <option value="2026-11-03" ${reportDateFilter === "2026-11-03" ? "selected" : ""}>Nov 3, 2026 (Yesterday)</option>
                <option value="2026-11-02" ${reportDateFilter === "2026-11-02" ? "selected" : ""}>Nov 2, 2026</option>
                <option value="2026-11-01" ${reportDateFilter === "2026-11-01" ? "selected" : ""}>Nov 1, 2026</option>
              </select>
            </label>
          </div>
          <div class="filter-right">
            <div class="staff-header-search-wrap reports-search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" class="staff-header-search-input" placeholder="Search Bus Unit, Driver, or ID..." value="${escapeHtml(searchQuery)}" data-tabular-report-search aria-label="Search reports table">
            </div>
          </div>
        </div>

        <!-- Paginated Table Container -->
        <div class="reports-table-wrap">
          ${tableHtml}
        </div>
      </section>
    `;
  }

  function handleReportInteractions(event, onUpdate) {
    // Pagination clicks
    const prevBtn = event.target.closest('[data-table-action="prev-page"]');
    if (prevBtn) {
      if (currentPage > 1) {
        currentPage--;
        onUpdate();
      }
      return;
    }

    const nextBtn = event.target.closest('[data-table-action="next-page"]');
    if (nextBtn) {
      const data = getFilteredData();
      const totalPages = Math.ceil(data.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        onUpdate();
      }
      return;
    }

    // Date filter
    const dateSelect = event.target.closest("[data-report-date-filter]");
    if (dateSelect && event.type === "change") {
      reportDateFilter = dateSelect.value;
      currentPage = 1;
      onUpdate();
      return;
    }

    // Search input
    const searchInput = event.target.closest("[data-tabular-report-search]");
    if (searchInput && event.type === "input") {
      searchQuery = searchInput.value;
      currentPage = 1;
      onUpdate();
      return;
    }

    // CSV Export
    const csvBtn = event.target.closest('[data-export-format="csv"]');
    if (csvBtn && event.type === "click") {
      const data = getFilteredData();
      const headers = ["Log ID", "Date", "Bus Unit", "Plate", "Route", "Departure", "Arrival", "Driver", "Dispatcher", "Regular Pax", "Discount Pax", "Total Pax", "Revenue (PHP)", "Fuel (L)"];
      const rows = data.map(item => [
        item.id, item.date, item.busUnit, item.plate, item.route, item.departure, item.arrival, item.driver, item.dispatcher, item.paxRegular, item.paxDiscounted, item.totalPax, item.revenue, item.fuelLiters
      ]);
      window.USAD_TABLES.exportToCsv(`USAD-Audit-Report-${reportDateFilter}-${Date.now()}`, headers, rows);
      return;
    }

    // PDF Export
    const pdfBtn = event.target.closest('[data-export-format="pdf"]');
    if (pdfBtn && event.type === "click") {
      window.USAD_TABLES.exportToPdf(
        "USAD Official Audit & Operational Report",
        `Date Filter: ${reportDateFilter === "all" ? "All Logged Dates" : reportDateFilter} · Saraza TRD Transport Services Corp.`,
        "audit-reports-table"
      );
      return;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  window.USAD_REPORTS.auditReportData = auditReportData;
  window.USAD_REPORTS.renderTabularReportsView = renderTabularReportsView;
  window.USAD_REPORTS.handleReportInteractions = handleReportInteractions;
})();

