// src/views/admin/queue-merging.js
(() => {
  window.USAD_QUEUE = window.USAD_QUEUE || {};

  // Store gate queue state for walk-in and online passenger reconciliation
  const gateBuses = [
    {
      unitNumber: "SARAZA-U01",
      plateNumber: "NBZ-8412",
      destination: "Trinoma Landmark Bus Bay",
      departureTime: "10:45 AM",
      totalSeats: 14,
      driverName: "Dela Cruz, Juan",
      seats: [
        { seatId: "1B", type: "online", passengerName: "Maria Santos", ref: "USAD-ONL-8192", checkedIn: true },
        { seatId: "2A", type: "online", passengerName: "Roberto Gomez", ref: "USAD-ONL-8195", checkedIn: true },
        { seatId: "2B", type: "walk-in", passengerName: "Walk-in #101", ref: "USAD-WLK-0101", checkedIn: true },
        { seatId: "3A", type: "online", passengerName: "Elena Ramos", ref: "USAD-ONL-8201", checkedIn: false },
        { seatId: "3B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "4A", type: "online", passengerName: "Arnel Pineda", ref: "USAD-ONL-8204", checkedIn: true },
        { seatId: "4B", type: "walk-in", passengerName: "Walk-in #102", ref: "USAD-WLK-0102", checkedIn: true },
        { seatId: "5A", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "5B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "6A", type: "online", passengerName: "Carmela Cruz", ref: "USAD-ONL-8210", checkedIn: false },
        { seatId: "6B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "7A", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "7B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "7C", type: "available", passengerName: "—", ref: "—", checkedIn: false }
      ]
    },
    {
      unitNumber: "SARAZA-U02",
      plateNumber: "CAL-3921",
      destination: "Robinsons Place Malolos",
      departureTime: "11:00 AM",
      totalSeats: 14,
      driverName: "Naval, Cyrhyl",
      seats: [
        { seatId: "1B", type: "online", passengerName: "Patricia Diaz", ref: "USAD-ONL-9011", checkedIn: true },
        { seatId: "2A", type: "walk-in", passengerName: "Walk-in #201", ref: "USAD-WLK-0201", checkedIn: true },
        { seatId: "2B", type: "walk-in", passengerName: "Walk-in #202", ref: "USAD-WLK-0202", checkedIn: true },
        { seatId: "3A", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "3B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "4A", type: "online", passengerName: "Gabriel Mercado", ref: "USAD-ONL-9015", checkedIn: true },
        { seatId: "4B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "5A", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "5B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "6A", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "6B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "7A", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "7B", type: "available", passengerName: "—", ref: "—", checkedIn: false },
        { seatId: "7C", type: "available", passengerName: "—", ref: "—", checkedIn: false }
      ]
    }
  ];

  let selectedUnitNumber = "SARAZA-U01";
  let clerkSearch = "";
  let walkInCounter = 103;

  function renderQueueMergingInterface() {
    const bus = gateBuses.find(b => b.unitNumber === selectedUnitNumber) || gateBuses[0];

    const onlineReservations = bus.seats.filter(s => s.type === "online");
    const walkIns = bus.seats.filter(s => s.type === "walk-in");
    const availableSeats = bus.seats.filter(s => s.type === "available");
    const checkedInCount = bus.seats.filter(s => s.checkedIn).length;

    let filteredSeats = bus.seats;
    if (clerkSearch.trim()) {
      const q = clerkSearch.toLowerCase();
      filteredSeats = bus.seats.filter(s =>
        s.seatId.toLowerCase().includes(q) ||
        s.passengerName.toLowerCase().includes(q) ||
        s.ref.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    }

    return `
      <section class="queue-merging-container" aria-label="Terminal Clerk Gate Reconciliation">
        <!-- Header -->
        <header class="queue-merging-header">
          <div>
            <div class="clerk-tag">TERMINAL CLERK GATE INTERFACE</div>
            <h1 class="clerk-title">Passenger Queue Merging &amp; Gate Reconciliation</h1>
            <p class="clerk-subtitle">Reconcile walk-in ticket sales with online app reservations at the boarding turnstile.</p>
          </div>
          <div class="clerk-unit-selector-wrap">
            <label for="clerk-bus-select">Boarding Bus Unit:</label>
            <select id="clerk-bus-select" class="admin-select-corridor" data-clerk-select-unit>
              ${gateBuses.map(b => `<option value="${b.unitNumber}" ${b.unitNumber === bus.unitNumber ? 'selected' : ''}>${b.unitNumber} (${b.plateNumber}) · Depart ${b.departureTime}</option>`).join('')}
            </select>
          </div>
        </header>

        <!-- Summary KPI Cards -->
        <div class="clerk-kpi-grid">
          <div class="clerk-kpi-card">
            <span class="k-label">Online App Bookings</span>
            <strong class="k-val" style="color: #38bdf8;">${onlineReservations.length} PAX</strong>
            <span class="k-sub">${onlineReservations.filter(s => s.checkedIn).length} Checked-in at Gate</span>
          </div>
          <div class="clerk-kpi-card">
            <span class="k-label">Walk-In Terminal Sales</span>
            <strong class="k-val" style="color: #fbbf24;">${walkIns.length} PAX</strong>
            <span class="k-sub">${walkIns.length} Issued at Booth</span>
          </div>
          <div class="clerk-kpi-card">
            <span class="k-label">Available Capacity</span>
            <strong class="k-val" style="color: #2FD9A8;">${availableSeats.length} Seats</strong>
            <span class="k-sub">${bus.totalSeats} Total Passenger Seats</span>
          </div>
          <div class="clerk-kpi-card">
            <span class="k-label">Gate Boarding Status</span>
            <strong class="k-val">${checkedInCount} / ${bus.seats.filter(s => s.type !== "available").length}</strong>
            <span class="k-sub">${availableSeats.length === 0 ? "COACH FULL" : "BOARDING OPEN"}</span>
          </div>
        </div>

        <!-- Main Gate Operations Workspace -->
        <div class="clerk-workspace-split">
          <!-- Left: Quick Walk-in Seat Assigner -->
          <div class="clerk-actions-panel">
            <h2 class="panel-heading">Sell &amp; Assign Walk-In Seat</h2>
            <p class="panel-desc">Quickly issue a walk-in seat to a commuter at the gate turnstile.</p>
            <div class="walk-in-form">
              <label for="walkin-seat-select">Select Empty Seat:</label>
              <select id="walkin-seat-select" class="admin-select-corridor" data-walkin-seat-select ${availableSeats.length === 0 ? 'disabled' : ''}>
                ${availableSeats.length === 0 
                  ? '<option value="">No Available Seats Remaining</option>'
                  : availableSeats.map(s => `<option value="${s.seatId}">Seat ${s.seatId}</option>`).join('')}
              </select>
              
              <label for="walkin-pax-name" style="margin-top: 10px;">Passenger Name / Note:</label>
              <input type="text" id="walkin-pax-name" class="staff-header-search-input" placeholder="e.g. Walk-in Passenger" value="Walk-in #${walkInCounter}" data-walkin-pax-name>

              <button type="button" class="btn-assign-walkin" data-clerk-action="confirm-walkin" ${availableSeats.length === 0 ? 'disabled' : ''}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Issue &amp; Board Walk-In Ticket</span>
              </button>
            </div>

            <div class="clerk-tip-box">
              <strong>Boarding Protocol:</strong>
              <p>Online ticket holders have seat reservation guarantee until 5 minutes before departure. Unclaimed seats may be reconciled or released by the dispatcher.</p>
            </div>
          </div>

          <!-- Right: Consolidated Seat Manifest Table -->
          <div class="clerk-manifest-panel">
            <div class="manifest-header-row">
              <h2 class="panel-heading">Consolidated Boarding Gate Manifest</h2>
              <div class="manifest-search-wrap">
                <input type="text" class="staff-header-search-input" placeholder="Filter seat, passenger, or ref..." value="${escapeHtml(clerkSearch)}" data-clerk-manifest-search>
              </div>
            </div>

            <div class="table-responsive-wrapper">
              <table class="usad-data-table">
                <thead>
                  <tr>
                    <th>SEAT</th>
                    <th>CHANNEL / TYPE</th>
                    <th>PASSENGER NAME</th>
                    <th>BOOKING REFERENCE</th>
                    <th>GATE CHECK-IN</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredSeats.map(s => {
                    const isAvailable = s.type === "available";
                    return `
                      <tr>
                        <td><strong>Seat ${s.seatId}</strong></td>
                        <td>
                          <span class="manifest-type-pill ${s.type}">
                            ${s.type === 'online' ? 'Online App' : s.type === 'walk-in' ? 'Walk-in Booth' : 'Available'}
                          </span>
                        </td>
                        <td>${s.passengerName}</td>
                        <td><code>${s.ref}</code></td>
                        <td>
                          ${isAvailable ? '<span class="status-empty">—</span>' : `
                            <button type="button" class="btn-checkin-toggle ${s.checkedIn ? 'is-checked' : ''}" data-clerk-toggle-checkin="${s.seatId}">
                              ${s.checkedIn ? '✓ Boarded' : '○ Pending'}
                            </button>
                          `}
                        </td>
                        <td>
                          ${!isAvailable ? `
                            <button type="button" class="btn-row-action release" data-clerk-release-seat="${s.seatId}" title="Release this seat">Release</button>
                          ` : `
                            <button type="button" class="btn-row-action assign" data-clerk-quick-assign="${s.seatId}" title="Assign Walk-in">Assign</button>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function handleClerkActions(event, onUpdate) {
    // Unit select
    const unitSelect = event.target.closest("[data-clerk-select-unit]");
    if (unitSelect && event.type === "change") {
      selectedUnitNumber = unitSelect.value;
      onUpdate();
      return;
    }

    // Search
    const searchInput = event.target.closest("[data-clerk-manifest-search]");
    if (searchInput && event.type === "input") {
      clerkSearch = searchInput.value;
      onUpdate();
      return;
    }

    // Toggle Check-in
    const checkinBtn = event.target.closest("[data-clerk-toggle-checkin]");
    if (checkinBtn && event.type === "click") {
      const seatId = checkinBtn.dataset.clerkToggleCheckin;
      const bus = gateBuses.find(b => b.unitNumber === selectedUnitNumber);
      if (bus) {
        const seat = bus.seats.find(s => s.seatId === seatId);
        if (seat) {
          seat.checkedIn = !seat.checkedIn;
          onUpdate();
        }
      }
      return;
    }

    // Confirm walk-in
    const confirmWalkInBtn = event.target.closest('[data-clerk-action="confirm-walkin"]');
    if (confirmWalkInBtn && event.type === "click") {
      const bus = gateBuses.find(b => b.unitNumber === selectedUnitNumber);
      const seatSelect = document.querySelector("[data-walkin-seat-select]");
      const nameInput = document.querySelector("[data-walkin-pax-name]");
      if (bus && seatSelect && seatSelect.value) {
        const seat = bus.seats.find(s => s.seatId === seatSelect.value);
        if (seat) {
          seat.type = "walk-in";
          seat.passengerName = nameInput?.value?.trim() || `Walk-in #${walkInCounter}`;
          seat.ref = `USAD-WLK-${String(walkInCounter).padStart(4, '0')}`;
          seat.checkedIn = true;
          walkInCounter++;
          onUpdate();
        }
      }
      return;
    }

    // Quick assign from row
    const quickAssignBtn = event.target.closest("[data-clerk-quick-assign]");
    if (quickAssignBtn && event.type === "click") {
      const seatId = quickAssignBtn.dataset.clerkQuickAssign;
      const bus = gateBuses.find(b => b.unitNumber === selectedUnitNumber);
      if (bus) {
        const seat = bus.seats.find(s => s.seatId === seatId);
        if (seat) {
          seat.type = "walk-in";
          seat.passengerName = `Walk-in #${walkInCounter}`;
          seat.ref = `USAD-WLK-${String(walkInCounter).padStart(4, '0')}`;
          seat.checkedIn = true;
          walkInCounter++;
          onUpdate();
        }
      }
      return;
    }

    // Release seat
    const releaseBtn = event.target.closest("[data-clerk-release-seat]");
    if (releaseBtn && event.type === "click") {
      const seatId = releaseBtn.dataset.clerkReleaseSeat;
      const bus = gateBuses.find(b => b.unitNumber === selectedUnitNumber);
      if (bus) {
        const seat = bus.seats.find(s => s.seatId === seatId);
        if (seat) {
          seat.type = "available";
          seat.passengerName = "—";
          seat.ref = "—";
          seat.checkedIn = false;
          onUpdate();
        }
      }
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

  window.USAD_QUEUE.gateBuses = gateBuses;
  window.USAD_QUEUE.renderQueueMergingInterface = renderQueueMergingInterface;
  window.USAD_QUEUE.handleClerkActions = handleClerkActions;
})();

