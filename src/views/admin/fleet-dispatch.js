// src/views/admin/fleet-dispatch.js
(() => {
  window.USAD_FLEET = window.USAD_FLEET || {};

  // Standardized fleet dataset: 20 units with official Bus Unit Numbers (SARAZA-U01 to SARAZA-U20)
  const initialFleetData = [
    {
      id: "bus-01",
      unitNumber: "SARAZA-U01",
      plateNumber: "NBZ-8412",
      driver: "Jocky King Garcia",
      dispatcher: "Klintroy Suerte Felipe",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Duty", // On Duty, Standby, On Break, Maintenance
      operationalState: "active", // active (in-service), standby, break, maintenance
      fuel: "86%",
      speed: "42 km/h",
      telemetry: { tire: "34 PSI", temp: "88°C", oil: "Optimal", location: "NLEX Northbound Km 34" }
    },
    {
      id: "bus-02",
      unitNumber: "SARAZA-U02",
      plateNumber: "CAL-3921",
      driver: "Cyrhyl Naval",
      dispatcher: "Ross Anthony Jobs",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Break",
      operationalState: "break",
      fuel: "54%",
      speed: "0 km/h (Depot)",
      telemetry: { tire: "33 PSI", temp: "42°C", oil: "Good", location: "Malolos Depot Bay 2" }
    },
    {
      id: "bus-03",
      unitNumber: "SARAZA-U03",
      plateNumber: "NBZ-8413",
      driver: "Eldrei Acero",
      dispatcher: "Klintroy Suerte Felipe",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "92%",
      speed: "Parked",
      telemetry: { tire: "35 PSI", temp: "38°C", oil: "Optimal", location: "Robinsons Malolos Staging" }
    },
    {
      id: "bus-04",
      unitNumber: "SARAZA-U04",
      plateNumber: "NBZ-8414",
      driver: "Royce Zaldivar",
      dispatcher: "John Dela Cruz",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Duty",
      operationalState: "active",
      fuel: "71%",
      speed: "55 km/h",
      telemetry: { tire: "35 PSI", temp: "91°C", oil: "Optimal", location: "NLEX Balintawak" }
    },
    {
      id: "bus-05",
      unitNumber: "SARAZA-U05",
      plateNumber: "NBZ-8415",
      driver: "Jericho Rosales",
      dispatcher: "Wanda Maximoff",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "On Duty",
      operationalState: "active",
      fuel: "62%",
      speed: "38 km/h",
      telemetry: { tire: "34 PSI", temp: "87°C", oil: "Optimal", location: "Trinoma Terminal" }
    },
    {
      id: "bus-06",
      unitNumber: "SARAZA-U06",
      plateNumber: "NBZ-8416",
      driver: "Joshua Garcia",
      dispatcher: "Piolo Pascual",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Duty",
      operationalState: "active",
      fuel: "90%",
      speed: "48 km/h",
      telemetry: { tire: "34 PSI", temp: "89°C", oil: "Optimal", location: "Malolos Crossing" }
    },
    {
      id: "bus-07",
      unitNumber: "SARAZA-U07",
      plateNumber: "NBZ-8417",
      driver: "Coco Martin",
      dispatcher: "Julia Montes",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "85%",
      speed: "Parked",
      telemetry: { tire: "34 PSI", temp: "36°C", oil: "Optimal", location: "Trinoma Staging Bay" }
    },
    {
      id: "bus-08",
      unitNumber: "SARAZA-U08",
      plateNumber: "NBZ-8418",
      driver: "Alden Richards",
      dispatcher: "Kathryn Bernardo",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Duty",
      operationalState: "active",
      fuel: "77%",
      speed: "45 km/h",
      telemetry: { tire: "34 PSI", temp: "86°C", oil: "Optimal", location: "Bocaue Toll Plaza" }
    },
    {
      id: "bus-09",
      unitNumber: "SARAZA-U09",
      plateNumber: "NBZ-8419",
      driver: "Dingdong Dantes",
      dispatcher: "Marian Rivera",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "95%",
      speed: "Parked",
      telemetry: { tire: "35 PSI", temp: "35°C", oil: "Optimal", location: "Malolos Central Depot" }
    },
    {
      id: "bus-10",
      unitNumber: "SARAZA-U10",
      plateNumber: "NBZ-8420",
      driver: "John Lloyd Cruz",
      dispatcher: "Bea Alonzo",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "Maintenance",
      operationalState: "maintenance",
      fuel: "40%",
      speed: "In Shop",
      telemetry: { tire: "30 PSI", temp: "28°C", oil: "Service Due", location: "Saraza Motorpool" }
    },
    {
      id: "bus-11",
      unitNumber: "SARAZA-U11",
      plateNumber: "NBZ-8421",
      driver: "Gerald Anderson",
      dispatcher: "Kim Chiu",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "88%",
      speed: "Parked",
      telemetry: { tire: "34 PSI", temp: "35°C", oil: "Optimal", location: "Trinoma Staging" }
    },
    {
      id: "bus-12",
      unitNumber: "SARAZA-U12",
      plateNumber: "NBZ-8422",
      driver: "Enrique Gil",
      dispatcher: "Liza Soberano",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Break",
      operationalState: "break",
      fuel: "65%",
      speed: "0 km/h",
      telemetry: { tire: "33 PSI", temp: "40°C", oil: "Good", location: "Depot Lounge" }
    },
    {
      id: "bus-13",
      unitNumber: "SARAZA-U13",
      plateNumber: "NBZ-8423",
      driver: "James Reid",
      dispatcher: "Nadine Lustre",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "90%",
      speed: "Parked",
      telemetry: { tire: "34 PSI", temp: "34°C", oil: "Optimal", location: "Malolos Staging" }
    },
    {
      id: "bus-14",
      unitNumber: "SARAZA-U14",
      plateNumber: "NBZ-8424",
      driver: "Daniel Padilla",
      dispatcher: "Kathryn Bernardo",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "On Duty",
      operationalState: "active",
      fuel: "83%",
      speed: "50 km/h",
      telemetry: { tire: "35 PSI", temp: "88°C", oil: "Optimal", location: "Marilao Interchange" }
    },
    {
      id: "bus-15",
      unitNumber: "SARAZA-U15",
      plateNumber: "NBZ-8425",
      driver: "Piolo Pascual",
      dispatcher: "Toni Gonzaga",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "91%",
      speed: "Parked",
      telemetry: { tire: "35 PSI", temp: "35°C", oil: "Optimal", location: "Trinoma Bay 4" }
    },
    {
      id: "bus-16",
      unitNumber: "SARAZA-U16",
      plateNumber: "NBZ-8426",
      driver: "Sam Milby",
      dispatcher: "Bea Alonzo",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "89%",
      speed: "Parked",
      telemetry: { tire: "34 PSI", temp: "34°C", oil: "Optimal", location: "Malolos Bay 2" }
    },
    {
      id: "bus-17",
      unitNumber: "SARAZA-U17",
      plateNumber: "NBZ-8427",
      driver: "Zanjoe Marudo",
      dispatcher: "Kim Chiu",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Maintenance",
      operationalState: "maintenance",
      fuel: "35%",
      speed: "In Shop",
      telemetry: { tire: "29 PSI", temp: "26°C", oil: "Inspection", location: "Saraza Motorpool" }
    },
    {
      id: "bus-18",
      unitNumber: "SARAZA-U18",
      plateNumber: "NBZ-8428",
      driver: "Carlo Aquino",
      dispatcher: "Angelica Panganiban",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "94%",
      speed: "Parked",
      telemetry: { tire: "35 PSI", temp: "33°C", oil: "Optimal", location: "Robinsons Malolos" }
    },
    {
      id: "bus-19",
      unitNumber: "SARAZA-U19",
      plateNumber: "NBZ-8429",
      driver: "Paulo Avelino",
      dispatcher: "Janine Gutierrez",
      route: "Trinoma to Malolos via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "87%",
      speed: "Parked",
      telemetry: { tire: "34 PSI", temp: "35°C", oil: "Optimal", location: "Trinoma Bay 2" }
    },
    {
      id: "bus-20",
      unitNumber: "SARAZA-U20",
      plateNumber: "NBZ-8430",
      driver: "JM de Guzman",
      dispatcher: "Barbie Imperial",
      route: "Malolos to Trinoma via NLEX",
      passengerCapacity: 14,
      status: "Standby",
      operationalState: "standby",
      fuel: "92%",
      speed: "Parked",
      telemetry: { tire: "35 PSI", temp: "34°C", oil: "Optimal", location: "Malolos Staging" }
    }
  ];

  let fleetList = [...initialFleetData];
  let fleetFilter = "all"; // all, dispatchable, active, standby, maintenance
  let fleetSearch = "";
  let currentPage = 1;
  const pageSize = 6;
  let activeEditBus = null;

  // Compute fleet availability counters
  function getFleetAvailabilityCounters() {
    const totalBuses = fleetList.length;
    // Dispatchable = active in-service + standby ready units (excluding maintenance or unavailable)
    const activeUnits = fleetList.filter(b => b.operationalState === "active");
    const standbyUnits = fleetList.filter(b => b.operationalState === "standby");
    const onBreakUnits = fleetList.filter(b => b.operationalState === "break");
    const maintenanceUnits = fleetList.filter(b => b.operationalState === "maintenance");
    const dispatchableBuses = activeUnits.length + standbyUnits.length;

    return {
      totalBuses,
      dispatchableBuses,
      activeUnitsCount: activeUnits.length,
      standbyUnitsCount: standbyUnits.length,
      onBreakUnitsCount: onBreakUnits.length,
      maintenanceUnitsCount: maintenanceUnits.length
    };
  }

  function getFilteredFleet() {
    let list = fleetList;
    if (fleetFilter === "dispatchable") {
      list = list.filter(b => b.operationalState === "active" || b.operationalState === "standby");
    } else if (fleetFilter === "active") {
      list = list.filter(b => b.operationalState === "active");
    } else if (fleetFilter === "standby") {
      list = list.filter(b => b.operationalState === "standby");
    } else if (fleetFilter === "break") {
      list = list.filter(b => b.operationalState === "break");
    } else if (fleetFilter === "maintenance") {
      list = list.filter(b => b.operationalState === "maintenance");
    }

    if (fleetSearch.trim()) {
      const q = fleetSearch.toLowerCase().trim();
      list = list.filter(b =>
        b.unitNumber.toLowerCase().includes(q) ||
        b.plateNumber.toLowerCase().includes(q) ||
        b.driver.toLowerCase().includes(q) ||
        b.dispatcher.toLowerCase().includes(q) ||
        b.route.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
      );
    }
    return list;
  }

  function renderFleetDispatchDashboard(options = {}) {
    const counters = getFleetAvailabilityCounters();
    const filteredList = getFilteredFleet();

    const columns = [
      { key: "unit", label: "OFFICIAL BUS UNIT NO." },
      { key: "crew", label: "DRIVER & CREW ASSIGNMENT" },
      { key: "route", label: "ROUTE & TELEMETRY" },
      { key: "capacity", label: "CAPACITY" },
      { key: "fuel", label: "FUEL & SPEED" },
      { key: "status", label: "OPERATIONAL STATUS" },
      { key: "actions", label: "ACTIONS", align: "center" }
    ];

    const tableHtml = window.USAD_TABLES ? window.USAD_TABLES.renderPaginatedTable({
      id: "fleet-management-table",
      columns,
      data: filteredList,
      currentPage,
      pageSize,
      renderRow: (bus) => {
        const isDispatchable = bus.operationalState === "active" || bus.operationalState === "standby";
        const statusBadgeClass = bus.operationalState === "active" ? "green" : bus.operationalState === "standby" ? "cyan" : bus.operationalState === "break" ? "amber" : "red";
        return `
          <tr class="fleet-table-row">
            <td>
              <div class="fleet-unit-badge">
                <strong class="unit-code-strong">${escapeHtml(bus.unitNumber)}</strong>
                <span class="plate-code-sub">${escapeHtml(bus.plateNumber)}</span>
              </div>
            </td>
            <td>
              <div class="reports-metric-cell">
                <span class="reports-metric-primary"><strong>${escapeHtml(bus.driver)}</strong></span>
                <span class="reports-metric-secondary">Dispatcher: ${escapeHtml(bus.dispatcher)}</span>
              </div>
            </td>
            <td>
              <div class="reports-metric-cell">
                <span class="reports-metric-primary">${escapeHtml(bus.route)}</span>
                <span class="reports-metric-secondary">${escapeHtml(bus.telemetry.location)}</span>
              </div>
            </td>
            <td>
              <span class="capacity-pill">${bus.passengerCapacity} Passenger Seats</span>
            </td>
            <td>
              <div class="reports-metric-cell">
                <span class="reports-metric-primary">${bus.fuel} Fuel</span>
                <span class="reports-metric-secondary">${bus.speed}</span>
              </div>
            </td>
            <td>
              <span class="status-pill-telemetry ${statusBadgeClass}">
                <span class="status-dot"></span>${escapeHtml(bus.status)}
              </span>
            </td>
            <td style="text-align: center;">
              <button type="button" class="btn-manage-bus" data-fleet-edit-bus="${bus.id}" title="Edit bus and crew assignment">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Manage</span>
              </button>
            </td>
          </tr>
        `;
      },
      emptyMessage: "No fleet units found matching your search.",
      ariaLabel: "Standardized Fleet Roster Table"
    }) : '<p>Table component loading...</p>';

    // Extract pre-booking readiness, map card, and dispatch control panel from original content if provided
    let originalExtraSections = "";
    if (options.originalContent) {
      // Extract everything from <section class="peak-readiness-card" or <section class="admin-radar-map-card" to the end
      const mapIndex = options.originalContent.indexOf('<section class="admin-radar-map-card">');
      const peakIndex = options.originalContent.indexOf('<section class="peak-readiness-card"');
      const startIndex = peakIndex !== -1 ? peakIndex : mapIndex;
      if (startIndex !== -1) {
        originalExtraSections = options.originalContent.substring(startIndex);
      }
    }

    return `
      <section class="admin-fleet-view-standardized" aria-label="Fleet Management & Asset Roster">
        <!-- Top Title Row -->
        <header class="admin-header-row">
          <div>
            <div class="clerk-tag">FLEET DISPATCH &amp; ASSET MANAGEMENT</div>
            <h1 class="admin-header-title">Fleet Deployment &amp; Availability</h1>
            <p class="reports-visual-caption">Official standardized Bus Unit Numbers (SARAZA-U01 – U20), driver crew assignments, and availability tracking.</p>
          </div>
          <div class="reports-export-actions">
            <button type="button" class="btn-report-export csv" data-fleet-export="csv" title="Download fleet roster as CSV">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Export Fleet CSV</span>
            </button>
          </div>
        </header>

        <!-- Operational Status Availability Counters -->
        <div class="fleet-availability-counters-grid">
          <div class="counter-card primary-counter">
            <div class="counter-header">
              <span class="counter-label">TOTAL FLEET ASSETS</span>
              <span class="counter-badge">Registered Units</span>
            </div>
            <div class="counter-figure">${counters.totalBuses} Units</div>
            <span class="counter-sub">Full operational inventory</span>
          </div>

          <div class="counter-card dispatchable-counter">
            <div class="counter-header">
              <span class="counter-label">DISPATCHABLE BUSES</span>
              <span class="counter-badge green">Ready for Service</span>
            </div>
            <div class="counter-figure green">${counters.dispatchableBuses} / ${counters.totalBuses}</div>
            <span class="counter-sub">${counters.activeUnitsCount} Active in-service · ${counters.standbyUnitsCount} Standby ready</span>
          </div>

          <div class="counter-card active-counter">
            <div class="counter-header">
              <span class="counter-label">ACTIVE IN-SERVICE</span>
              <span class="counter-badge cyan">On Route</span>
            </div>
            <div class="counter-figure cyan">${counters.activeUnitsCount} Units</div>
            <span class="counter-sub">Under active transit dispatch</span>
          </div>

          <div class="counter-card standby-counter">
            <div class="counter-header">
              <span class="counter-label">STANDBY RESERVE</span>
              <span class="counter-badge">Depot &amp; Terminals</span>
            </div>
            <div class="counter-figure amber">${counters.standbyUnitsCount} Units</div>
            <span class="counter-sub">${counters.onBreakUnitsCount} on break · ${counters.maintenanceUnitsCount} maintenance</span>
          </div>
        </div>

        <!-- Filter and Search Toolbar -->
        <div class="fleet-toolbar-row">
          <div class="fleet-filter-tabs" role="tablist">
            <button type="button" class="admin-filter-pill ${fleetFilter === 'all' ? 'is-active' : ''}" data-fleet-filter="all">All Units (${counters.totalBuses})</button>
            <button type="button" class="admin-filter-pill ${fleetFilter === 'dispatchable' ? 'is-active' : ''}" data-fleet-filter="dispatchable">Dispatchable (${counters.dispatchableBuses})</button>
            <button type="button" class="admin-filter-pill ${fleetFilter === 'active' ? 'is-active' : ''}" data-fleet-filter="active">Active On-Duty (${counters.activeUnitsCount})</button>
            <button type="button" class="admin-filter-pill ${fleetFilter === 'standby' ? 'is-active' : ''}" data-fleet-filter="standby">Standby (${counters.standbyUnitsCount})</button>
            <button type="button" class="admin-filter-pill ${fleetFilter === 'maintenance' ? 'is-active' : ''}" data-fleet-filter="maintenance">Maintenance (${counters.maintenanceUnitsCount})</button>
          </div>
          <div class="staff-header-search-wrap fleet-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="staff-header-search-input" placeholder="Search Unit Number, Plate, Driver..." value="${escapeHtml(fleetSearch)}" data-fleet-search-input aria-label="Search fleet assets">
          </div>
        </div>

        <!-- Table Container -->
        <div class="reports-table-wrap">
          ${tableHtml}
        </div>

        <!-- Integrated Live Fleet Radar Map & Dispatch Controls -->
        ${originalExtraSections ? `
          <div class="fleet-map-integrated-wrapper" style="margin-top: 24px;">
            ${originalExtraSections}
          </div>
        ` : ''}

        <!-- Bus & Crew Management Modal Container -->
        ${activeEditBus ? renderBusEditModal(activeEditBus) : ''}
      </section>
    `;
  }

  function renderBusEditModal(bus) {
    return `
      <div class="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-bus-edit-title">
        <div class="admin-modal-card bus-edit-modal-card">
          <div class="modal-card-header">
            <div class="header-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <div>
              <h2 id="modal-bus-edit-title" class="modal-card-title">Bus &amp; Crew Management</h2>
              <p class="modal-card-desc">Update official vehicle unit number, driver assignment, passenger capacity, and operational status.</p>
            </div>
            <button type="button" class="modal-close-x" data-modal-close aria-label="Close modal">×</button>
          </div>

          <form class="bus-edit-form" data-bus-edit-form="${bus.id}">
            <div class="form-row-2col">
              <div class="form-group">
                <label for="edit-unit-number">Official Bus Unit Number</label>
                <input type="text" id="edit-unit-number" name="unitNumber" value="${escapeHtml(bus.unitNumber)}" required placeholder="e.g. SARAZA-U01">
                <small class="form-hint">Standardized format (SARAZA-U##)</small>
              </div>
              <div class="form-group">
                <label for="edit-plate-number">Plate Number</label>
                <input type="text" id="edit-plate-number" name="plateNumber" value="${escapeHtml(bus.plateNumber)}" required placeholder="e.g. NBZ-8412">
              </div>
            </div>

            <div class="form-row-2col">
              <div class="form-group">
                <label for="edit-driver-name">Assigned Driver</label>
                <input type="text" id="edit-driver-name" name="driver" value="${escapeHtml(bus.driver)}" required placeholder="Driver full name">
              </div>
              <div class="form-group">
                <label for="edit-dispatcher-name">Assigned Dispatcher</label>
                <input type="text" id="edit-dispatcher-name" name="dispatcher" value="${escapeHtml(bus.dispatcher)}" required placeholder="Dispatcher full name">
              </div>
            </div>

            <div class="form-row-2col">
              <div class="form-group">
                <label for="edit-passenger-capacity">Passenger Capacity</label>
                <input type="number" id="edit-passenger-capacity" name="passengerCapacity" min="10" max="30" value="${bus.passengerCapacity}" required>
                <small class="form-hint">Standard PUV coach capacity (14 passenger seats)</small>
              </div>
              <div class="form-group">
                <label for="edit-operational-status">Operational Status</label>
                <select id="edit-operational-status" name="operationalStatus" class="admin-select-corridor">
                  <option value="active" ${bus.operationalState === 'active' ? 'selected' : ''}>Active (On Duty / In-Service)</option>
                  <option value="standby" ${bus.operationalState === 'standby' ? 'selected' : ''}>Standby (Ready for Dispatch)</option>
                  <option value="break" ${bus.operationalState === 'break' ? 'selected' : ''}>On Break</option>
                  <option value="maintenance" ${bus.operationalState === 'maintenance' ? 'selected' : ''}>Maintenance (In Shop)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="edit-assigned-route">Designated Route</label>
              <input type="text" id="edit-assigned-route" name="route" value="${escapeHtml(bus.route)}" required>
            </div>

            <div class="modal-card-actions">
              <button type="button" class="btn-cancel" data-modal-close>Cancel</button>
              <button type="submit" class="btn-save-bus">Save Asset Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function handleFleetInteractions(event, onUpdate) {
    // Open edit modal
    const editBtn = event.target.closest("[data-fleet-edit-bus]");
    if (editBtn && event.type === "click") {
      const busId = editBtn.dataset.fleetEditBus;
      activeEditBus = fleetList.find(b => b.id === busId);
      onUpdate();
      return;
    }

    // Close modal
    const closeBtn = event.target.closest("[data-modal-close]");
    if (closeBtn && event.type === "click") {
      activeEditBus = null;
      onUpdate();
      return;
    }

    // Save modal form
    const form = event.target.closest("[data-bus-edit-form]");
    if (form && event.type === "submit") {
      event.preventDefault();
      const busId = form.dataset.busEditForm;
      const targetBus = fleetList.find(b => b.id === busId);
      if (targetBus) {
        targetBus.unitNumber = form.querySelector('[name="unitNumber"]').value.trim();
        targetBus.plateNumber = form.querySelector('[name="plateNumber"]').value.trim();
        targetBus.driver = form.querySelector('[name="driver"]').value.trim();
        targetBus.dispatcher = form.querySelector('[name="dispatcher"]').value.trim();
        targetBus.passengerCapacity = parseInt(form.querySelector('[name="passengerCapacity"]').value, 10) || 14;
        const opStatus = form.querySelector('[name="operationalStatus"]').value;
        targetBus.operationalState = opStatus;
        targetBus.status = opStatus === 'active' ? 'On Duty' : opStatus === 'standby' ? 'Standby' : opStatus === 'break' ? 'On Break' : 'Maintenance';
        targetBus.route = form.querySelector('[name="route"]').value.trim();
        activeEditBus = null;
        onUpdate();
      }
      return;
    }

    // Filter clicks
    const filterBtn = event.target.closest("[data-fleet-filter]");
    if (filterBtn && event.type === "click") {
      fleetFilter = filterBtn.dataset.fleetFilter;
      currentPage = 1;
      onUpdate();
      return;
    }

    // Search input
    const searchInput = event.target.closest("[data-fleet-search-input]");
    if (searchInput && event.type === "input") {
      fleetSearch = searchInput.value;
      currentPage = 1;
      onUpdate();
      return;
    }

    // Pagination
    const prevBtn = event.target.closest('[data-table-action="prev-page"][data-target-table="fleet-management-table"]');
    if (prevBtn && event.type === "click") {
      if (currentPage > 1) {
        currentPage--;
        onUpdate();
      }
      return;
    }

    const nextBtn = event.target.closest('[data-table-action="next-page"][data-target-table="fleet-management-table"]');
    if (nextBtn && event.type === "click") {
      const data = getFilteredFleet();
      const totalPages = Math.ceil(data.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        onUpdate();
      }
      return;
    }

    // CSV export
    const csvExportBtn = event.target.closest("[data-fleet-export='csv']");
    if (csvExportBtn && event.type === "click") {
      const data = getFilteredFleet();
      const headers = ["Unit Number", "Plate Number", "Driver", "Dispatcher", "Route", "Capacity", "Status", "Operational State", "Fuel", "Location"];
      const rows = data.map(b => [
        b.unitNumber, b.plateNumber, b.driver, b.dispatcher, b.route, b.passengerCapacity, b.status, b.operationalState, b.fuel, b.telemetry.location
      ]);
      window.USAD_TABLES.exportToCsv(`USAD-Fleet-Assets-${Date.now()}`, headers, rows);
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

  window.USAD_FLEET.fleetList = fleetList;
  window.USAD_FLEET.getFleetAvailabilityCounters = getFleetAvailabilityCounters;
  window.USAD_FLEET.renderFleetDispatchDashboard = renderFleetDispatchDashboard;
  window.USAD_FLEET.handleFleetInteractions = handleFleetInteractions;
})();

