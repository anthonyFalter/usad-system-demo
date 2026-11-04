// src/views/driver/driver-terminal.js
(() => {
  window.USAD_DRIVER = window.USAD_DRIVER || {};

  // Mock real-time terminal bay crowd tracking states
  const terminalBays = [
    {
      id: "bay-malolos-01",
      terminalName: "Robinsons Place Malolos Central Terminal",
      bayCode: "Bay 1 (Express Gate A)",
      destination: "Trinoma Landmark Bus Bay",
      waitingPaxCount: 42,
      crowdLevel: "high", // low, moderate, high, surge
      avgWaitTimeMinutes: 14,
      nextScheduledDeparture: "10:45 AM",
      assignedUnit: "SARAZA-U01",
      cameraFeedId: "cam1",
      queueBreakdown: { regular: 33, studentSenior: 9 }
    },
    {
      id: "bay-malolos-02",
      terminalName: "Robinsons Place Malolos Central Terminal",
      bayCode: "Bay 2 (Staged Standby)",
      destination: "Trinoma Landmark Bus Bay",
      waitingPaxCount: 16,
      crowdLevel: "moderate",
      avgWaitTimeMinutes: 6,
      nextScheduledDeparture: "11:00 AM",
      assignedUnit: "SARAZA-U02",
      cameraFeedId: "cam2",
      queueBreakdown: { regular: 12, studentSenior: 4 }
    },
    {
      id: "bay-trinoma-01",
      terminalName: "Trinoma Landmark North Bus Bay",
      bayCode: "Bay 3 (South Gate)",
      destination: "Robinsons Place Malolos",
      waitingPaxCount: 58,
      crowdLevel: "surge",
      avgWaitTimeMinutes: 22,
      nextScheduledDeparture: "10:50 AM",
      assignedUnit: "SARAZA-U04",
      cameraFeedId: "cam3",
      queueBreakdown: { regular: 45, studentSenior: 13 }
    },
    {
      id: "bay-trinoma-02",
      terminalName: "Trinoma Landmark North Bus Bay",
      bayCode: "Bay 4 (Turnaround Deck)",
      destination: "Robinsons Place Malolos",
      waitingPaxCount: 8,
      crowdLevel: "low",
      avgWaitTimeMinutes: 3,
      nextScheduledDeparture: "11:15 AM",
      assignedUnit: "SARAZA-U06",
      cameraFeedId: "cam4",
      queueBreakdown: { regular: 7, studentSenior: 1 }
    }
  ];

  function getCrowdBadge(level) {
    switch (level) {
      case "surge":
        return `<span class="crowd-badge badge-surge"><span class="badge-dot pulse-red"></span>Surge Load</span>`;
      case "high":
        return `<span class="crowd-badge badge-high"><span class="badge-dot"></span>Heavy Crowd</span>`;
      case "moderate":
        return `<span class="crowd-badge badge-moderate"><span class="badge-dot"></span>Moderate</span>`;
      default:
        return `<span class="crowd-badge badge-low"><span class="badge-dot"></span>Light Load</span>`;
    }
  }

  function renderDriverTerminalView(selectedBayId = "bay-malolos-01") {
    const activeBay = terminalBays.find(b => b.id === selectedBayId) || terminalBays[0];

    return `
      <section class="driver-terminal-view" aria-label="Driver Terminal & Crowd Volume Dashboard">
        <!-- Top Driver Status Bar -->
        <header class="driver-terminal-header">
          <div class="driver-header-identity">
            <div class="driver-badge-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <div>
              <div class="driver-system-sub">SARAZA TRD · DRIVER TERMINAL PORTAL</div>
              <h1 class="driver-system-title">Terminal Bay Passenger Crowd Volumes</h1>
            </div>
          </div>
          <div class="driver-quick-stats">
            <div class="driver-stat-pill">
              <span class="label">Assigned Unit:</span>
              <strong class="val highlight">${activeBay.assignedUnit}</strong>
            </div>
            <div class="driver-stat-pill">
              <span class="label">Target Departure:</span>
              <strong class="val">${activeBay.nextScheduledDeparture}</strong>
            </div>
          </div>
        </header>

        <!-- Main Crowd Volume Grid -->
        <div class="driver-terminal-grid">
          <!-- Active Bay Live Crowd Gauge Card -->
          <article class="driver-crowd-card driver-bay-focus-card">
            <div class="card-top-row">
              <div>
                <span class="bay-tag">${activeBay.bayCode}</span>
                <h2 class="bay-title">${activeBay.terminalName}</h2>
                <div class="bay-route">Route: ${activeBay.destination}</div>
              </div>
              <div class="crowd-status-pill-wrap">
                ${getCrowdBadge(activeBay.crowdLevel)}
              </div>
            </div>

            <!-- Prominent Crowd Counter -->
            <div class="crowd-volume-display">
              <div class="crowd-numeric-hero">
                <span class="pax-number">${activeBay.waitingPaxCount}</span>
                <span class="pax-unit">PAX WAITING IN QUEUE</span>
              </div>
              <div class="crowd-capacity-progress">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill ${activeBay.crowdLevel}" style="width: ${Math.min(100, (activeBay.waitingPaxCount / 60) * 100)}%;"></div>
                </div>
                <div class="progress-labels">
                  <span>Capacity Threshold (14-seat coach)</span>
                  <strong>${Math.ceil(activeBay.waitingPaxCount / 14)} Full Bus Loads Ready</strong>
                </div>
              </div>
            </div>

            <!-- Queue Breakdown & Insights -->
            <div class="crowd-breakdown-row">
              <div class="breakdown-item">
                <span class="bd-label">Regular Commuters</span>
                <strong class="bd-val">${activeBay.queueBreakdown.regular} PAX</strong>
              </div>
              <div class="breakdown-item">
                <span class="bd-label">Student / Senior / PWD</span>
                <strong class="bd-val">${activeBay.queueBreakdown.studentSenior} PAX</strong>
              </div>
              <div class="breakdown-item">
                <span class="bd-label">Avg Gate Wait Time</span>
                <strong class="bd-val">${activeBay.avgWaitTimeMinutes} mins</strong>
              </div>
            </div>

            <div class="driver-crowd-advice ${activeBay.crowdLevel}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>
                ${activeBay.crowdLevel === 'surge' || activeBay.crowdLevel === 'high'
                  ? 'High passenger surge detected. Prepare for rapid sequential boarding upon docking at gate.'
                  : 'Crowd load normal. Proceed according to scheduled departure window.'}
              </span>
            </div>
          </article>

          <!-- Terminal Bay Selector & Monitor List -->
          <aside class="driver-bay-selector-panel">
            <h3 class="selector-title">Select Terminal Bay</h3>
            <div class="bay-cards-list" role="list">
              ${terminalBays.map(bay => `
                <button type="button" class="bay-selection-item ${bay.id === activeBay.id ? 'is-selected' : ''}" data-driver-select-bay="${bay.id}">
                  <div class="b-item-top">
                    <strong>${bay.bayCode}</strong>
                    ${getCrowdBadge(bay.crowdLevel)}
                  </div>
                  <div class="b-item-terminal">${bay.terminalName}</div>
                  <div class="b-item-bottom">
                    <span class="pax-highlight">${bay.waitingPaxCount} Pax</span>
                    <span class="dep-time">Depart: ${bay.nextScheduledDeparture}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </aside>
        </div>
      </section>
    `;
  }

  window.USAD_DRIVER.terminalBays = terminalBays;
  window.USAD_DRIVER.renderDriverTerminalView = renderDriverTerminalView;
})();

