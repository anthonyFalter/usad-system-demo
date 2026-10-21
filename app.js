(() => {
  const rolePage = document.querySelector("#role-page");
  const workspacePage = document.querySelector("#workspace-page");
  const roleNote = document.querySelector("#role-note");
  const viewport = document.querySelector("#canvas-viewport");
  const world = document.querySelector("#canvas-world");
  const screen = document.querySelector("#phone-screen");
  const zoomOutput = document.querySelector("#zoom-level");
  const backButton = document.querySelector("#back-button");
  const fitButton = document.querySelector("#fit-button");
  const workspaceRoleLabel = document.querySelector("#workspace-role-label");

  if (!rolePage || !workspacePage || !roleNote || !viewport || !world || !screen || !zoomOutput || !backButton || !fitButton) {
    throw new Error("USAD prototype could not initialize: required interface elements are missing.");
  }

  let currentRole = "user";
  let adminShowError = false;
  let mobileLoginShowError = false;

  const mark = `
    <span class="app-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 10v2.5a5 5 0 0 0 10 0V10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M12 3.5v9m0-9-3 3m3-3 3 3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>`;

  const socialButtons = `
    <div class="social-buttons" aria-label="Other sign-in options">
      <button class="social-button" type="button" aria-label="Continue with Google" data-info="Google sign-in is not connected in this prototype.">
        <svg class="oauth-icon oauth-google" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.35 12.22c0-.71-.06-1.39-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.19ZM12 21.75c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.55 0-4.72-1.72-5.5-4.04H3.25v2.5A9.75 9.75 0 0 0 12 21.75Z"/><path fill="currentColor" d="M6.5 13.87a5.87 5.87 0 0 1 0-3.74v-2.5H3.25a9.75 9.75 0 0 0 0 8.74l3.25-2.5Z"/><path fill="currentColor" d="M12 6.1c1.43 0 2.71.49 3.72 1.47l2.79-2.79C16.84 3.2 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.75 5.38l3.25 2.5C7.28 7.82 9.45 6.1 12 6.1Z"/></svg>
      </button>
      <button class="social-button" type="button" aria-label="Continue with Facebook" data-info="Facebook sign-in is not connected in this prototype.">
        <svg class="oauth-icon oauth-facebook" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path fill="#fff" d="M13.45 20v-7.25h2.44l.37-2.83h-2.81V8.11c0-.82.23-1.38 1.4-1.38h1.5V4.2c-.26-.04-1.2-.12-2.29-.12-2.26 0-3.81 1.38-3.81 3.92v1.92H7.7v2.83h2.55V20h3.2Z"/></svg>
      </button>
      <button class="social-button" type="button" aria-label="Continue with Apple" data-info="Apple sign-in is not connected in this prototype.">
        <svg class="oauth-icon oauth-apple" viewBox="5 2 14 20" aria-hidden="true"><path fill="currentColor" d="M16.37 12.63c.02 2.18 1.91 2.9 1.93 2.91-.02.05-.3 1.04-.98 2.06-.6.89-1.23 1.77-2.22 1.79-.97.02-1.28-.58-2.39-.58-1.11 0-1.46.56-2.38.6-.95.03-1.67-.96-2.28-1.85-1.24-1.8-2.18-5.08-.91-7.3.63-1.1 1.75-1.8 2.97-1.82.93-.02 1.8.63 2.38.63.57 0 1.65-.78 2.78-.66.47.02 1.8.19 2.65 1.43-.07.04-1.58.92-1.55 2.79Zm-1.83-6.02c.5-.61.84-1.46.75-2.31-.73.03-1.61.49-2.13 1.09-.47.54-.89 1.4-.78 2.23.81.06 1.65-.41 2.16-1.01Z"/></svg>
      </button>
    </div>`;

  let activeState = "login";
  let registrationData = { username: "", email: "" };
  const accountProfile = {
    firstName: "Jocky",
    middleName: "Python",
    lastName: "Cabatbat",
    discountId: "N/A",
    address: "N/A",
    email: "jockypythonking@edu.phd.engram.com",
    contactNumber: "+639492561938",
    password: "DemoPassword123!",
  };
  const notifications = [
    { id: "bus-arrival", type: "ride", title: "Your bus is approaching", body: "Malolos → North Avenue · Bus 01 is about 3 minutes away.", time: "2 min ago", unread: true },
    { id: "booking-confirmed", type: "ticket", title: "Booking confirmed", body: "Your sample trip to Trinoma is ready to view in My Tickets.", time: "Yesterday", unread: true },
    { id: "service-update", type: "service", title: "Service update", body: "This is a sample service notice. Live service alerts are not connected.", time: "Oct 14", unread: false },
    { id: "fare-offer", type: "promo", title: "A little more in your U-Pouch", body: "Explore the sample offers shown in the app. No offer is active.", time: "Oct 12", unread: false },
  ];
  let notificationFilter = "all";
  let welcomeTimeout = 0;
  let activeFaqCategory = "all";
  let tripHistoryFilter = "all";
  let tripHistoryQuery = "";
  let selectedHistoryTripId = "";
  let discountVerificationType = "student";
  let discountVerificationStep = 1;
  let discountVerificationFiles = { front: null, back: null };
  let discountVerificationConfirmed = false;
  let discountVerificationStatus = "unverified";
  let discountVerificationMessage = "";
  let tripHistory = [
    { id: "MLS-042", date: "Today · 8:15 AM", status: "completed", origin: "Robinsons Place Malolos", originDetail: "Barangka, Malolos", destination: "Trinoma Landmark Bus Bay", destinationDetail: "Via North Luzon Expy (NLEX)", fare: 80, seat: "1A", payment: "GCash", co2Saved: 6.2, receiptId: "USAD-7X29-KM41", inMonth: true, receiptLabel: "E-Ticket & Receipt", showRateAction: true, rebookLabel: "Rebook" },
    { id: "TRN-018", date: "Yesterday · 5:45 PM", status: "completed", origin: "Trinoma EDSA Terminal", originDetail: "North Avenue P2P Lounge", destination: "Robinsons Place Malolos", destinationDetail: "Express via Tabang Exit", fare: 80, seat: "4B", payment: "U-Pouch", co2Saved: 6.1, receiptId: "USAD-4P18-TR62", inMonth: true, receiptLabel: "Receipt", rebookLabel: "Rebook Route" },
    { id: "MLS-105", date: "Oct 24 · 7:30 AM", status: "completed", origin: "Robinsons Place Malolos", originDetail: "Express Lane 2", destination: "SM North EDSA / Trinoma", destinationDetail: "North Station Drop-off", fare: 64, seat: "2A", payment: "GCash", co2Saved: 6.1, receiptId: "USAD-2N05-ML47", inMonth: true, studentDiscount: true, receiptLabel: "View Receipt", rebookLabel: "Rebook", rebookStyle: "secondary" },
    { id: "TRN-009", date: "Oct 20 · 6:10 PM", status: "cancelled", origin: "Trinoma Landmark Bus Bay", originDetail: "Trip cancelled by operator", destination: "Robinsons Place Malolos", destinationDetail: "Refunded to U-Pouch", fare: 0, originalFare: 80, seat: "—", payment: "U-Pouch", co2Saved: 0, receiptId: "USAD-9R09-TR18", inMonth: false, receiptLabel: "Refund Details" },
  ];
  let tripData = {
    origin: "Robinsons Place Malolos",
    destination: "Trinoma",
    passengers: 1,
    payment: "GCash",
    seat: "1A",
  };
  let bookingConfirmed = false;
  const liveBusDetails = [
    { name: "Bus 01", fleetId: "MLS-042", route: "Malolos → Trinoma", eta: "3 min", seats: 8, fare: "₱80.00", status: "On time" },
    { name: "Bus 02", fleetId: "MLS-018", route: "Malolos → Trinoma", eta: "Less than 1 min", seats: 1, fare: "₱80.00", status: "On time" },
  ];
  let selectedLiveBus = 0;
  let selectedBusSeatId = "";
  let quickBookReturnFocus = null;
  let liveMapPan = { x: 0, y: 0 };
  let liveMapZoom = 1;
  let liveMapDrag = null;
  let liveMapAnimationFrame = 0;
  let liveMapFilter = "all";
  let liveMapQuery = "";
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragOrigin = null;

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const enforceMinimumFontSize = () => {
    [rolePage, workspacePage, screen].forEach((root) => {
      root.querySelectorAll("*").forEach((element) => {
        if (element.closest("svg")) return;
        const hasText = [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        const isTextControl = element.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea, select');
        if (!hasText && !isTextControl) return;
        if (Number.parseFloat(getComputedStyle(element).fontSize) < 12) element.style.fontSize = "12px";
      });
    });
  };

  const minimumFontSizeObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length)) enforceMinimumFontSize();
  });
  [rolePage, workspacePage, screen].forEach((root) => minimumFontSizeObserver.observe(root, { childList: true, subtree: true }));

  const unreadNotificationCount = () => notifications.filter((notification) => notification.unread).length;

  const adminAppMark = `
    <span class="admin-app-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 10v2.5a5 5 0 0 0 10 0V10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M12 3.5v9m0-9-3 3m3-3 3 3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>`;

  const fingerprintIcon = `
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4.925.827A7.583 7.583 0 0115.66 9.316a.75.75 0 11-1.463-.333 6.083 6.083 0 00-8.61-6.81.75.75 0 01-.662-1.346zM3.278 2.903a.75.75 0 01.143 1.05 6.058 6.058 0 00-1.087 2.332 26.684 26.684 0 01-.811 2.9.75.75 0 11-1.416-.495c.262-.747.514-1.634.765-2.737a7.558 7.558 0 011.355-2.907.75.75 0 011.05-.143zm.259 3.656a4.85 4.85 0 019.176-.859.75.75 0 01-1.375.6A3.35 3.35 0 005 6.891c-.174.766-.354 1.46-.543 2.098a.75.75 0 01-1.438-.426c.179-.603.35-1.265.519-2.005zm3.548-.682a2.117 2.117 0 013.244 2.226 38.526 38.526 0 01-.684 2.614.75.75 0 11-1.436-.434c.235-.777.452-1.608.658-2.512a.617.617 0 00-.945-.649.75.75 0 01-.837-1.245zm5.345 1.935a.75.75 0 01.565.897c-.57 2.505-1.25 4.627-2.178 6.609a.75.75 0 01-1.358-.636c.871-1.86 1.52-3.874 2.073-6.305a.75.75 0 01.898-.565zm-5.768.673a.75.75 0 01.518.926c-.531 1.874-1.146 3.384-1.93 4.794-.057.103-.115.205-.174.307a.75.75 0 01-1.298-.75c.054-.095.108-.19.16-.285.72-1.296 1.295-2.696 1.798-4.475a.75.75 0 01.926-.517zm-3.487 1.998a.75.75 0 01.384.988c-.218.497-.45.96-.698 1.407a.75.75 0 01-1.311-.728c.226-.407.437-.83.637-1.283a.75.75 0 01.988-.385zm11.361.295a.75.75 0 01.516.927 34.364 34.364 0 01-.833 2.556.75.75 0 11-1.406-.522c.291-.785.554-1.596.796-2.445a.75.75 0 01.927-.516zm-6.21 1.53c.381.16.561.6.401.982a22.529 22.529 0 01-1.088 2.243.75.75 0 11-1.31-.729 21.03 21.03 0 001.015-2.094.75.75 0 01.981-.402z"/>
    </svg>`;

  const idCardIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2.5"/>
      <rect x="5.5" y="8.5" width="4.5" height="5.5" rx="1"/>
      <path d="M13.5 10h5"/>
      <path d="M13.5 13h3.5"/>
    </svg>`;

  const adminLoginScreen = (showError = false) => `
    <div class="admin-auth-screen" data-admin-screen="login">
      <div class="admin-auth-card">
        ${adminAppMark}
        <h1 class="admin-auth-title">Introducing, <span>USAD</span></h1>
        ${showError ? '<div class="admin-auth-alert" id="admin-auth-alert" role="alert">Invalid Email or Password</div>' : ""}
        <form class="admin-login-form" data-admin-login-form novalidate>
          <div class="admin-form-field">
            <input class="admin-input" id="admin-email" name="email" type="email" placeholder="Email" autocomplete="username"${showError ? ' aria-invalid="true"' : ""}>
          </div>
          <div class="admin-form-field">
            <input class="admin-input" id="admin-password" name="password" type="password" placeholder="Password" autocomplete="current-password"${showError ? ' aria-invalid="true"' : ""}>
          </div>
          <button class="admin-forgot-link" type="button" data-admin-action="forgot-password">Forgot password?</button>
          <button class="admin-login-button" type="submit">Login</button>
        </form>
        <div class="admin-auth-tiles" role="group" aria-label="Alternative authentication methods">
          <button class="admin-auth-tile" type="button" data-admin-auth="fingerprint" aria-label="Biometric fingerprint login" title="Biometric Fingerprint Scanner">
            ${fingerprintIcon}
          </button>
          <button class="admin-auth-tile" type="button" data-admin-auth="smartcard" aria-label="Staff Smart ID badge login" title="Staff RFID / Smart Badge">
            ${idCardIcon}
          </button>
        </div>
        <p class="admin-security-note">
          Admin side can only log in by us when we give them an account. And they cannot register for one.
        </p>
      </div>
      <div class="admin-helper-bar">
        <button class="admin-helper-chip" type="button" data-admin-action="autofill-demo" title="Auto-fill with admin@saraza.com">Auto-fill Demo Account</button>
        <button class="admin-helper-chip" type="button" data-admin-action="toggle-error" title="Toggle error alert banner">${showError ? "Hide Error Banner" : "Show Error Banner"}</button>
      </div>
    </div>`;

  let activeFleetFilter = "all";
  let fleetSearchQuery = "";
  let activeCorridorFilter = "all";
  let activeAdminSidebarTab = "staff-resources";
  let selectedDispatchBusId = "bus-01";
  let dispatchTelemetryFilter = "all";
  let dispatchCorridorFilter = "edsa";
  let dispatchMapZoom = 1;
  let dispatchLayersActive = true;
  let dispatchNoteInput = "";
  let activeStaffRoleFilter = "all";
  let staffSearchQuery = "";
  let staffDepotFilter = "all";
  let staffCurrentPage = 1;
  let staffPerPage = 8;
  let staffSelectedRows = new Set();
  let activeCameraCorridorFilter = "all";
  let activeCameraLayout = "3x2"; // "3x2", "2x2", "focus"
  let focusedCameraId = "cam-01";
  let cameraAiDetectionEnabled = true;
  let cameraScanlinesEnabled = true;
  let cameraOsdEnabled = true;
  let cctvSettingsPopupOpen = false;
  let cameraWaveformTab = "monitor"; // "monitor", "ai", "debug"
  let cameraSearchQuery = "";
  let predictiveSelectedHour = 17; // 5 PM
  let predictiveTransitLoadScale = 100;
  let predictiveOperatingProfile = "Intercity / Airport";
  let activeReportsCategoryFilter = "all"; // "all", "financial", "otp", "crew", "fuel"
  let activeReportsDateRange = "month"; // "month", "today", "week", "last-month", "q3"
  let activeReportsCorridor = "all"; // "all", "trinoma", "edsa", "malolos", "c5"
  let reportsSearchQuery = "";
  let selectedReportDetailId = "REP-2026-1048";

  const predictiveForecastHours = [
    { hour: 0, label: "12 AM", val: 280, state: "low", heat: "green", showLabel: true },
    { hour: 1, label: "1 AM", val: 320, state: "low", heat: "green", showLabel: true },
    { hour: 2, label: "2 AM", val: 250, state: "low", heat: "green", showLabel: true },
    { hour: 3, label: "3 AM", val: 310, state: "low", heat: "green", showLabel: true },
    { hour: 4, label: "4 AM", val: 380, state: "low", heat: "green", showLabel: true },
    { hour: 5, label: "5 AM", val: 520, state: "low", heat: "green", showLabel: true },
    { hour: 6, label: "6 AM", val: 820, state: "normal", heat: "blue", showLabel: true },
    { hour: 7, label: "7 AM", val: 940, state: "normal", heat: "blue", showLabel: false },
    { hour: 8, label: "8 AM", val: 1040, state: "normal", heat: "blue", showLabel: false },
    { hour: 9, label: "9 AM", val: 920, state: "normal", heat: "blue", showLabel: true },
    { hour: 10, label: "10 AM", val: 960, state: "normal", heat: "blue", showLabel: false },
    { hour: 11, label: "11 AM", val: 980, state: "normal", heat: "blue", showLabel: false },
    { hour: 12, label: "12 PM", val: 1050, state: "normal", heat: "blue", showLabel: true },
    { hour: 13, label: "1 PM", val: 1020, state: "normal", heat: "blue", showLabel: false },
    { hour: 14, label: "2 PM", val: 1080, state: "normal", heat: "blue", showLabel: false },
    { hour: 15, label: "3 PM", val: 1130, state: "surge", heat: "red", showLabel: true },
    { hour: 16, label: "4 PM", val: 1160, state: "surge", heat: "red", showLabel: false },
    { hour: 17, label: "5 PM", val: 1190, state: "surge", heat: "red", showLabel: false },
    { hour: 18, label: "6 PM", val: 1150, state: "surge", heat: "red", showLabel: true },
    { hour: 19, label: "7 PM", val: 1120, state: "surge", heat: "red", showLabel: false },
    { hour: 20, label: "8 PM", val: 980, state: "normal", heat: "blue", showLabel: false },
    { hour: 21, label: "9 PM", val: 920, state: "normal", heat: "blue", showLabel: true },
    { hour: 22, label: "10 PM", val: 740, state: "normal", heat: "blue", showLabel: false },
    { hour: 23, label: "11 PM", val: 450, state: "low", heat: "green", showLabel: true }
  ];

  const renderForecastBars = () => {
    return predictiveForecastHours.map((item) => {
      const scaledVal = Math.round(item.val * (predictiveTransitLoadScale / 100));
      const heightPx = Math.min(156, Math.max(14, Math.round((scaledVal / 1400) * 148)));
      const isSelected = item.hour === predictiveSelectedHour;
      return `
        <div class="chart-bar-col${isSelected ? " is-selected" : ""}" data-chart-hour="${item.hour}" title="${item.label}: ${scaledVal.toLocaleString()} commuters/hr">
          ${isSelected ? `<div class="bar-selected-badge">${scaledVal.toLocaleString()}</div>` : ""}
          <div class="chart-bar-fill ${item.state}" style="height: ${heightPx}px;"></div>
          <div class="bar-heat-pill ${item.heat}"></div>
          <span class="bar-time-label">${item.showLabel ? item.label : ""}</span>
        </div>
      `;
    }).join("");
  };

  const renderPredictiveStats = () => {
    const selectedItem = predictiveForecastHours.find((h) => h.hour === predictiveSelectedHour) ?? predictiveForecastHours[17];
    const scaledVal = Math.round(selectedItem.val * (predictiveTransitLoadScale / 100));
    const peakVolume = Math.round(1190 * (predictiveTransitLoadScale / 100));
    const peakWindow = selectedItem.state === "surge" ? "4 hrs surge" : selectedItem.hour === 8 ? "3 hrs morning rush" : "Steady flow";

    let stateClass = "text-low";
    let stateText = `${scaledVal.toLocaleString()} (Low)`;
    if (selectedItem.state === "surge") {
      stateClass = "text-surge";
      stateText = `${scaledVal.toLocaleString()} (Peak surge)`;
    } else if (selectedItem.state === "normal") {
      stateClass = "text-normal";
      stateText = `${scaledVal.toLocaleString()} (Normal)`;
    }

    return `
      <div class="analytics-metric-box">
        <span class="metric-box-label">Peak window</span>
        <strong class="metric-box-val">${peakWindow}</strong>
      </div>
      <div class="analytics-metric-divider"></div>
      <div class="analytics-metric-box">
        <span class="metric-box-label">Peak volume</span>
        <strong class="metric-box-val">${peakVolume.toLocaleString()} /hr</strong>
      </div>
      <div class="analytics-metric-divider"></div>
      <div class="analytics-metric-box">
        <span class="metric-box-label">${selectedItem.label} demand</span>
        <strong class="metric-box-val ${stateClass}">${stateText}</strong>
      </div>
    `;
  };

  const adminFleetData = [
    {
      id: "bus-01",
      busNo: "Bus 01",
      driver: "Jocky King Garcia",
      dispatcher: "Klintroy Suerte Felipe",
      route: "Trinoma Express",
      fuel: "86% Fuel",
      fuelType: "cyan",
      speed: "42 km/h",
      rate: "$4.5 / 10h",
      status: "On Duty",
      statusClass: "on-duty",
      dot: "green",
      filterCategory: "on-duty",
      telemetry: { speed: "42 km/h", fuel: "86%", gps: "14.8521° N, 120.8164° E (NLEX Northbound)", tire: "34 PSI", temp: "88°C", passengers: "18 / 24", oil: "Optimal" }
    },
    {
      id: "bus-02",
      busNo: "Bus 02",
      driver: "Cyrhyl Naval",
      dispatcher: "Ross Anthony Jobs",
      route: "Trinoma Feeder",
      fuel: "54% Fuel",
      fuelType: "yellow",
      speed: "0 km/h (Depot)",
      rate: "$4.5 / 5h",
      status: "On break",
      statusClass: "on-break",
      dot: "orange",
      filterCategory: "on-break",
      telemetry: { speed: "0 km/h", fuel: "54%", gps: "14.8480° N, 120.8110° E (Depot Bay 2)", tire: "33 PSI", temp: "42°C", passengers: "0 / 24", oil: "Good" }
    },
    {
      id: "bus-03",
      busNo: "Bus 03",
      driver: "Eldrei Acero",
      dispatcher: "—",
      route: "Trinoma Reserve",
      fuel: "92% Fuel",
      fuelType: "cyan",
      speed: "Parked",
      rate: "$4.5 / 5h",
      status: "Off Duty",
      statusClass: "off-duty",
      dot: "gray",
      filterCategory: "standby",
      telemetry: { speed: "0 km/h", fuel: "92%", gps: "14.8512° N, 120.8140° E (Robinsons Malolos)", tire: "35 PSI", temp: "38°C", passengers: "0 / 24", oil: "Optimal" }
    },
    {
      id: "bus-04",
      busNo: "Bus 04",
      driver: "Royce Zaldivar",
      dispatcher: "John Dela Cruz",
      route: "Trinoma Express",
      fuel: "71% Fuel",
      fuelType: "cyan",
      speed: "55 km/h",
      rate: "$4.5 / 5h",
      status: "On Duty",
      statusClass: "on-duty",
      dot: "green",
      filterCategory: "on-duty",
      telemetry: { speed: "55 km/h", fuel: "71%", gps: "14.7350° N, 120.9580° E (NLEX Balintawak)", tire: "35 PSI", temp: "91°C", passengers: "22 / 24", oil: "Optimal" }
    },
    {
      id: "bus-05",
      busNo: "Bus 05",
      driver: "Jericho Rosales",
      dispatcher: "Wanda Maximoff",
      route: "Trinoma Loop",
      fuel: "62% Fuel",
      fuelType: "cyan",
      speed: "38 km/h",
      rate: "$4.5 / 5h",
      status: "On Duty",
      statusClass: "on-duty",
      dot: "green",
      filterCategory: "on-duty",
      telemetry: { speed: "38 km/h", fuel: "62%", gps: "14.6540° N, 121.0330° E (North Avenue EDSA)", tire: "34 PSI", temp: "87°C", passengers: "16 / 24", oil: "Optimal" }
    },
    {
      id: "bus-06",
      busNo: "Bus 06",
      driver: "Joshua Garcia",
      dispatcher: "Piolo Pascual",
      route: "Malolos Central",
      fuel: "90% Fuel",
      fuelType: "cyan",
      speed: "48 km/h",
      rate: "$4.5 / 5h",
      status: "On Duty",
      statusClass: "on-duty",
      dot: "green",
      filterCategory: "on-duty",
      telemetry: { speed: "48 km/h", fuel: "90%", gps: "14.8620° N, 120.8220° E (Malolos Crossing)", tire: "34 PSI", temp: "89°C", passengers: "14 / 24", oil: "Optimal" }
    }
  ];

  const adminCommentsData = [
    {
      author: "Louis Mathews",
      tag: "#44",
      tagColor: "cyan",
      time: "18 min ago",
      text: "Repaired passenger door sensor &amp; calibrated boarding hydraulics."
    },
    {
      author: "Martha Godwin",
      tag: "#36",
      tagColor: "cyan",
      time: "2 hours ago",
      text: "Fixed cracked windshield wiper bracket; vehicle certified roadworthy."
    },
    {
      author: "Martha Godwin",
      tag: "#36",
      tagColor: "cyan",
      time: "2 hours ago",
      text: "Fixed cracked windshield wiper bracket; vehicle certified roadworthy."
    },
    {
      author: "Robert Watkins",
      tag: "#160312",
      tagColor: "gold",
      time: "3 hours ago",
      text: "Heavy congestion logged at Trinoma junction - rerouting Bus 04 via feeder."
    },
    {
      author: "Robert Watkins",
      tag: "#160312",
      tagColor: "gold",
      time: "3 hours ago",
      text: "Heavy congestion logged at Trinoma junction - rerouting Bus 04 via feeder."
    }
  ];

  const adminShiftsData = [
    {
      bus: "Bus 01 · Evening",
      driver: "Ariana Grande",
      dispatcher: "Judy Ann Santos",
      time: "18:00"
    },
    {
      bus: "Bus 01 · Evening",
      driver: "Ariana Grande",
      dispatcher: "Judy Ann Santos",
      time: "18:00"
    },
    {
      bus: "Bus 02 · Night",
      driver: "Selena Gomez",
      dispatcher: "Pending Verification",
      time: "21:00"
    }
  ];

  const renderAdminFleetRows = () => {
    const query = fleetSearchQuery.toLowerCase().trim();
    const rows = adminFleetData.filter((item) => {
      if (activeFleetFilter === "on-duty" && item.filterCategory !== "on-duty") return false;
      if (activeFleetFilter === "on-break" && item.filterCategory !== "on-break") return false;
      if (activeFleetFilter === "standby" && item.filterCategory !== "standby") return false;
      if (!query) return true;
      return (
        item.busNo.toLowerCase().includes(query) ||
        item.driver.toLowerCase().includes(query) ||
        item.dispatcher.toLowerCase().includes(query) ||
        item.route.toLowerCase().includes(query)
      );
    });

    if (rows.length === 0) {
      return `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #64748b;">No matching vehicles or dispatch records found.</td></tr>`;
    }

    return rows.map((bus) => `
      <tr data-bus-id="${bus.id}">
        <td>
          <div class="admin-bus-cell">
            <span class="bus-dot ${bus.dot}"></span>
            <span>${bus.busNo}</span>
          </div>
        </td>
        <td>${bus.driver}</td>
        <td>${bus.dispatcher}</td>
        <td>${bus.route}</td>
        <td>
          <span class="fuel-text ${bus.fuelType}">${bus.fuel}</span>
          <span style="color: #64748b;"> | ${bus.speed}</span>
        </td>
        <td>${bus.rate}</td>
        <td><span class="status-badge ${bus.statusClass}"><span class="status-dot"></span>${bus.status}</span></td>
        <td>
          <button class="btn-telemetry" type="button" data-admin-telemetry="${bus.id}">Telemetry</button>
        </td>
      </tr>
    `).join("");
  };

  const adminLiveOperationsView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Fleet Monitoring &amp; Dispatch</h1>
      </div>

      <div class="admin-header-actions">
        <select class="admin-select-corridor" data-admin-corridor aria-label="Select Corridors">
          <option value="all">All Corridors (Trinoma / Malolos / EDSA)</option>
          <option value="trinoma">Trinoma Express Corridor</option>
          <option value="malolos">Malolos Central Loop</option>
          <option value="feeder">NLEX Feeder Route</option>
        </select>
        <button class="admin-btn-assign" type="button" data-admin-action="open-assign">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Assign Dispatch</span>
        </button>
      </div>
    </header>

    <!-- 4 Bento KPI Cards -->
    <section class="admin-metrics-grid" aria-label="Key Performance Indicators">
      <!-- 1. Service Reminders -->
      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Service reminders</span>
          <span class="admin-pill-badge badge-total">12 Total</span>
        </div>
        <div class="bento-split-2">
          <div class="bento-split-col">
            <span class="bento-metric-sublabel">Due soon (Next 48 Hours)</span>
            <div class="bento-metric-figure cyan">5</div>
          </div>
          <div class="bento-split-divider"></div>
          <div class="bento-split-col">
            <span class="bento-metric-sublabel">Overdue (Requires Action)</span>
            <div class="bento-metric-figure red">9</div>
          </div>
        </div>
      </article>

      <!-- 2. Vehicle Fleet Status -->
      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Vehicle fleet status</span>
          <span class="admin-pill-badge badge-registered">82 Registered</span>
        </div>
        <div class="bento-split-3">
          <div class="bento-split-col">
            <div class="bento-metric-figure green">65</div>
            <span class="bento-metric-sublabel">Active (79.2%)</span>
          </div>
          <div class="bento-split-divider"></div>
          <div class="bento-split-col">
            <div class="bento-metric-figure muted">13</div>
            <span class="bento-metric-sublabel">Inactive (Depot)</span>
          </div>
          <div class="bento-split-divider"></div>
          <div class="bento-split-col">
            <div class="bento-metric-figure red">4</div>
            <span class="bento-metric-sublabel">In shop (Repair)</span>
          </div>
        </div>
      </article>

      <!-- 3. Fuel & Operating Cost -->
      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Fuel &amp; operating cost</span>
          <span class="admin-pill-badge badge-cost">$24.8K Total</span>
        </div>
        <div class="admin-fuel-kpi-content">
          <div class="admin-fuel-text-box">
            <div class="bento-metric-figure">$24,800</div>
            <span class="bento-metric-sublabel">Monthly total</span>
          </div>
          <div class="admin-chart-bars">
            <div class="admin-chart-col"><div class="admin-bar-fill" style="height: 24px;"></div><span class="admin-bar-label">Aug</span></div>
            <div class="admin-chart-col"><div class="admin-bar-fill" style="height: 32px;"></div><span class="admin-bar-label">Sep</span></div>
            <div class="admin-chart-col"><div class="admin-bar-fill" style="height: 16px;"></div><span class="admin-bar-label">Oct</span></div>
            <div class="admin-chart-col"><div class="admin-bar-fill" style="height: 38px;"></div><span class="admin-bar-label">Nov</span></div>
            <div class="admin-chart-col"><div class="admin-bar-fill" style="height: 30px;"></div><span class="admin-bar-label">Dec</span></div>
            <div class="admin-chart-col"><div class="admin-bar-fill accent" style="height: 12px;"></div><span class="admin-bar-label">Jan</span></div>
          </div>
        </div>
      </article>

      <!-- 4. Active Shift Rate -->
      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Active shift rate</span>
          <span class="admin-pill-badge badge-shift">↑ 5.2% vs last week</span>
        </div>
        <div class="admin-shift-rate-content">
          <div class="admin-shift-text-box">
            <div class="bento-metric-figure green">88%</div>
            <span class="admin-shift-corridors">6 of 6 Critical Corridors Covered</span>
          </div>
          <div class="admin-donut-wrap">
            <svg class="admin-donut-svg" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1E293B" stroke-width="3.6"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" stroke-width="3.6" stroke-dasharray="88, 100" stroke-linecap="round"/>
            </svg>
            <div class="admin-donut-text">6/6</div>
          </div>
        </div>
      </article>
    </section>

    <!-- Active Fleet Vehicles & Dispatch Directory -->
    <section class="admin-directory-panel">
      <div class="admin-directory-header">
        <h2 class="admin-directory-title">Active Fleet Vehicles &amp; Dispatch Directory</h2>
        <div class="admin-directory-tabs" role="tablist">
          <button class="admin-filter-pill${activeFleetFilter === "all" ? " is-active" : ""}" type="button" data-admin-fleet-filter="all">All Live (8)</button>
          <button class="admin-filter-pill${activeFleetFilter === "on-duty" ? " is-active" : ""}" type="button" data-admin-fleet-filter="on-duty">On Duty (6)</button>
          <button class="admin-filter-pill${activeFleetFilter === "on-break" ? " is-active" : ""}" type="button" data-admin-fleet-filter="on-break">On Break (1)</button>
          <button class="admin-filter-pill${activeFleetFilter === "standby" ? " is-active" : ""}" type="button" data-admin-fleet-filter="standby">Standby (1)</button>
        </div>
        <div class="admin-table-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search driver, bus, route..." value="${escapeHtml(fleetSearchQuery)}" data-admin-fleet-search>
        </div>
      </div>

      <table class="admin-directory-table">
        <thead>
          <tr>
            <th>BUS NO.</th>
            <th>DRIVER</th>
            <th>DISPATCHER</th>
            <th>DESIGNATION / ROUTE</th>
            <th>FUEL &amp; GPS SPEED</th>
            <th>RATE / MAX HRS</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody id="admin-fleet-tbody">
          ${renderAdminFleetRows()}
        </tbody>
      </table>

      <div class="admin-pagination">
        <button type="button" data-admin-action="prev-page">Prev</button>
        <span>Page 1 of 4</span>
        <button type="button" data-admin-action="next-page">Next</button>
      </div>
    </section>

    <!-- Bottom 3 Grid Cards -->
    <section class="admin-bottom-grid">
      <!-- Card 1: Recent Comments -->
      <article class="admin-bottom-card">
        <div class="admin-card-header">
          <div class="admin-card-header-left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Recent maintenance &amp; dispatch comments</span>
          </div>
        </div>
        <div class="admin-comments-list">
          ${adminCommentsData.map((c) => `
            <div class="admin-comment-item">
              <div class="admin-comment-meta">
                <div>
                  <span class="admin-comment-author">${c.author}</span>
                  <span style="color: #64748b;"> commented on service entry </span>
                  <span class="admin-comment-tag ${c.tagColor}">${c.tag}</span>
                </div>
                <span class="admin-comment-time">${c.time}</span>
              </div>
              <p class="admin-comment-text">${c.text}</p>
            </div>
          `).join("")}
        </div>
      </article>

      <!-- Card 2: Upcoming Shift -->
      <article class="admin-bottom-card">
        <div class="admin-card-header">
          <div class="admin-card-header-left">
            <span>Upcoming shifts</span>
          </div>
        </div>
        <div class="admin-shifts-list">
          ${adminShiftsData.map((shift) => `
            <div class="admin-shift-item">
              <div class="admin-shift-details">
                <div class="admin-shift-bus-title">
                  <span class="dot"></span>
                  <span>${shift.bus}</span>
                </div>
                <span class="admin-shift-people">Driver: ${shift.driver}</span>
                <span class="admin-shift-people">Dispatcher: ${shift.dispatcher}</span>
              </div>
              <span class="admin-shift-time-badge">${shift.time}</span>
            </div>
          `).join("")}
        </div>
      </article>

      <!-- Card 3: Route Corridor Map -->
      <article class="admin-bottom-card" style="padding: 10px;">
        <div class="admin-map-container" aria-label="Route Corridor Map from Malolos to Quezon City">
          <svg class="admin-map-svg" viewBox="0 0 380 230" preserveAspectRatio="none">
            <!-- Background Map Layers -->
            <rect width="380" height="230" fill="#d9e3db"/>
            
            <!-- Water Coast (Manila Bay) -->
            <path d="M 0 100 Q 80 140, 100 230 L 0 230 Z" fill="#b9d6e8"/>
            <path d="M 0 160 Q 60 180, 80 230 L 0 230 Z" fill="#9ec5de"/>

            <!-- Secondary roads network -->
            <path d="M 60 20 L 140 80 L 190 60 L 260 90 L 330 60" stroke="#f0f3ee" stroke-width="2.5" fill="none"/>
            <path d="M 120 20 L 170 120 L 230 140 L 320 180" stroke="#f0f3ee" stroke-width="2.5" fill="none"/>
            <path d="M 210 20 L 220 100 L 290 120 L 350 160" stroke="#f0f3ee" stroke-width="2" fill="none"/>
            <path d="M 10 70 L 120 110 L 210 180 L 260 230" stroke="#f0f3ee" stroke-width="2" fill="none"/>
            <path d="M 200 180 L 320 200 L 380 180" stroke="#f0f3ee" stroke-width="2" fill="none"/>

            <!-- Expressways / Arterials -->
            <path d="M 70 30 L 140 100 L 210 160 L 290 200" stroke="#e8d998" stroke-width="3" fill="none"/>
            <path d="M 130 90 L 270 160" stroke="#f8e79b" stroke-width="2" fill="none"/>

            <!-- Transit Corridor Route (Blue Line from Malolos B to Quezon City A) -->
            <path d="M 125 78 Q 155 100, 185 130 T 260 178" stroke="#3b82f6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M 125 78 Q 155 100, 185 130 T 260 178" stroke="#93c5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

            <!-- Towns & Location Labels -->
            <text x="35" y="32" font-size="9" fill="#526270" font-family="sans-serif">Apalit</text>
            <text x="30" y="88" font-size="9" fill="#526270" font-family="sans-serif">Hagonoy</text>
            <text x="138" y="68" font-size="10.5" font-weight="700" fill="#1e293b" font-family="sans-serif">Malolos</text>
            <text x="135" y="105" font-size="8.5" fill="#526270" font-family="sans-serif">Guiguinto</text>
            <text x="165" y="140" font-size="8.5" fill="#526270" font-family="sans-serif">Bocaue</text>
            <text x="188" y="178" font-size="8.5" fill="#526270" font-family="sans-serif">Valenzuela</text>
            <text x="215" y="45" font-size="8.5" fill="#526270" font-family="sans-serif">Plaridel</text>
            <text x="250" y="65" font-size="8.5" fill="#526270" font-family="sans-serif">Pandi</text>
            <text x="280" y="100" font-size="9.5" font-weight="600" fill="#334155" font-family="sans-serif">SJDM</text>
            <text x="310" y="55" font-size="8.5" fill="#526270" font-family="sans-serif">Norzagaray</text>
            <text x="330" y="130" font-size="8.5" fill="#526270" font-family="sans-serif">Rodriguez</text>
            <text x="325" y="152" font-size="8.5" fill="#526270" font-family="sans-serif">San Mateo</text>
            <text x="210" y="222" font-size="9" fill="#526270" font-family="sans-serif">Manila</text>
            <text x="272" y="174" font-size="11" font-weight="700" fill="#0f172a" font-family="sans-serif">Quezon City</text>

            <!-- Marker B (Malolos) -->
            <circle cx="125" cy="74" r="9" fill="#dc2626"/>
            <text x="125" y="78" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">B</text>

            <!-- Marker A (Quezon City / Trinoma) -->
            <circle cx="260" cy="178" r="9" fill="#dc2626"/>
            <text x="260" y="182" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>
          </svg>
        </div>
      </article>
    </section>
  `;

  const adminPredictiveAnalyticsView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Predictive Analytics</h1>
      </div>

      <div class="admin-header-actions">
        <select class="admin-select-corridor" data-analytics-route aria-label="Select Route">
          <option value="Route 1: Trinoma Express (High Priority)">Route 1: Trinoma Express (High Priority)</option>
          <option value="Route 2: Malolos Central Loop">Route 2: Malolos Central Loop</option>
          <option value="Route 3: EDSA Trunk Line">Route 3: EDSA Trunk Line</option>
        </select>
        <select class="admin-select-corridor" data-analytics-range aria-label="Select Forecast Range">
          <option value="Today — 24hr Forecast">Today — 24hr Forecast</option>
          <option value="Tomorrow — 24hr Forecast">Tomorrow — 24hr Forecast</option>
          <option value="Weekend Surge Projection">Weekend Surge Projection</option>
        </select>
        <button class="admin-btn-assign" type="button" data-admin-action="export-surge" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-weight: 700;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Export Surge Report</span>
        </button>
      </div>
    </header>

    <!-- Main Demand & Forecast Card -->
    <section class="admin-analytics-card">
      <div class="analytics-card-header">
        <div class="analytics-legend">
          <span style="color: #64748b; font-size: 11.5px; font-weight: 600;">Congestion states:</span>
          <span class="legend-item"><span class="legend-dot red"></span><span style="color: #ef4444;">Peak / Surge</span></span>
          <span class="legend-item"><span class="legend-dot blue"></span><span style="color: #93c5fd;">Normal</span></span>
          <span class="legend-item"><span class="legend-dot green"></span><span style="color: #6ee7b7;">Low</span></span>
        </div>
      </div>

      <!-- Chart Wrap -->
      <div class="analytics-chart-wrap">
        <div class="chart-y-axis">
          <span>1.5k</span>
          <span>1.1k</span>
          <span>750</span>
          <span>400</span>
          <span>0</span>
          <span style="color: #64748b; font-size: 10px; margin-top: 4px;">Heat</span>
        </div>

        <div class="chart-plot-container">
          <!-- Threshold lines -->
          <div class="chart-threshold-line line-peak" style="bottom: 72%;">
            <span class="threshold-label text-red">Peak Limit (1,080)</span>
          </div>
          <div class="chart-threshold-line line-normal" style="bottom: 38%;">
            <span class="threshold-label text-blue">Normal Threshold (570)</span>
          </div>

          <!-- Bars row -->
          <div class="chart-bars-row" id="analytics-bars-container">
            ${renderForecastBars()}
          </div>
        </div>
      </div>

      <!-- 3 Metrics Strip -->
      <div class="analytics-metrics-strip" id="analytics-metrics-container">
        ${renderPredictiveStats()}
      </div>

      <!-- Bottom Controls inside Card -->
      <div class="analytics-controls-bar">
        <div class="analytics-ctrl-col">
          <label class="ctrl-label">Operating profile</label>
          <select class="analytics-ctrl-select" data-analytics-profile>
            <option value="Intercity / Airport" ${predictiveOperatingProfile === "Intercity / Airport" ? "selected" : ""}>Intercity / Airport</option>
            <option value="Metropolitan Trunk" ${predictiveOperatingProfile === "Metropolitan Trunk" ? "selected" : ""}>Metropolitan Trunk</option>
            <option value="Feeder Shuttle" ${predictiveOperatingProfile === "Feeder Shuttle" ? "selected" : ""}>Feeder Shuttle</option>
          </select>
        </div>

        <div class="analytics-ctrl-col slider-col">
          <div class="slider-label-row">
            <span class="ctrl-label">Transit load scale</span>
            <span class="scale-val" id="scale-val-display">${predictiveTransitLoadScale}%</span>
          </div>
          <input type="range" class="analytics-slider" min="50" max="150" step="5" value="${predictiveTransitLoadScale}" data-analytics-scale aria-label="Transit load scale">
        </div>

        <div class="analytics-ctrl-col scrub-col">
          <div class="scrub-label-row">
            <span class="ctrl-label">Scrub hour inspection</span>
            <button class="scrub-reset-btn" type="button" data-scrub-hour="17">Reset selection</button>
          </div>
          <div class="scrub-buttons">
            <button class="scrub-pill-btn${predictiveSelectedHour === 8 ? " is-active" : ""}" type="button" data-scrub-hour="8">8 AM Morning Peak</button>
            <button class="scrub-pill-btn${predictiveSelectedHour === 17 ? " is-active" : ""}" type="button" data-scrub-hour="17">5 PM Evening Peak</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom 3 Context Cards -->
    <section class="analytics-bottom-grid">
      <!-- Card 1: Economic Conditions -->
      <article class="analytics-bottom-card">
        <div class="admin-card-header">
          <div class="admin-card-header-left">
            <div class="card-icon-badge gold">
              <span style="font-size: 13px; font-weight: 700;">₱</span>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">Economic conditions</div>
          </div>
        </div>

        <div class="bento-denested-content">
          <div class="bento-stat-pair">
            <span class="bento-stat-label">Diesel Spot Index</span>
            <strong class="bento-stat-val text-red">₱68.40/L (+4.2%)</strong>
          </div>
          <p class="bento-stat-desc">Elevated fuel prices trigger modal switch from private motorbikes &amp; cars to Trinoma &amp; EDSA trunk buses.</p>
        </div>

        <div class="bento-divider-line"></div>

        <div class="analytics-card-footer">
          <span style="color: #94a3b8; font-size: 11px;">Ridership sensitivity factor:</span>
          <strong style="color: #10b981; font-size: 11.5px;">0.82 (High Elasticity)</strong>
        </div>
      </article>

      <!-- Card 2: Weather & Monsoon Impact -->
      <article class="analytics-bottom-card">
        <div class="admin-card-header">
          <div class="admin-card-header-left">
            <div class="card-icon-badge cyan">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">Weather &amp; monsoon impact</div>
          </div>
        </div>

        <div class="bento-denested-content">
          <div class="bento-stat-pair">
            <span class="bento-stat-label">Terminal Dwell Surge</span>
            <strong class="bento-stat-val text-amber">+35% Wait Time</strong>
          </div>
          <p class="bento-stat-desc">Monsoon showers projected between 4:30 PM - 8 PM. Commuters stranded at Trinoma &amp; Cubao transit shelters.</p>
        </div>

        <div class="bento-divider-line"></div>

        <div class="analytics-card-footer">
          <span style="color: #94a3b8; font-size: 11px;">Precipitation probability:</span>
          <strong style="color: #38bdf8; font-size: 11.5px;">85% at 5:00 PM</strong>
        </div>
      </article>

      <!-- Card 3: AI Dispatch Recommendation -->
      <article class="analytics-bottom-card">
        <div class="admin-card-header">
          <div class="admin-card-header-left">
            <div class="card-icon-badge mint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">Dispatch recommendation</div>
          </div>
        </div>

        <div class="bento-denested-content">
          <ul class="recommendation-list">
            <li>• Inject <strong>+3 standby buses</strong> into Route 1 (Trinoma)</li>
            <li>• Compress evening headway from <strong>12m → 5m</strong></li>
            <li>• Borrow <strong>2 standby coaches</strong> from Malolos Feeder</li>
          </ul>
        </div>

        <div class="bento-divider-line"></div>

        <div class="analytics-action-row">
          <button class="btn-approve-fleet" type="button" data-admin-action="approve-redistribution">Approve Fleet Redistribution</button>
          <button class="btn-simulate-surge" type="button" data-admin-action="simulate-surge">Simulate</button>
        </div>
      </article>
    </section>
  `;

  const fleetDispatchTelemetryUnits = [
    {
      id: "bus-01",
      unitCode: "UNIT #01",
      busNo: "01",
      category: "delayed",
      tripName: "Northbound Express",
      routeCorridor: "Trinoma / SM North Corridor",
      statusText: "Delayed (+8m)",
      statusType: "delayed",
      headwayAlert: "Headway Deviation: +8 min behind schedule",
      nextStop: "SM North Edsa",
      etaText: "23 min ETA (15:08 PHT)",
      occupancyPct: 78,
      occupancySeats: "55/70 seats",
      occupancyPassengers: "78% (55 / 70 Passengers)",
      driverName: "Dela Cruz, J.",
      driverId: "#DR-4819",
      conductorName: "Santos, M.",
      gpsLocation: "EDSA Guadalupe Overpass",
      scheduledStop: "SM North Edsa (ETA 15:08 PHT)",
      corridor: "edsa",
      progressClass: "amber",
      dotClass: "amber"
    },
    {
      id: "bus-02",
      unitCode: "UNIT #02",
      busNo: "02",
      category: "deployed",
      tripName: "Northbound Local",
      routeCorridor: "EDSA Carousel Loop",
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "Nominal Headway: On schedule (0 min deviation)",
      nextStop: "Trinoma Hub",
      etaText: "7 min ETA (14:55 PHT)",
      occupancyPct: 78,
      occupancySeats: "55/70 seats",
      occupancyPassengers: "78% (55 / 70 Passengers)",
      driverName: "Rogers, S.",
      driverId: "#DR-9204",
      conductorName: "Barton, C.",
      gpsLocation: "EDSA Main Avenue",
      scheduledStop: "Trinoma Hub (ETA 14:55 PHT)",
      corridor: "edsa",
      progressClass: "mint",
      dotClass: "mint"
    },
    {
      id: "bus-14",
      unitCode: "UNIT #14",
      busNo: "14",
      category: "terminal",
      tripName: "Southbound Trunk",
      routeCorridor: "SM North to PITX Express",
      statusText: "At Terminal",
      statusType: "terminal",
      headwayAlert: "Staged at Terminal Bay: Scheduled release in 19 min",
      nextStop: "SM North Edsa Staging",
      etaText: "Departing in 19 min",
      occupancyPct: 78,
      occupancySeats: "55/70 seats",
      occupancyPassengers: "78% (55 / 70 Passengers)",
      driverName: "Dela Cruz, J.",
      driverId: "#DR-4819",
      conductorName: "Reyes, K.",
      gpsLocation: "SM North EDSA Terminal Bay 4",
      scheduledStop: "PITX Intermodal (ETA 16:30 PHT)",
      corridor: "c5",
      progressClass: "purple",
      dotClass: ""
    },
    {
      id: "bus-08",
      unitCode: "UNIT #08",
      busNo: "08",
      category: "deployed",
      tripName: "East-West Connector",
      routeCorridor: "Quezon Ave Rapid",
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "Nominal Headway: -1 min ahead of schedule",
      nextStop: "Ayala Center Interchange",
      etaText: "12 min ETA (15:00 PHT)",
      occupancyPct: 42,
      occupancySeats: "30/70 seats",
      occupancyPassengers: "42% (30 / 70 Passengers)",
      driverName: "Bautista, M.",
      driverId: "#DR-7711",
      conductorName: "Villanueva, E.",
      gpsLocation: "Quezon Ave Underpass / EDSA",
      scheduledStop: "Ayala Center Interchange (ETA 15:00 PHT)",
      corridor: "quezon",
      progressClass: "mint",
      dotClass: "mint"
    },
    {
      id: "bus-23",
      unitCode: "UNIT #23",
      busNo: "23",
      badge: "",
      category: "deployed",
      tripName: "Airport Shuttle Trunk",
      routeCorridor: "NAIA Loop Connector",
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "High Passenger Density: Nominal Headway +1m buffer",
      nextStop: "Terminal 3 Hub",
      etaText: "16 min ETA (15:04 PHT)",
      occupancyPct: 92,
      occupancySeats: "65/70 seats",
      occupancyPassengers: "92% (65 / 70 Passengers)",
      driverName: "Alcantara, R.",
      driverId: "#DR-3108",
      conductorName: "Morales, G.",
      gpsLocation: "NAIA Expressway Nichols Ramp",
      scheduledStop: "Terminal 3 Hub (ETA 15:04 PHT)",
      corridor: "edsa",
      progressClass: "amber",
      dotClass: "mint"
    }
  ];

  const renderFleetTelemetryRows = () => {
    const list = fleetDispatchTelemetryUnits.filter((u) => {
      if (dispatchTelemetryFilter === "deployed") return u.category === "deployed";
      if (dispatchTelemetryFilter === "delayed") return u.category === "delayed";
      if (dispatchTelemetryFilter === "terminal") return u.category === "terminal";
      return true;
    });

    if (list.length === 0) {
      return `<tr><td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">No fleet vehicles in this category.</td></tr>`;
    }

    return list.map((bus) => {
      const isSelected = bus.id === selectedDispatchBusId;
      return `
        <tr class="fleet-telemetry-row${isSelected ? " is-selected" : ""}" data-select-bus="${bus.id}">
          <td>
            <div class="bus-cell-badge-wrap">
              <span class="bus-active-dot${bus.dotClass ? " " + bus.dotClass : ""}"></span>
              <span class="bus-number-text">${bus.busNo}</span>
            </div>
          </td>
          <td>
            <div class="trip-dest-title">${bus.tripName}</div>
            <div class="trip-dest-sub">${bus.routeCorridor}</div>
          </td>
          <td>
            <span class="status-pill-telemetry ${bus.statusType}"><span class="status-dot"></span>${bus.statusText}</span>
          </td>
          <td>
            <div class="next-stop-name">${bus.nextStop}</div>
            <div class="next-stop-eta${bus.statusType === "terminal" ? " muted" : ""}">${bus.etaText}</div>
          </td>
          <td>
            <div class="occupancy-cell-wrap">
              <div class="occupancy-top-row">
                <span class="occupancy-pct">${bus.occupancyPct}%</span>
                <span class="occupancy-seats">${bus.occupancySeats}</span>
              </div>
              <div class="occupancy-progress-bg">
                <div class="occupancy-progress-fill ${bus.progressClass}" style="width: ${bus.occupancyPct}%;"></div>
              </div>
            </div>
          </td>
          <td>
            <div class="driver-name-text">${bus.driverName}</div>
            <div class="driver-id-sub">ID: ${bus.driverId}</div>
          </td>
        </tr>
      `;
    }).join("");
  };

  const renderDispatchControlPanel = () => {
    const unit = fleetDispatchTelemetryUnits.find((u) => u.id === selectedDispatchBusId) || fleetDispatchTelemetryUnits[0];
    return `
      <section class="dispatch-control-panel-card">
        <header class="dispatch-panel-header">
          <div class="dispatch-panel-title-wrap">
            <h2 class="dispatch-panel-title">Dispatch Control Panel</h2>
          </div>
          <span class="dispatch-unit-badge">${unit.unitCode}</span>
        </header>

        <!-- Active Selection Box -->
        <div class="dispatch-active-selection-box">
          <span class="selection-box-label">Selected Bus</span>
          <div class="selection-box-title-row">
            <h3 class="selection-bus-heading">Bus No. ${unit.busNo} — ${unit.tripName}</h3>
            <button class="selection-clock-btn" type="button" title="View Schedule Headway">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 15px; height: 15px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </button>
          </div>
          <div class="selection-alert-subtext">
            <span class="alert-dot-amber"></span>
            <span>${unit.headwayAlert}</span>
          </div>
        </div>

        <!-- Meta Specification Rows -->
        <div class="dispatch-specs-list">
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Bus Number</span>
            <span class="spec-val-content">${unit.busNo}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Trip / Route</span>
            <span class="spec-val-content">${unit.routeCorridor.replace(" Corridor", "").replace(" Loop", "")}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Current Status</span>
            <span class="spec-val-content">
              <span class="status-pill-telemetry ${unit.statusType}"><span class="status-dot"></span>${unit.statusText}</span>
            </span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Live Occupancy</span>
            <span class="spec-val-content">${unit.occupancyPassengers}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Assigned Driver</span>
            <span class="spec-val-content">${unit.driverName} (Conductor: ${unit.conductorName})</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Current GPS Location</span>
            <span class="spec-val-content">${unit.gpsLocation}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Next Scheduled Stop</span>
            <span class="spec-val-content" style="color: #2fd9a8;">${unit.scheduledStop}</span>
          </div>
        </div>

        <!-- 2x2 Dispatcher Interventions -->
        <div class="dispatch-interventions-section">
          <span class="interventions-label">Dispatcher interventions</span>
          <div class="interventions-grid-2x2">
            <button class="intervention-btn" type="button" data-dispatch-action="reroute">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>Reroute</span>
            </button>
            <button class="intervention-btn" type="button" data-dispatch-action="hold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="10" y1="4" x2="10" y2="20"/><line x1="14" y1="4" x2="14" y2="20"/></svg>
              <span>Hold at Terminal</span>
            </button>
            <button class="intervention-btn" type="button" data-dispatch-action="recall">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Recall to Depot</span>
            </button>
            <button class="intervention-btn" type="button" data-dispatch-action="assign-driver">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>
              <span>Assign Driver</span>
            </button>
          </div>
        </div>

        <!-- Dispatch note input -->
        <div class="dispatch-note-wrap">
          <label class="dispatch-note-label">Dispatch note (optional)</label>
          <textarea class="dispatch-note-textarea" placeholder="Add special detour, headway instructions, or maintenance alert..." data-dispatch-note>${escapeHtml(dispatchNoteInput)}</textarea>
        </div>

        <!-- Main Send Action Button -->
        <button class="btn-send-dispatch-order" type="button" data-dispatch-action="send-order">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          <span>Send Dispatch Order</span>
        </button>
      </section>
    `;
  };

  const renderRadarMapSvg = () => {
    const isEdsa = dispatchCorridorFilter === "edsa";
    const isC5 = dispatchCorridorFilter === "c5";
    const isQuezon = dispatchCorridorFilter === "quezon";

    return `
      <svg class="radar-map-svg" viewBox="0 0 740 260" preserveAspectRatio="xMidYMid meet" style="transform: scale(${dispatchMapZoom}); transition: transform 0.25s ease;">
        <defs>
          <pattern id="tactical-grid-pat" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
          </pattern>
          <filter id="radar-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Grid Rect -->
        <rect width="740" height="260" fill="url(#tactical-grid-pat)" />

        <!-- Faint Coordinate / Radar Guides -->
        <circle cx="450" cy="145" r="120" fill="none" stroke="rgba(255,255,255,0.025)" stroke-dasharray="3 3"/>
        <line x1="0" y1="145" x2="740" y2="145" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
        <line x1="450" y1="0" x2="450" y2="260" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

        <!-- Route Path: EDSA Carousel (Mint Curve) -->
        <path d="M 180 230 C 290 230, 360 170, 450 145 S 580 90, 660 75" fill="none" stroke="#2fd9a8" stroke-width="3.5" filter="url(#radar-glow-filter)" stroke-linecap="round" opacity="${isEdsa || (!isC5 && !isQuezon) ? '1' : '0.35'}"/>
        <path d="M 180 230 C 290 230, 360 170, 450 145 S 580 90, 660 75" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="6 4" opacity="0.6"/>

        <!-- Route Path: C-5 Hub (Purple Curve) -->
        <path d="M 230 200 C 320 200, 390 175, 490 170 S 620 185, 680 185" fill="none" stroke="#a855f7" stroke-width="3" filter="url(#radar-glow-filter)" stroke-linecap="round" opacity="${isC5 || (!isEdsa && !isQuezon) ? '1' : '0.35'}"/>

        <!-- Secondary Linking Dashed Arc (Quezon Ave) -->
        <path d="M 360 85 Q 490 100, 660 75" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4 4" opacity="${isQuezon || (!isEdsa && !isC5) ? '0.7' : '0.25'}"/>

        <!-- Stations / Waypoints -->
        <!-- Buendia / Ayala -->
        <g opacity="0.9">
          <circle cx="330" cy="192" r="4.5" fill="#0d1b2a" stroke="#2fd9a8" stroke-width="1.8"/>
          <text x="330" y="209" fill="#72849a" font-size="9" font-weight="600" text-anchor="middle">Buendia / Ayala</text>
        </g>

        <!-- Trinoma Hub -->
        <g opacity="0.9">
          <circle cx="590" cy="82" r="4.5" fill="#0d1b2a" stroke="#2fd9a8" stroke-width="1.8"/>
          <text x="590" y="72" fill="#8da2bb" font-size="9" font-weight="600" text-anchor="middle">Trinoma Hub</text>
        </g>

        <!-- SM North Edsa (Terminal) -->
        <g opacity="1">
          <circle cx="660" cy="75" r="5" fill="#fbbf24" stroke="#ffffff" stroke-width="1.5"/>
          <text x="670" y="65" fill="#fbbf24" font-size="9" font-weight="700">SM North Edsa (Terminal)</text>
        </g>

        <!-- BUS 08 Marker -->
        <g class="bus-map-marker" data-map-bus="bus-08" style="cursor: pointer;">
          <rect x="348" y="70" width="52" height="18" rx="9" fill="#08181f" stroke="#2fd9a8" stroke-width="1.2"/>
          <text x="374" y="82.5" fill="#2fd9a8" font-size="8.5" font-weight="700" text-anchor="middle">BUS 08</text>
        </g>

        <!-- BUS 02 Marker -->
        <g class="bus-map-marker" data-map-bus="bus-02" style="cursor: pointer;">
          <rect x="494" y="96" width="52" height="18" rx="9" fill="#08181f" stroke="#2fd9a8" stroke-width="1.2"/>
          <text x="520" y="108.5" fill="#2fd9a8" font-size="8.5" font-weight="700" text-anchor="middle">BUS 02</text>
        </g>

        <!-- BUS 01 (DELAYED) Marker with Sonar Pulse Ring -->
        <g class="bus-map-marker" data-map-bus="bus-01" style="cursor: pointer;">
          <circle cx="450" cy="145" r="14" class="radar-ping-ring" stroke="#f59e0b" fill="none" opacity="0.8"/>
          <circle cx="450" cy="145" r="8" stroke="#f59e0b" stroke-width="1.5" fill="rgba(245, 158, 11, 0.25)"/>
          <circle cx="450" cy="145" r="3" fill="#f59e0b"/>
          <rect x="402" y="118" width="96" height="20" rx="10" fill="#241406" stroke="#f59e0b" stroke-width="1.4"/>
          <text x="450" y="131.5" fill="#fbbf24" font-size="8.5" font-weight="700" text-anchor="middle">BUS 01 (DELAYED)</text>
        </g>

        <!-- BUS 14 Marker -->
        <g class="bus-map-marker" data-map-bus="bus-14" style="cursor: pointer;">
          <rect x="534" y="161" width="52" height="18" rx="9" fill="#1e102b" stroke="#a855f7" stroke-width="1.2"/>
          <text x="560" y="173.5" fill="#c084fc" font-size="8.5" font-weight="700" text-anchor="middle">BUS 14</text>
        </g>
      </svg>
    `;
  };

  const adminFleetDispatchView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Fleet Monitoring &amp; Dispatch</h1>
      </div>

      <div class="admin-header-actions">
        <button class="admin-btn-assign" type="button" data-admin-action="open-assign">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Assign Dispatch</span>
        </button>
      </div>
    </header>

    <!-- Main 2-Column Operational Grid -->
    <div class="fleet-dispatch-grid">
      <!-- Left Column: Map + Table -->
      <div class="fleet-dispatch-left-col">
        <!-- 1. Radar Map Card -->
        <section class="admin-radar-map-card">
          <div class="radar-map-toolbar">
            <div class="corridor-filter-group">
              <span class="corridor-label">Corridor:</span>
              <button class="corridor-pill-btn${dispatchCorridorFilter === "edsa" ? " is-active" : ""}" type="button" data-corridor-filter="edsa">EDSA Carousel</button>
              <button class="corridor-pill-btn${dispatchCorridorFilter === "c5" ? " is-active" : ""}" type="button" data-corridor-filter="c5">C-5 Hub</button>
              <button class="corridor-pill-btn${dispatchCorridorFilter === "quezon" ? " is-active" : ""}" type="button" data-corridor-filter="quezon">Quezon Ave</button>
            </div>

            <div class="map-viewport-tools">
              <button class="map-tool-btn" type="button" data-map-zoom="in" title="Zoom In">+</button>
              <div class="map-tool-divider"></div>
              <button class="map-tool-btn" type="button" data-map-zoom="out" title="Zoom Out">-</button>
              <div class="map-tool-divider"></div>
              <button class="map-tool-btn" type="button" data-map-layers title="Toggle Layers">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                <span>Layers</span>
              </button>
            </div>
          </div>

          <div class="radar-map-viewport" id="radar-viewport-container">
            ${renderRadarMapSvg()}
          </div>

          <div class="radar-map-legend">
            <span class="legend-item"><span class="legend-dot-circle mint"></span> On-Time Transit</span>
            <span class="legend-item"><span class="legend-dot-circle amber"></span> Delayed Headway (+8m)</span>
            <span class="legend-item"><span class="legend-dot-circle purple"></span> At Terminal / Staging</span>
          </div>
        </section>

        <!-- 2. Active Fleet Telemetry Table Card -->
        <section class="admin-telemetry-table-card">
          <div class="telemetry-table-header-row">
            <div class="telemetry-card-title-wrap">
              <h2 class="telemetry-card-title">Active Fleet Telemetry</h2>
            </div>

            <div class="telemetry-filter-tabs">
              <button class="telemetry-tab-pill${dispatchTelemetryFilter === "all" ? " is-active" : ""}" type="button" data-telemetry-tab="all">All Units (46)</button>
              <button class="telemetry-tab-pill${dispatchTelemetryFilter === "deployed" ? " is-active" : ""}" type="button" data-telemetry-tab="deployed">Deployed (32)</button>
              <button class="telemetry-tab-pill pill-amber${dispatchTelemetryFilter === "delayed" ? " is-active" : ""}" type="button" data-telemetry-tab="delayed">Delayed (1)</button>
              <button class="telemetry-tab-pill pill-purple${dispatchTelemetryFilter === "terminal" ? " is-active" : ""}" type="button" data-telemetry-tab="terminal">At Terminal (4)</button>
            </div>
          </div>

          <div class="telemetry-table-wrap">
            <table class="fleet-telemetry-table">
              <thead>
                <tr>
                  <th>BUS NO.</th>
                  <th>TRIP DESTINATION</th>
                  <th>STATUS</th>
                  <th>NEXT STOP &amp; ETA</th>
                  <th>OCCUPANCY</th>
                  <th>DRIVER</th>
                </tr>
              </thead>
              <tbody id="fleet-telemetry-tbody">
                ${renderFleetTelemetryRows()}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Right Column: Dispatch Control Panel -->
      <div class="fleet-dispatch-right-col" id="dispatch-panel-container">
        ${renderDispatchControlPanel()}
      </div>
    </div>
  `;

  const adminStaffMembersData = [
    {
      id: "staff-01",
      name: "Juan Dela Cruz",
      staffId: "A01DSGN193 • DRV",
      initials: "JD",
      avatarClass: "",
      role: "Driver",
      roleKey: "driver",
      busNo: "01",
      depot: "Trinoma Hub",
      rate: "$4.50",
      maxHours: "10 hrs",
      status: "On Duty",
      statusKey: "on-duty",
      statusClass: "on-duty"
    },
    {
      id: "staff-02",
      name: "John Dela Cruz",
      staffId: "A02DSGN196 • DSP",
      initials: "JC",
      avatarClass: "",
      role: "Dispatcher",
      roleKey: "dispatcher",
      busNo: "-",
      depot: "Malolos Hub",
      rate: "$3.00",
      maxHours: "5 hrs",
      status: "On Duty",
      statusKey: "on-duty",
      statusClass: "on-duty"
    },
    {
      id: "staff-03",
      name: "Cyrhyl Naval",
      staffId: "A05DEVP381 • DRV",
      initials: "CN",
      avatarClass: "",
      role: "Driver",
      roleKey: "driver",
      busNo: "02",
      depot: "Trinoma Hub",
      rate: "$4.50",
      maxHours: "5 hrs",
      status: "On Break",
      statusKey: "on-break",
      statusClass: "on-break"
    },
    {
      id: "staff-04",
      name: "Eldrei Acero",
      staffId: "A04DEVP312 • DRV",
      initials: "EA",
      avatarClass: "",
      role: "Driver",
      roleKey: "driver",
      busNo: "03",
      depot: "Trinoma Hub",
      rate: "$4.50",
      maxHours: "5 hrs",
      status: "Off",
      statusKey: "off",
      statusClass: "off"
    },
    {
      id: "staff-05",
      name: "Royce Zaldivar",
      staffId: "A03DEVP273 • DRV",
      initials: "RZ",
      avatarClass: "",
      role: "Driver",
      roleKey: "driver",
      busNo: "04",
      depot: "Trinoma Hub",
      rate: "$4.50",
      maxHours: "5 hrs",
      status: "On Duty",
      statusKey: "on-duty",
      statusClass: "on-duty"
    },
    {
      id: "staff-06",
      name: "Jericho Rosales",
      staffId: "A02MRKT028 • DRV",
      initials: "JR",
      avatarClass: "",
      role: "Driver",
      roleKey: "driver",
      busNo: "05",
      depot: "Trinoma Hub",
      rate: "$4.50",
      maxHours: "5 hrs",
      status: "On Duty",
      statusKey: "on-duty",
      statusClass: "on-duty"
    },
    {
      id: "staff-07",
      name: "Judy Ann Santos",
      staffId: "A01MNGR019 • DSP",
      initials: "JS",
      avatarClass: "",
      role: "Dispatcher",
      roleKey: "dispatcher",
      busNo: "-",
      depot: "Malolos Hub",
      rate: "$3.00",
      maxHours: "5 hrs",
      status: "On Duty",
      statusKey: "on-duty",
      statusClass: "on-duty"
    },
    {
      id: "staff-08",
      name: "Joshua Garcia",
      staffId: "A03DSGN083 • DRV",
      initials: "JG",
      avatarClass: "",
      role: "Driver",
      roleKey: "driver",
      busNo: "06",
      depot: "Malolos Hub",
      rate: "$4.50",
      maxHours: "5 hrs",
      status: "On Duty",
      statusKey: "on-duty",
      statusClass: "on-duty"
    }
  ];

  const renderStaffTableRows = () => {
    const q = staffSearchQuery.toLowerCase().trim();
    const filtered = adminStaffMembersData.filter((member) => {
      if (activeStaffRoleFilter === "drivers" && member.roleKey !== "driver") return false;
      if (activeStaffRoleFilter === "dispatchers" && member.roleKey !== "dispatcher") return false;
      if (activeStaffRoleFilter === "maintenance" && member.roleKey !== "maintenance") return false;
      if (staffDepotFilter !== "all" && !member.depot.toLowerCase().includes(staffDepotFilter.toLowerCase())) return false;
      if (!q) return true;
      return (
        member.name.toLowerCase().includes(q) ||
        member.staffId.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.depot.toLowerCase().includes(q) ||
        member.busNo.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      return `<tr><td colspan="9" style="text-align: center; padding: 32px; color: #64748b;">No matching personnel found in directory.</td></tr>`;
    }

    return filtered.map((staff) => {
      const isChecked = staffSelectedRows.has(staff.id);
      let statusDot = `<span class="status-dot-mint"></span>`;
      if (staff.statusKey === "on-break") statusDot = `<span class="status-dot-amber"></span>`;
      else if (staff.statusKey === "off") statusDot = `<span class="status-dot-gray"></span>`;

      return `
        <tr data-staff-row="${staff.id}" class="${isChecked ? "is-selected" : ""}">
          <td>
            <input type="checkbox" class="staff-checkbox" data-staff-checkbox="${staff.id}" ${isChecked ? "checked" : ""} aria-label="Select ${escapeHtml(staff.name)}">
          </td>
          <td>
            <div class="staff-member-cell">
              <div class="staff-avatar ${staff.avatarClass}${isChecked ? " is-selected" : ""}">${staff.initials}</div>
              <div class="staff-name-wrap">
                <span class="staff-name-text">${escapeHtml(staff.name)}</span>
                <span class="staff-id-text">${escapeHtml(staff.staffId)}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="staff-role-text">${staff.role}</span>
          </td>
          <td>
            <span class="staff-bus-text">${staff.busNo}</span>
          </td>
          <td>
            <span class="staff-depot-text">${staff.depot}</span>
          </td>
          <td>
            <span class="staff-rate-text">${staff.rate}</span>
          </td>
          <td>
            <span class="staff-max-hours-text">${staff.maxHours}</span>
          </td>
          <td>
            <span class="staff-status-badge ${staff.statusClass}">
              ${statusDot}
              <span>${staff.status}</span>
            </span>
          </td>
          <td>
            <button class="staff-action-more-btn" type="button" data-staff-action="open-menu" data-staff-id="${staff.id}" title="Action options for ${escapeHtml(staff.name)}">•••</button>
          </td>
        </tr>
      `;
    }).join("");
  };

  const adminStaffResourcesView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Staff and Resources</h1>
      </div>

      <div class="admin-header-actions">
        <!-- Search Input -->
        <div class="staff-header-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="staff-header-search-input" placeholder="Search staff, ID, or route..." value="${escapeHtml(staffSearchQuery)}" data-staff-search aria-label="Search staff directory">
        </div>

        <!-- Export CSV Button -->
        <button class="staff-btn-export-csv" type="button" data-staff-action="export-csv">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Export CSV</span>
        </button>

        <!-- Add Staff Button -->
        <button class="staff-btn-add-member" type="button" data-staff-action="add-staff">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Add Staff</span>
        </button>
      </div>
    </header>

    <!-- Main Staff Directory Card -->
    <section class="staff-directory-card">
      <!-- Toolbar -->
      <div class="staff-directory-toolbar">
        <div class="staff-directory-title-tabs">
          <h2 class="staff-directory-title">Staff Directory</h2>
          <div class="staff-role-tabs" role="tablist">
            <button class="staff-role-pill${activeStaffRoleFilter === "all" ? " is-active" : ""}" type="button" data-staff-role-filter="all">All Staff (148)</button>
            <button class="staff-role-pill${activeStaffRoleFilter === "drivers" ? " is-active" : ""}" type="button" data-staff-role-filter="drivers">Drivers (96)</button>
            <button class="staff-role-pill${activeStaffRoleFilter === "dispatchers" ? " is-active" : ""}" type="button" data-staff-role-filter="dispatchers">Dispatchers (24)</button>
            <button class="staff-role-pill${activeStaffRoleFilter === "maintenance" ? " is-active" : ""}" type="button" data-staff-role-filter="maintenance">Maintenance (28)</button>
          </div>
        </div>

        <div class="staff-directory-tools-right">
          <span class="staff-count-summary">Showing <strong>8</strong> of 148 operational members</span>
          <button class="staff-depot-filter-btn" type="button" data-staff-action="toggle-depot-filter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>${staffDepotFilter === "all" ? "Filter by Depot" : escapeHtml(staffDepotFilter)}</span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="staff-table-wrap">
        <table class="staff-data-table">
          <thead>
            <tr>
              <th style="width: 32px;">
                <input type="checkbox" class="staff-checkbox" data-staff-check-all aria-label="Select all staff">
              </th>
              <th>STAFF MEMBER</th>
              <th>ROLE</th>
              <th>BUS NO.</th>
              <th>DESIGNATION / DEPOT</th>
              <th>HOURLY RATE</th>
              <th>MAX HOURS</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody id="staff-table-tbody">
            ${renderStaffTableRows()}
          </tbody>
        </table>
      </div>

      <!-- Pagination Row -->
      <div class="staff-pagination-row">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span>Show</span>
          <select class="staff-per-page-select" data-staff-per-page aria-label="Records per page">
            <option value="8" selected>8 records</option>
            <option value="16">16 records</option>
            <option value="32">32 records</option>
          </select>
          <span>per page</span>
        </div>

        <div class="staff-pagination-nav">
          <button class="staff-page-btn" type="button" data-staff-page="prev" aria-label="Previous page">&lt;</button>
          <button class="staff-page-btn is-active" type="button" data-staff-page="1">1</button>
          <button class="staff-page-btn" type="button" data-staff-page="2">2</button>
          <button class="staff-page-btn" type="button" data-staff-page="3">3</button>
          <span class="staff-page-ellipsis">...</span>
          <button class="staff-page-btn" type="button" data-staff-page="19">19</button>
          <button class="staff-page-btn" type="button" data-staff-page="next" aria-label="Next page">&gt;</button>
        </div>

        <span class="staff-pagination-count">Showing 1-8 of 148 staff</span>
      </div>
    </section>
  `;

  const adminCameraFeedsData = [
    {
      id: "cam-01",
      code: "CAM 3.1/ws",
      title: "Trinoma Platform Bay 1",
      corridor: "trinoma",
      corridorLabel: "Trinoma Hub",
      image: "assets/cctv/cam1.jpg",
      status: "LIVE",
      resolution: "1080p60",
      bitrate: "4.2 Mbps",
      latency: "12ms",
      uptime: "48h 12m",
      fps: 60,
      sensorHealth: "Optimal",
      temp: "42°C",
      aiDetections: [
        { label: "PASSENGER: 98%", top: "62%", left: "68%", width: "9%", height: "24%", color: "mint" },
        { label: "BUS #01: 99%", top: "24%", left: "37%", width: "16%", height: "18%", color: "cyan" },
        { label: "QUEUE: 8 PAX", top: "33%", left: "61%", width: "11%", height: "14%", color: "amber" }
      ]
    },
    {
      id: "cam-02",
      code: "CAM 4.1/ws",
      title: "Bus 01 Interior Cabin",
      corridor: "fleet",
      corridorLabel: "Fleet Onboard",
      image: "assets/cctv/cam2.jpg",
      status: "LIVE",
      resolution: "1080p60",
      bitrate: "3.8 Mbps",
      latency: "15ms",
      uptime: "16h 04m",
      fps: 60,
      sensorHealth: "Optimal",
      temp: "38°C",
      aiDetections: [
        { label: "OCCUPANCY: 18/45", top: "38%", left: "55%", width: "18%", height: "35%", color: "mint" },
        { label: "AISLE: CLEAR", top: "50%", left: "35%", width: "16%", height: "30%", color: "cyan" }
      ]
    },
    {
      id: "cam-03",
      code: "CAM 7.1/ws",
      title: "EDSA Balintawak Corridor",
      corridor: "edsa",
      corridorLabel: "EDSA Corridor",
      image: "assets/cctv/cam3.jpg",
      status: "LIVE",
      resolution: "1080p60",
      bitrate: "5.1 Mbps",
      latency: "9ms",
      uptime: "96h 40m",
      fps: 60,
      sensorHealth: "Optimal",
      temp: "44°C",
      aiDetections: [
        { label: "PLATE: B347-XZ2 • 52 km/h", top: "58%", left: "42%", width: "18%", height: "28%", color: "amber" },
        { label: "SPD: 48 km/h", top: "66%", left: "27%", width: "12%", height: "20%", color: "mint" }
      ]
    },
    {
      id: "cam-04",
      code: "CAM 5.1/ws",
      title: "Malolos Maintenance Depot",
      corridor: "depot",
      corridorLabel: "Depot Bays",
      image: "assets/cctv/cam4.jpg",
      status: "LIVE",
      resolution: "1080p60",
      bitrate: "4.0 Mbps",
      latency: "14ms",
      uptime: "120h 18m",
      fps: 60,
      sensorHealth: "Optimal",
      temp: "39°C",
      aiDetections: [
        { label: "BAY 6 HYDRAULIC LIFT", top: "35%", left: "43%", width: "16%", height: "40%", color: "cyan" },
        { label: "CREW: 1 TECH", top: "68%", left: "48%", width: "6%", height: "18%", color: "mint" }
      ]
    },
    {
      id: "cam-05",
      code: "CAM 6.1/ws",
      title: "Bus 04 Driver Telematics",
      corridor: "fleet",
      corridorLabel: "Fleet Onboard",
      image: "assets/cctv/cam5.jpg",
      status: "LIVE",
      resolution: "1080p60",
      bitrate: "3.6 Mbps",
      latency: "18ms",
      uptime: "14h 22m",
      fps: 60,
      sensorHealth: "Optimal",
      temp: "37°C",
      aiDetections: [
        { label: "DRIVER: D741 • ALERT", top: "28%", left: "18%", width: "38%", height: "65%", color: "mint" },
        { label: "DASHBOARD CLUSTER", top: "60%", left: "72%", width: "16%", height: "24%", color: "cyan" }
      ]
    },
    {
      id: "cam-06",
      code: "CAM 8.1/ws",
      title: "Station Concourse Turnstiles",
      corridor: "trinoma",
      corridorLabel: "Trinoma Hub",
      image: "assets/cctv/cam6.jpg",
      status: "LIVE",
      resolution: "1080p60",
      bitrate: "4.6 Mbps",
      latency: "11ms",
      uptime: "72h 55m",
      fps: 60,
      sensorHealth: "Optimal",
      temp: "41°C",
      aiDetections: [
        { label: "TURNSTILES: 84 PAX/MIN", top: "48%", left: "26%", width: "42%", height: "30%", color: "cyan" },
        { label: "CROWD: MODERATE", top: "20%", left: "32%", width: "35%", height: "26%", color: "mint" }
      ]
    }
  ];

  const renderCameraFeedsGrid = () => {
    let feeds = adminCameraFeedsData;
    if (activeCameraCorridorFilter !== "all") {
      feeds = feeds.filter((f) => f.corridor === activeCameraCorridorFilter);
    }
    if (cameraSearchQuery.trim()) {
      const q = cameraSearchQuery.toLowerCase().trim();
      feeds = feeds.filter((f) => f.title.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.corridorLabel.toLowerCase().includes(q));
    }

    if (feeds.length === 0) {
      return `<div class="cctv-no-feeds">No camera feeds match the selected filter.</div>`;
    }

    if (activeCameraLayout === "focus") {
      const focusedCam = feeds.find((f) => f.id === focusedCameraId) || feeds[0];
      return `
        <div class="cctv-focus-layout">
          <div class="cctv-focus-main">
            ${renderSingleCctvFeed(focusedCam, true)}
          </div>
          <div class="cctv-focus-thumbnails">
            ${feeds.map((f) => `
              <div class="cctv-thumb-card${f.id === focusedCam.id ? " is-active" : ""}" data-cctv-action="focus" data-cctv-id="${f.id}" title="Focus ${f.title}">
                <img src="${f.image}" alt="${f.title}">
                <div class="cctv-thumb-meta">
                  <span class="cctv-thumb-code">${f.code}</span>
                  <span class="cctv-thumb-name">${f.title}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="cctv-grid-layout layout-${activeCameraLayout}">
        ${feeds.map((cam) => renderSingleCctvFeed(cam, false)).join("")}
      </div>
    `;
  };

  const renderSingleCctvFeed = (cam, isLarge = false) => {
    return `
      <div class="cctv-feed-card${isLarge ? " is-large" : ""}" data-cctv-feed="${cam.id}">
        <!-- Top OSD Bar -->
        <div class="cctv-osd-top">
          <div class="cctv-osd-title-group">
            <span class="cctv-cam-code">${cam.code}</span>
            <span class="cctv-cam-name">${cam.title}</span>
          </div>
          <div class="cctv-osd-status-group">
            <span class="cctv-timestamp" data-live-clock>14:48:22 PHT</span>
            <button class="cctv-btn-expand" type="button" data-cctv-action="focus" data-cctv-id="${cam.id}" title="Focus this camera feed" aria-label="Focus ${cam.code}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
          </div>
        </div>

        <!-- Video Viewport with Scanlines, Crosshairs & AI Detections -->
        <div class="cctv-video-viewport" data-cctv-action="focus" data-cctv-id="${cam.id}">
          <img src="${cam.image}" alt="${cam.title}" class="cctv-video-img" loading="lazy">
          ${cameraScanlinesEnabled ? `<div class="cctv-scanlines"></div><div class="cctv-crosshair"></div>` : ""}
          ${cameraAiDetectionEnabled ? cam.aiDetections.map((det) => `
            <div class="cctv-ai-box ${det.color}" style="top: ${det.top}; left: ${det.left}; width: ${det.width}; height: ${det.height};">
              <span class="cctv-ai-label">${det.label}</span>
            </div>
          `).join("") : ""}
        </div>

        <!-- Bottom OSD Bar -->
        ${cameraOsdEnabled ? `
        <div class="cctv-osd-bottom">
          <div class="cctv-telemetry-tags">
            <span class="cctv-tag">UPTIME <strong>${cam.uptime}</strong></span>
            <span class="cctv-tag">${cam.resolution}</span>
            <span class="cctv-tag">${cam.bitrate}</span>
            <span class="cctv-tag">${cam.latency}</span>
          </div>
          <div class="cctv-feed-actions">
            <button class="cctv-mini-btn" type="button" data-cctv-action="snapshot" data-cctv-id="${cam.id}" title="Capture Snapshot of ${cam.code}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
            <button class="cctv-mini-btn" type="button" data-cctv-action="ptz" data-cctv-id="${cam.id}" title="PTZ & Diagnostics for ${cam.code}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
            </button>
          </div>
        </div>
        ` : ""}
      </div>
    `;
  };

  const renderSensorTelemetryWaveform = () => {
    let strokeColor = "#2fd9a8";
    let fillColor = "url(#cctv-wave-grad-mint)";
    let pathD = "M 0 52 C 30 45, 60 70, 90 48 C 120 28, 150 64, 180 50 C 210 36, 240 68, 270 42 C 300 18, 330 62, 360 38 C 390 14, 420 54, 450 32 C 480 12, 510 46, 540 28 L 540 85 L 0 85 Z";
    let lineD = "M 0 52 C 30 45, 60 70, 90 48 C 120 28, 150 64, 180 50 C 210 36, 240 68, 270 42 C 300 18, 330 62, 360 38 C 390 14, 420 54, 450 32 C 480 12, 510 46, 540 28";

    if (cameraWaveformTab === "ai") {
      strokeColor = "#38bdf8";
      fillColor = "url(#cctv-wave-grad-blue)";
      pathD = "M 0 65 C 40 60, 80 40, 120 42 C 160 45, 200 20, 240 22 C 280 25, 320 50, 360 48 C 400 45, 440 15, 480 20 C 510 25, 530 40, 540 38 L 540 85 L 0 85 Z";
      lineD = "M 0 65 C 40 60, 80 40, 120 42 C 160 45, 200 20, 240 22 C 280 25, 320 50, 360 48 C 400 45, 440 15, 480 20 C 510 25, 530 40, 540 38";
    } else if (cameraWaveformTab === "debug") {
      strokeColor = "#f59e0b";
      fillColor = "url(#cctv-wave-grad-amber)";
      pathD = "M 0 70 C 45 68, 90 62, 135 60 C 180 58, 225 35, 270 36 C 315 38, 360 70, 405 66 C 450 62, 495 42, 540 45 L 540 85 L 0 85 Z";
      lineD = "M 0 70 C 45 68, 90 62, 135 60 C 180 58, 225 35, 270 36 C 315 38, 360 70, 405 66 C 450 62, 495 42, 540 45";
    }

    return `
      <div class="cctv-waveform-inner">
        <svg viewBox="0 0 540 85" class="cctv-waveform-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cctv-wave-grad-mint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2fd9a8" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#2fd9a8" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="cctv-wave-grad-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="cctv-wave-grad-amber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="540" y2="20" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
          <line x1="0" y1="45" x2="540" y2="45" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
          <line x1="0" y1="70" x2="540" y2="70" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
          <path d="${pathD}" fill="${fillColor}" />
          <path d="${lineD}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="cctv-wave-footer">
          <span>Signal: <strong style="color: ${strokeColor};">100 Hz</strong></span>
          <span>Buffer: <strong style="color: #cbd5e1;">1024 frames</strong></span>
          <span>Drop: <strong style="color: #2fd9a8;">0.00%</strong></span>
        </div>
      </div>
    `;
  };

  const adminSensorCameraView = () => `
    <!-- Top Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Sensor &amp; Camera Management</h1>
      </div>

      <div class="admin-header-actions">
        <!-- Search Feeds -->
        <div class="staff-header-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="staff-header-search-input" placeholder="Filter camera or ID..." value="${escapeHtml(cameraSearchQuery)}" data-cctv-search aria-label="Filter camera feeds">
        </div>

        <!-- Corridor Selector -->
        <select class="admin-select-corridor" data-cctv-filter aria-label="Filter camera corridor">
          <option value="all"${activeCameraCorridorFilter === "all" ? " selected" : ""}>All Corridors (6)</option>
          <option value="trinoma"${activeCameraCorridorFilter === "trinoma" ? " selected" : ""}>Trinoma Hub (2)</option>
          <option value="fleet"${activeCameraCorridorFilter === "fleet" ? " selected" : ""}>Fleet Onboard (2)</option>
          <option value="edsa"${activeCameraCorridorFilter === "edsa" ? " selected" : ""}>EDSA Corridor (1)</option>
          <option value="depot"${activeCameraCorridorFilter === "depot" ? " selected" : ""}>Depot Bays (1)</option>
        </select>

        <!-- Layout Controls -->
        <div class="cctv-layout-switcher" role="group" aria-label="Camera grid layouts">
          <button class="cctv-layout-btn${activeCameraLayout === "3x2" ? " is-active" : ""}" type="button" data-cctv-layout="3x2" title="3x2 Grid View">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="4.5" height="7" rx="1"/><rect x="9.75" y="3" width="4.5" height="7" rx="1"/><rect x="16.5" y="3" width="4.5" height="7" rx="1"/><rect x="3" y="14" width="4.5" height="7" rx="1"/><rect x="9.75" y="14" width="4.5" height="7" rx="1"/><rect x="16.5" y="14" width="4.5" height="7" rx="1"/></svg>
            <span>3×2</span>
          </button>
          <button class="cctv-layout-btn${activeCameraLayout === "2x2" ? " is-active" : ""}" type="button" data-cctv-layout="2x2" title="2x2 Quad View">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="7.5" rx="1"/><rect x="13" y="3" width="8" height="7.5" rx="1"/><rect x="3" y="13.5" width="8" height="7.5" rx="1"/><rect x="13" y="13.5" width="8" height="7.5" rx="1"/></svg>
            <span>2×2</span>
          </button>
          <button class="cctv-layout-btn${activeCameraLayout === "focus" ? " is-active" : ""}" type="button" data-cctv-layout="focus" title="Focus Single Camera View">
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <span>Focus</span>
          </button>
        </div>

        <!-- Feed Settings Popup Button & Dropdown -->
        <div class="cctv-settings-menu-wrap">
          <button class="cctv-btn-settings${cctvSettingsPopupOpen ? " is-active" : ""}" type="button" data-cctv-action="toggle-settings-popup" title="Surveillance Display &amp; AI Settings" aria-expanded="${cctvSettingsPopupOpen}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Feed Settings</span>
          </button>

          ${cctvSettingsPopupOpen ? `
            <div class="cctv-settings-popup" id="cctv-settings-popup" role="dialog" aria-label="Surveillance Feed Options">
              <div class="cctv-popup-header">
                <span class="cctv-popup-title">Feed Display Options</span>
                <button class="cctv-popup-close-btn" type="button" data-cctv-action="close-settings-popup" aria-label="Close settings popup">✕</button>
              </div>

              <div class="cctv-popup-items">
                <!-- AI HUD Toggle Row -->
                <div class="cctv-toggle-row">
                  <div class="cctv-toggle-info">
                    <span class="cctv-toggle-label">AI Object &amp; Passenger HUD</span>
                    <span class="cctv-toggle-desc">Overlay detection boxes &amp; passenger telemetry</span>
                  </div>
                  <button class="admin-toggle-switch${cameraAiDetectionEnabled ? " is-on" : ""}" type="button" data-cctv-toggle="ai" role="switch" aria-checked="${cameraAiDetectionEnabled}" aria-label="Toggle AI Detection HUD">
                    <span class="admin-toggle-thumb"></span>
                  </button>
                </div>

                <!-- CRT Scanlines Toggle Row -->
                <div class="cctv-toggle-row">
                  <div class="cctv-toggle-info">
                    <span class="cctv-toggle-label">CRT Scanline &amp; Reticle FX</span>
                    <span class="cctv-toggle-desc">Simulate optical CCTV phosphor scanlines</span>
                  </div>
                  <button class="admin-toggle-switch${cameraScanlinesEnabled ? " is-on" : ""}" type="button" data-cctv-toggle="scanlines" role="switch" aria-checked="${cameraScanlinesEnabled}" aria-label="Toggle Scanlines">
                    <span class="admin-toggle-thumb"></span>
                  </button>
                </div>

                <!-- Live OSD Bar Toggle Row -->
                <div class="cctv-toggle-row">
                  <div class="cctv-toggle-info">
                    <span class="cctv-toggle-label">Live Telemetry OSD Bar</span>
                    <span class="cctv-toggle-desc">Show bitrate, latency, and uptime tags</span>
                  </div>
                  <button class="admin-toggle-switch${cameraOsdEnabled ? " is-on" : ""}" type="button" data-cctv-toggle="osd" role="switch" aria-checked="${cameraOsdEnabled}" aria-label="Toggle OSD Bar">
                    <span class="admin-toggle-thumb"></span>
                  </button>
                </div>
              </div>
            </div>
          ` : ""}
        </div>

        <!-- Register Camera Button -->
        <button class="staff-btn-add-member" type="button" data-cctv-action="add-device">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add Feed</span>
        </button>
      </div>
    </header>

    <!-- Surveillance Camera Grid Container -->
    <section class="cctv-surveillance-container" id="cctv-grid-container">
      ${renderCameraFeedsGrid()}
    </section>

    <!-- Lower Settings & Telemetry Waveform Console (Matching Design Reference) -->
    <section class="cctv-console-grid">
      <!-- Left: Settings & Hardware Specifications -->
      <div class="cctv-settings-card">
        <div class="cctv-console-card-header">
          <div class="cctv-console-title-group">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span class="cctv-console-title">Settings</span>
          </div>
        </div>

        <div class="cctv-settings-columns">
          <!-- Col 1: General -->
          <div class="cctv-setting-col">
            <h4 class="cctv-col-heading">General</h4>
            <div class="cctv-kv-item">
              <span class="cctv-k">Input latency</span>
              <span class="cctv-v accent">100ms</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">Memory</span>
              <span class="cctv-v">2048mb</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">Uptime</span>
              <span class="cctv-v">99.98%</span>
            </div>
          </div>

          <!-- Col 2: Network -->
          <div class="cctv-setting-col">
            <h4 class="cctv-col-heading">Network</h4>
            <div class="cctv-kv-item">
              <span class="cctv-k">IP status</span>
              <span class="cctv-v">Static</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">Firewall</span>
              <span class="cctv-v green">enabled</span>
            </div>
          </div>

          <!-- Col 3: Time and Date -->
          <div class="cctv-setting-col">
            <h4 class="cctv-col-heading">Time and Date</h4>
            <div class="cctv-kv-item">
              <span class="cctv-k">Time zone</span>
              <span class="cctv-v">+8:00</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">Date Format</span>
              <span class="cctv-v">dd/mm/yy</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">24H</span>
              <span class="cctv-v green">enabled</span>
            </div>
          </div>

          <!-- Col 4: Monitoring Options -->
          <div class="cctv-setting-col">
            <h4 class="cctv-col-heading">Monitoring Options</h4>
            <div class="cctv-kv-item">
              <span class="cctv-k">Refresh Rate</span>
              <span class="cctv-v">100</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">Sensors buffer</span>
              <span class="cctv-v">1024</span>
            </div>
            <div class="cctv-kv-item">
              <span class="cctv-k">View</span>
              <span class="cctv-v">00:19</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Real-time Waveform Monitor -->
      <div class="cctv-waveform-card">
        <div class="cctv-console-card-header">
          <div class="cctv-waveform-tabs">
            <button class="cctv-tab-btn${cameraWaveformTab === "monitor" ? " is-active" : ""}" type="button" data-cctv-waveform-tab="monitor">Monitor</button>
            <button class="cctv-tab-btn${cameraWaveformTab === "ai" ? " is-active" : ""}" type="button" data-cctv-waveform-tab="ai">Run AI</button>
            <button class="cctv-tab-btn${cameraWaveformTab === "debug" ? " is-active" : ""}" type="button" data-cctv-waveform-tab="debug">Debug</button>
          </div>
          <button class="cctv-btn-calibrate" type="button" data-cctv-action="calibrate" title="Calibrate optical &amp; telemetry sensors">
            <span>Calibrate</span>
          </button>
        </div>

        <div id="cctv-waveform-container">
          ${renderSensorTelemetryWaveform()}
        </div>
      </div>
    </section>
  `;

  const adminReportsData = [
    {
      id: "REP-2026-1048",
      title: "Daily Fare Revenue & U-Pouch Reconciliation",
      category: "financial",
      categoryLabel: "Revenue & Finance",
      dateRange: "Oct 20, 2026",
      summaryMetric: "₱148,220.00",
      secondaryMetric: "4,620 Passenger Fares",
      author: "Accounting Bot (Automated)",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "PDF + CSV",
      fileSize: "1.4 MB",
      corridor: "all",
      corridorLabel: "All Corridors",
      details: {
        cashFare: "₱92,400.00 (62.3%)",
        rfidFare: "₱55,820.00 (37.7%)",
        discountsApplied: "₱16,420.00 (Student / Senior / PWD)",
        totalTrips: 142,
        auditorNote: "All physical fare boxes matched digital conductor ticket validator manifests."
      }
    },
    {
      id: "REP-2026-1047",
      title: "Fleet Headway Variance & On-Time Performance",
      category: "otp",
      categoryLabel: "Fleet & Headway",
      dateRange: "Oct 14 - Oct 20, 2026",
      summaryMetric: "93.4% OTP",
      secondaryMetric: "Avg Headway Deviation: +2.1m",
      author: "Dispatch Control (Shift A)",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "PDF",
      fileSize: "2.1 MB",
      corridor: "edsa",
      corridorLabel: "EDSA Carousel Loop",
      details: {
        tripsScheduled: 840,
        tripsCompleted: 836,
        tripsDelayed: 52,
        cancellations: 4,
        auditorNote: "Peak afternoon rain on Oct 18 caused +8m deviation at Guadalupe choke point."
      }
    },
    {
      id: "REP-2026-1046",
      title: "Driver Shift Hours & Safety Compliance Audit",
      category: "crew",
      categoryLabel: "Crew & Personnel",
      dateRange: "Oct 01 - Oct 15, 2026",
      summaryMetric: "1,840 Hours Logged",
      secondaryMetric: "98.8% Rest Rule Compliance",
      author: "Jocky King Cabataña (Admin)",
      status: "Pending Review",
      statusClass: "pending",
      fileFormat: "CSV",
      fileSize: "840 KB",
      corridor: "all",
      corridorLabel: "All Corridors",
      details: {
        activeDrivers: 96,
        overtimeShifts: 14,
        violations: 0,
        safetyIncidents: 0,
        auditorNote: "Shift handover resting periods fully verified against DOTr omnibus guidelines."
      }
    },
    {
      id: "REP-2026-1045",
      title: "Euro V Diesel Consumption & Fleet Fuel Efficiency",
      category: "fuel",
      categoryLabel: "Fuel & Maintenance",
      dateRange: "Oct 01 - Oct 20, 2026",
      summaryMetric: "18,420 Liters",
      secondaryMetric: "3.42 km/L Average Fleet Efficiency",
      author: "Saraza Depot Maintenance Hub",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "PDF + Excel",
      fileSize: "3.6 MB",
      corridor: "malolos",
      corridorLabel: "Malolos - NLEX Trunk",
      details: {
        totalFuelCost: "₱1,259,928.00",
        distanceTraveled: "63,010 km",
        costPerKm: "₱19.99/km",
        coachesUnderMaintenance: 4,
        auditorNote: "Malolos depot bulk fuel dispenser pump calibration certified on Oct 12."
      }
    },
    {
      id: "REP-2026-1044",
      title: "Peak Hour Passenger Surge & Dwell Time Analysis",
      category: "otp",
      categoryLabel: "Fleet & Headway",
      dateRange: "Oct 16 - Oct 19, 2026",
      summaryMetric: "28,450 Commuters",
      secondaryMetric: "Avg Platform Dwell: 1m 45s",
      author: "Predictive Analytics Engine",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "PDF",
      fileSize: "1.8 MB",
      corridor: "trinoma",
      corridorLabel: "Trinoma Hub Platform",
      details: {
        peakWindow: "17:00 - 19:30 PHT",
        maxLoadCorridor: "Trinoma Bay 1 Express (98% capacity)",
        dwellExceedances: 8,
        auditorNote: "Extra 3 standby coaches injected into Trinoma recovered passenger queues within 18 minutes."
      }
    },
    {
      id: "REP-2026-1043",
      title: "Conductor Fare Collection & Cash Discrepancy Log",
      category: "financial",
      categoryLabel: "Revenue & Finance",
      dateRange: "Oct 08 - Oct 14, 2026",
      summaryMetric: "₱0.00 Discrepancy",
      secondaryMetric: "100% Remittance Match",
      author: "Saraza Treasury Office",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "Excel",
      fileSize: "920 KB",
      corridor: "all",
      corridorLabel: "All Corridors",
      details: {
        conductorsAudited: 48,
        inspectedPOSReceipts: 34200,
        unsettledDiscrepancies: "None",
        auditorNote: "All conductor handheld POS validator logs reconciled with Treasury vault deposits."
      }
    }
  ];

  const adminCorridorDistributionData = [
    {
      name: "Trinoma Express Hub",
      revenue: "₱482,400.00",
      pct: 38.6,
      passengers: "54,200 Pax",
      otp: "94.2% OTP",
      barClass: "mint"
    },
    {
      name: "EDSA Carousel Loop",
      revenue: "₱412,650.00",
      pct: 33.0,
      passengers: "48,100 Pax",
      otp: "91.8% OTP",
      barClass: "cyan"
    },
    {
      name: "Malolos Central Loop",
      revenue: "₱218,200.00",
      pct: 17.5,
      passengers: "24,600 Pax",
      otp: "95.1% OTP",
      barClass: "gold"
    },
    {
      name: "C-5 & Quezon Feeder",
      revenue: "₱135,400.00",
      pct: 10.9,
      passengers: "15,980 Pax",
      otp: "93.5% OTP",
      barClass: "purple"
    }
  ];

  const adminScheduledReportsData = [
    {
      id: "SCHED-01",
      title: "Daily Midnight Cash & Fare Reconciliation",
      frequency: "Daily @ 00:00 PHT",
      recipient: "saraza.treasury@usad.ph",
      format: "PDF + CSV",
      lastRun: "Today, 00:00 PHT"
    },
    {
      id: "SCHED-02",
      title: "Weekly Fleet OTP & Headway Audit",
      frequency: "Mondays @ 06:00 PHT",
      recipient: "dispatch.ops@usad.ph",
      format: "PDF",
      lastRun: "Oct 20, 06:00 PHT"
    },
    {
      id: "SCHED-03",
      title: "Monthly DOTr Fuel & Mileage Statement",
      frequency: "1st of Month @ 08:00 PHT",
      recipient: "compliance@dotr.gov.ph",
      format: "Excel",
      lastRun: "Oct 01, 08:00 PHT"
    }
  ];

  const renderReportsTableRows = () => {
    let list = adminReportsData;
    if (activeReportsCategoryFilter !== "all") {
      list = list.filter((r) => r.category === activeReportsCategoryFilter);
    }
    if (activeReportsCorridor !== "all") {
      list = list.filter((r) => r.corridor === "all" || r.corridor === activeReportsCorridor);
    }
    if (reportsSearchQuery.trim()) {
      const q = reportsSearchQuery.toLowerCase().trim();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.categoryLabel.toLowerCase().includes(q) || r.author.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; padding: 28px; color: #64748b;">No operational reports found matching the selected filters.</td></tr>`;
    }

    return list.map((rep) => `
      <tr class="reports-table-row">
        <td>
          <div class="reports-id-cell">
            <span class="reports-id-code">${rep.id}</span>
            <span class="reports-format-tag">${rep.fileFormat}</span>
          </div>
        </td>
        <td>
          <div class="reports-title-cell">
            <strong class="reports-item-title">${escapeHtml(rep.title)}</strong>
            <span class="reports-item-corridor">${rep.corridorLabel}</span>
          </div>
        </td>
        <td>
          <span class="reports-cat-tag ${rep.category}">${rep.categoryLabel}</span>
        </td>
        <td>
          <span class="reports-period-text">${rep.dateRange}</span>
        </td>
        <td>
          <div class="reports-metric-cell">
            <span class="reports-metric-primary">${rep.summaryMetric}</span>
            <span class="reports-metric-secondary">${rep.secondaryMetric}</span>
          </div>
        </td>
        <td>
          <span class="reports-status-pill ${rep.statusClass}"><span class="status-dot"></span>${rep.status}</span>
        </td>
        <td>
          <div class="reports-row-actions">
            <button class="reports-btn-view" type="button" data-report-action="view" data-report-id="${rep.id}" title="Inspect full audit ledger">View</button>
            <button class="reports-btn-download" type="button" data-report-action="download" data-report-id="${rep.id}" title="Download report file">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 12px; height: 12px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  };

  const renderReportsCorridorDistribution = () => {
    return adminCorridorDistributionData.map((cor) => `
      <div class="corridor-dist-row">
        <div class="corridor-dist-header">
          <div class="corridor-dist-title-wrap">
            <span class="corridor-dist-dot ${cor.barClass}"></span>
            <span class="corridor-dist-name">${cor.name}</span>
          </div>
          <div class="corridor-dist-figures">
            <strong class="corridor-dist-rev">${cor.revenue}</strong>
            <span class="corridor-dist-pct">(${cor.pct}%)</span>
          </div>
        </div>
        <div class="corridor-dist-bar-track">
          <div class="corridor-dist-bar-fill ${cor.barClass}" style="width: ${cor.pct}%;"></div>
        </div>
        <div class="corridor-dist-footer">
          <span>${cor.passengers}</span>
          <span>${cor.otp}</span>
        </div>
      </div>
    `).join("");
  };

  const renderReportsScheduledAutomations = () => {
    return adminScheduledReportsData.map((sched) => `
      <div class="sched-report-item">
        <div class="sched-report-info">
          <strong class="sched-report-title">${sched.title}</strong>
          <div class="sched-report-meta">
            <span>Frequency: <strong>${sched.frequency}</strong></span>
            <span>·</span>
            <span>Target: <strong>${sched.recipient}</strong></span>
          </div>
        </div>
        <div class="sched-report-actions">
          <span class="reports-format-tag">${sched.format}</span>
          <button class="sched-run-btn" type="button" data-report-action="run-scheduled" data-sched-id="${sched.id}" title="Trigger instant generation &amp; dispatch">Run Now</button>
        </div>
      </div>
    `).join("");
  };

  const adminReportsView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Operational Reports &amp; Audits</h1>
      </div>

      <div class="admin-header-actions">
        <!-- Date Range Filter -->
        <select class="admin-select-corridor" data-report-date-range aria-label="Select Report Period">
          <option value="month"${activeReportsDateRange === "month" ? " selected" : ""}>Month to Date (Oct 2026)</option>
          <option value="today"${activeReportsDateRange === "today" ? " selected" : ""}>Today (Oct 21, 2026)</option>
          <option value="week"${activeReportsDateRange === "week" ? " selected" : ""}>This Week (Oct 15 - 21)</option>
          <option value="last-month"${activeReportsDateRange === "last-month" ? " selected" : ""}>Last Month (September 2026)</option>
          <option value="q3"${activeReportsDateRange === "q3" ? " selected" : ""}>Q3 2026 Financial Audit</option>
        </select>

        <!-- Corridor Filter -->
        <select class="admin-select-corridor" data-report-corridor aria-label="Select Operational Corridor">
          <option value="all"${activeReportsCorridor === "all" ? " selected" : ""}>All Corridors (4)</option>
          <option value="trinoma"${activeReportsCorridor === "trinoma" ? " selected" : ""}>Trinoma Hub Express</option>
          <option value="edsa"${activeReportsCorridor === "edsa" ? " selected" : ""}>EDSA Carousel Loop</option>
          <option value="malolos"${activeReportsCorridor === "malolos" ? " selected" : ""}>Malolos Central Loop</option>
          <option value="c5"${activeReportsCorridor === "c5" ? " selected" : ""}>C-5 &amp; Quezon Feeder</option>
        </select>

        <!-- Generate Custom Report Button -->
        <button class="staff-btn-add-member" type="button" data-report-action="generate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 13px; height: 13px;">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Generate Report</span>
        </button>
      </div>
    </header>

    <!-- 4 Bento KPI Cards -->
    <section class="reports-kpi-grid" aria-label="Executive Operational Totals">
      <!-- 1. Total Fare Revenue -->
      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Total fare revenue (MTD)</span>
          <span class="reports-growth-badge positive">+6.8% vs last mo</span>
        </div>
        <div class="reports-kpi-figure">₱1,248,650.00</div>
        <div class="reports-kpi-sub">Cash: <strong>₱784,400</strong> · U-Pouch RFID: <strong>₱464,250</strong></div>
      </article>

      <!-- 2. Passenger Volume -->
      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Total passengers (MTD)</span>
          <span class="reports-growth-badge positive">92.4% Load</span>
        </div>
        <div class="reports-kpi-figure">142,880 Pax</div>
        <div class="reports-kpi-sub">Avg 4,760 pax/day · <strong>31,420</strong> Concession/Student Fares</div>
      </article>

      <!-- 3. Fleet On-Time Performance -->
      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Fleet on-time rate</span>
          <span class="reports-growth-badge target">Target: 90.0%</span>
        </div>
        <div class="reports-kpi-figure accent">92.8% OTP</div>
        <div class="reports-kpi-sub">2,184 Trips Dispatched · Avg delay: <strong>+2.1m</strong></div>
      </article>

      <!-- 4. Fuel & Operating Mileage -->
      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Fuel &amp; operating mileage</span>
          <span class="reports-growth-badge neutral">18,420 L Diesel</span>
        </div>
        <div class="reports-kpi-figure">63,010 km</div>
        <div class="reports-kpi-sub">3.42 km/L Fleet Efficiency · Cost: <strong>₱19.99/km</strong></div>
      </article>
    </section>

    <!-- Main Reports Hub & Table Card -->
    <section class="reports-table-card">
      <div class="reports-table-toolbar">
        <!-- Category Filter Tabs -->
        <div class="reports-filter-tabs" role="tablist" aria-label="Filter reports by domain">
          <button class="reports-tab-btn${activeReportsCategoryFilter === "all" ? " is-active" : ""}" type="button" data-report-category="all">All Reports (6)</button>
          <button class="reports-tab-btn${activeReportsCategoryFilter === "financial" ? " is-active" : ""}" type="button" data-report-category="financial">Revenue &amp; Finance (2)</button>
          <button class="reports-tab-btn${activeReportsCategoryFilter === "otp" ? " is-active" : ""}" type="button" data-report-category="otp">Fleet &amp; Headway (2)</button>
          <button class="reports-tab-btn${activeReportsCategoryFilter === "crew" ? " is-active" : ""}" type="button" data-report-category="crew">Crew &amp; Personnel (1)</button>
          <button class="reports-tab-btn${activeReportsCategoryFilter === "fuel" ? " is-active" : ""}" type="button" data-report-category="fuel">Fuel &amp; Maintenance (1)</button>
        </div>

        <!-- Search Bar -->
        <div class="staff-header-search-wrap" style="width: 260px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="staff-header-search-input" placeholder="Search reports, audit IDs..." value="${escapeHtml(reportsSearchQuery)}" data-report-search aria-label="Search reports directory">
        </div>
      </div>

      <!-- Table Container -->
      <div class="reports-table-wrap">
        <table class="reports-table">
          <thead>
            <tr>
              <th>REPORT ID &amp; FORMAT</th>
              <th>REPORT TITLE &amp; CORRIDOR</th>
              <th>CATEGORY</th>
              <th>AUDIT PERIOD</th>
              <th>PRIMARY METRICS</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody id="reports-table-tbody">
            ${renderReportsTableRows()}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Lower 2-Column Split: Corridor Performance & Automated Runs -->
    <div class="reports-bottom-split">
      <!-- Left: Corridor Distribution Breakdown -->
      <section class="reports-subcard">
        <div class="reports-subcard-header">
          <div class="reports-subcard-title-group">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: #2fd9a8;"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            <h2 class="reports-subcard-title">Corridor Revenue &amp; Ridership Share</h2>
          </div>
          <span style="font-size: 11px; color: #64748b;">Month to Date (Oct 2026)</span>
        </div>

        <div class="corridor-dist-list">
          ${renderReportsCorridorDistribution()}
        </div>
      </section>

      <!-- Right: Scheduled Automated Audits & Deliveries -->
      <section class="reports-subcard">
        <div class="reports-subcard-header">
          <div class="reports-subcard-title-group">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: #2fd9a8;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h2 class="reports-subcard-title">Scheduled Audit Dispatches</h2>
          </div>
          <span style="font-size: 11px; color: #64748b;">3 Standing Automated Runs</span>
        </div>

        <div class="sched-reports-list">
          ${renderReportsScheduledAutomations()}
        </div>
      </section>
    </div>
  `;

  const adminDashboardScreen = () => `
    <div class="admin-dashboard-layout" data-admin-screen="dashboard">
      <!-- Left Sidebar -->
      <aside class="admin-sidebar">
        <div>
          <div class="admin-sidebar-brand">
            <div class="admin-sidebar-brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 10v2.5a5 5 0 0 0 10 0V10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
                <path d="M12 3.5v9m0-9-3 3m3-3 3 3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="admin-sidebar-brand-text">USAD</span>
          </div>

          <nav class="admin-nav" aria-label="Operations Navigation">
            <button class="admin-nav-item${activeAdminSidebarTab === "live-operations" ? " is-active" : ""}" type="button" data-admin-nav="live-operations">
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
              <span>Live Operations</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "predictive-analytics" ? " is-active" : ""}" type="button" data-admin-nav="predictive-analytics">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
              <span>Predictive Analytics</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "fleet-dispatch" ? " is-active" : ""}" type="button" data-admin-nav="fleet-dispatch">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Fleet Monitoring and Dispatch</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "staff-resources" ? " is-active" : ""}" type="button" data-admin-nav="staff-resources">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Staff &amp; Resources</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "sensor-camera" ? " is-active" : ""}" type="button" data-admin-nav="sensor-camera">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <span>Sensor &amp; Camera Management</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "reports" ? " is-active" : ""}" type="button" data-admin-nav="reports">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Reports</span>
            </button>
          </nav>
        </div>

        <button class="admin-sidebar-user" type="button" data-admin-action="user-menu" title="Click to view administrator profile or sign out">
          <div class="admin-user-avatar">JC</div>
          <div class="admin-user-details">
            <span class="admin-user-name">Jocky King Cabataña</span>
            <span class="admin-user-role">Administrator</span>
          </div>
          <svg class="admin-user-logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </aside>

      <!-- Main Operational Area -->
      <main class="admin-main-container">
        ${activeAdminSidebarTab === "predictive-analytics"
      ? adminPredictiveAnalyticsView()
      : activeAdminSidebarTab === "fleet-dispatch"
        ? adminFleetDispatchView()
        : activeAdminSidebarTab === "staff-resources"
          ? adminStaffResourcesView()
          : activeAdminSidebarTab === "sensor-camera"
            ? adminSensorCameraView()
            : activeAdminSidebarTab === "reports"
              ? adminReportsView()
              : adminLiveOperationsView()}
      </main>
    </div>`;

  const openAdminModal = (type) => {
    const existing = screen.querySelector(".admin-modal-backdrop");
    if (existing) existing.remove();
    const modal = document.createElement("div");
    modal.className = "admin-modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    let icon = fingerprintIcon;
    let title = "Biometric Verification";
    let desc = "Place administrator finger on hardware biometric scanner to authenticate.";
    let primaryBtn = "Simulate Scan &amp; Login";
    let isInfoOnly = false;
    let customHtml = "";

    if (type === "smartcard") {
      icon = idCardIcon;
      title = "Staff RFID / Smart Badge";
      desc = "Hold Saraza TRD Operations NFC Badge (#SRZ-ADM-042) near the reader.";
      primaryBtn = "Simulate Badge Tap &amp; Login";
    } else if (type === "key") {
      icon = fingerprintIcon;
      title = "Secondary Biometric Scanner";
      desc = "Touch secondary biometric sensor or insert hardware security key.";
      primaryBtn = "Simulate Scan &amp; Login";
    } else if (type === "forgot-password") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`;
      title = "Administrator Password Assistance";
      desc = "For regulatory and operational security, administrator passwords cannot be reset online.<br><br>Please contact the <strong>Saraza TRD Systems Administrator</strong> or your <strong>Operations Supervisor</strong> to reissue your credentials.";
      primaryBtn = "Understood";
      isInfoOnly = true;
    } else if (type === "user-menu") {
      icon = `<div class="admin-user-avatar admin-user-avatar-modal">JC</div>`;
      title = "Jocky King Cabataña";
      desc = `<span class="admin-profile-badge">Active · Super Administrator</span>`;
      customHtml = `
        <div class="admin-profile-details">
          <div class="admin-profile-row">
            <span class="admin-profile-label">Administrator ID</span>
            <span class="admin-profile-value">SRZ-ADM-042</span>
          </div>
          <div class="admin-profile-row">
            <span class="admin-profile-label">Assigned Station</span>
            <span class="admin-profile-value">Saraza Central Operations Control</span>
          </div>
          <div class="admin-profile-row">
            <span class="admin-profile-label">System Privileges</span>
            <span class="admin-profile-value">Telemetry, Fleet Dispatch, Scheduling</span>
          </div>
          <div class="admin-profile-row">
            <span class="admin-profile-label">Security Clearance</span>
            <span class="admin-profile-value" style="color: #2FD9A8;">Biometric &amp; Smartcard Verified</span>
          </div>
        </div>
        <div class="admin-modal-actions" style="margin-top: 18px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Stay Signed In</button>
          <button class="admin-signout-btn" type="button" data-admin-action="sign-out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type === "assign-dispatch") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A2 2 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;
      title = "Assign Vehicle Dispatch";
      desc = "Assign a ready driver and route corridor to activate live telematics.";
      customHtml = `
        <form class="admin-login-form" data-admin-assign-form style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Select Vehicle</label>
            <select class="admin-input" id="assign-bus" style="height: 40px;">
              <option value="Bus 01">Bus 01 (MLS-042) - Ready</option>
              <option value="Bus 02">Bus 02 (MLS-018) - On Break</option>
              <option value="Bus 03">Bus 03 (MLS-105) - Reserve</option>
              <option value="Bus 04">Bus 04 (TRN-009) - Ready</option>
            </select>
          </div>
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assign Driver</label>
            <input class="admin-input" id="assign-driver" value="Jocky King Garcia" placeholder="Enter driver name" style="height: 40px;">
          </div>
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Corridor Route</label>
            <select class="admin-input" id="assign-route" style="height: 40px;">
              <option value="Trinoma Express">Trinoma Express Corridor</option>
              <option value="Trinoma Feeder">Trinoma Feeder Line</option>
              <option value="Malolos Central">Malolos Central Loop</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Confirm Dispatch</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("telemetry-")) {
      const busId = type.replace("telemetry-", "");
      const bus = adminFleetData.find((b) => b.id === busId) ?? adminFleetData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
      title = `Live Telemetry — ${bus.busNo}`;
      desc = `Vehicle Telematics Active · Route: <strong>${bus.route}</strong><br>Driver: <strong>${bus.driver}</strong>`;
      customHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; text-align: left; font-size: 11.5px;">
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838;">
            <span style="color: #64748b; display: block; font-size: 10px;">CURRENT SPEED</span>
            <strong style="color: #2FD9A8; font-size: 15px;">${bus.telemetry.speed}</strong>
          </div>
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838;">
            <span style="color: #64748b; display: block; font-size: 10px;">FUEL LEVEL</span>
            <strong style="color: #38bdf8; font-size: 15px;">${bus.telemetry.fuel}</strong>
          </div>
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838;">
            <span style="color: #64748b; display: block; font-size: 10px;">TIRE PRESSURE</span>
            <strong style="color: #cbd5e1; font-size: 14px;">${bus.telemetry.tire}</strong>
          </div>
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838;">
            <span style="color: #64748b; display: block; font-size: 10px;">ENGINE TEMP</span>
            <strong style="color: #cbd5e1; font-size: 14px;">${bus.telemetry.temp}</strong>
          </div>
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838; grid-column: span 2;">
            <span style="color: #64748b; display: block; font-size: 10px;">GPS TELEMATICS LOCATION</span>
            <span style="color: #ffffff; font-size: 12px;">${bus.telemetry.gps}</span>
          </div>
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838; grid-column: span 2;">
            <span style="color: #64748b; display: block; font-size: 10px;">PASSENGER ONBOARD LOAD</span>
            <strong style="color: #2FD9A8; font-size: 13px;">${bus.telemetry.passengers} Seats Occupied</strong>
          </div>
        </div>
        <button class="admin-modal-button-secondary" type="button" style="width: 100%;" data-admin-modal-close>Close Telemetry Feed</button>
      `;
      isInfoOnly = true;
    } else if (type === "export-surge") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
      title = "Export Surge Report (PDF / CSV)";
      desc = "Compiling 24-hour predictive transit surge analysis for <strong>Route 1: Trinoma Express</strong>.<br><br>Peak Volume: <strong>1,190 commuters/hr</strong><br>Monsoon Impact: <strong>+35% dwell surge</strong><br>Forecast Model Convergence: <strong>96.4%</strong>";
      primaryBtn = "Download Operations Report";
      isInfoOnly = true;
    } else if (type === "approve-redistribution") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      title = "Fleet Redistribution Approved";
      desc = "AI dispatch plan has been transmitted to operations control:<br><br>• <strong>+3 standby buses</strong> dispatched to Route 1 (Trinoma)<br>• Evening headway compressed from <strong>12m → 5m</strong><br>• <strong>2 standby coaches</strong> borrowed from Malolos Feeder";
      primaryBtn = "Done";
      isInfoOnly = true;
    } else if (type === "simulate-surge") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>`;
      title = "Monte Carlo Surge Simulation";
      desc = "Model executed with 1,000 synthetic commuter agents.<br><br>Result: <strong>-42% Projected Queue Wait Time</strong> across Trinoma &amp; Cubao transit shelters with 98.4% system reliability.";
      primaryBtn = "Close Simulation";
      isInfoOnly = true;
    } else if (type.startsWith("dispatch-order-sent-")) {
      const busId = type.replace("dispatch-order-sent-", "");
      const bus = fleetDispatchTelemetryUnits.find((u) => u.id === busId) || fleetDispatchTelemetryUnits[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
      title = `Dispatch Order Transmitted — Unit #${bus.busNo}`;
      desc = `Telemetry order dispatched to <strong>Bus No. ${bus.busNo} (${bus.tripName})</strong>.<br><br>Assigned Driver: <strong>${bus.driverName}</strong><br>Conductor: <strong>${bus.conductorName}</strong><br>Corridor: <strong>${bus.routeCorridor}</strong><br><br>Status: <strong>Order acknowledged by onboard vehicle telematics unit via LTE-M handshake.</strong>`;
      primaryBtn = "Acknowledge & Close";
      isInfoOnly = true;
    } else if (type.startsWith("assign-driver-unit-")) {
      const busId = type.replace("assign-driver-unit-", "");
      const bus = fleetDispatchTelemetryUnits.find((u) => u.id === busId) || fleetDispatchTelemetryUnits[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></svg>`;
      title = `Reassign Crew — Unit #${bus.busNo}`;
      desc = `Update active duty crew assigned to <strong>${bus.tripName}</strong>.`;
      customHtml = `
        <form class="admin-login-form" data-admin-reassign-form style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assigned Driver</label>
            <input class="admin-input" id="reassign-driver-input" value="${escapeHtml(bus.driverName)}" style="height: 38px;">
          </div>
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assigned Conductor</label>
            <input class="admin-input" id="reassign-conductor-input" value="${escapeHtml(bus.conductorName)}" style="height: 38px;">
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="button" data-admin-confirm-crew="${bus.id}">Update Assignment</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type === "add-staff") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      title = "Add Staff Member";
      desc = "Enroll new operational personnel into Saraza TRD transit roster.";
      customHtml = `
        <form class="admin-login-form" data-admin-add-staff-form style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Full Name</label>
            <input class="admin-input" id="new-staff-name" placeholder="e.g. Maria Santos" required style="height: 38px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Role</label>
              <select class="admin-input" id="new-staff-role" style="height: 38px;">
                <option value="Driver">Driver</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Depot</label>
              <select class="admin-input" id="new-staff-depot" style="height: 38px;">
                <option value="Trinoma Hub">Trinoma Hub</option>
                <option value="Malolos Hub">Malolos Hub</option>
                <option value="Balintawak Staging">Balintawak Staging</option>
              </select>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assigned Bus</label>
              <input class="admin-input" id="new-staff-bus" placeholder="e.g. 07 or -" value="07" style="height: 38px;">
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Hourly Rate</label>
              <input class="admin-input" id="new-staff-rate" placeholder="$4.50" value="$4.50" style="height: 38px;">
            </div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Enroll Member</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type === "export-staff-csv") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
      title = "Staff Roster Exported";
      desc = "Generated <strong>usad_staff_roster_2026.csv</strong> containing all 148 registered transport personnel, GPS telematic IDs, active duty hours, and depot assignments.";
      primaryBtn = "Done";
      isInfoOnly = true;
    } else if (type.startsWith("staff-detail-")) {
      const staffId = type.replace("staff-detail-", "");
      const staff = adminStaffMembersData.find((s) => s.id === staffId) || adminStaffMembersData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`;
      title = `${staff.name} (${staff.staffId})`;
      desc = `Role: <strong>${staff.role}</strong><br>Depot: <strong>${staff.depot}</strong> · Bus Assigned: <strong>${staff.busNo}</strong><br>Rate: <strong>${staff.rate}/hr</strong> (Max: ${staff.maxHours})<br>Duty Status: <strong>${staff.status}</strong>`;
      customHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button class="admin-modal-button-primary" type="button" data-staff-quick-status="${staff.id}">
            Toggle Shift Status (${staff.status === "On Duty" ? "Set On Break" : "Set On Duty"})
          </button>
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Close</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("cctv-snapshot-")) {
      const camId = type.replace("cctv-snapshot-", "");
      const cam = adminCameraFeedsData.find((c) => c.id === camId) || adminCameraFeedsData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
      title = `Snapshot Saved — ${cam.code}`;
      desc = `Full-resolution 1080p frame captured with cryptographic timecode.<br>Feed: <strong>${cam.title}</strong> · Corridor: <strong>${cam.corridorLabel}</strong>`;
      customHtml = `
        <div style="margin: 14px 0; border-radius: 8px; overflow: hidden; border: 1px solid #1e2838; position: relative;">
          <img src="${cam.image}" alt="${cam.title}" style="width: 100%; height: 180px; object-fit: cover; display: block;">
          <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1; background: rgba(10,15,22,0.85); padding: 4px 8px; border-radius: 4px;">
            <span>${cam.code} • 1920x1080 @ 60fps</span>
            <span style="color: #2fd9a8;">SHA256: 8a4f...91c0</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Close</button>
          <button class="admin-modal-button-primary" type="button" data-admin-modal-close>Download High-Res (PNG)</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("cctv-ptz-")) {
      const camId = type.replace("cctv-ptz-", "");
      const cam = adminCameraFeedsData.find((c) => c.id === camId) || adminCameraFeedsData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>`;
      title = `PTZ Diagnostics — ${cam.code}`;
      desc = `Remote motorized optical control for <strong>${cam.title}</strong>.`;
      customHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; text-align: left;">
          <div style="background: #0f1622; padding: 12px; border-radius: 8px; border: 1px solid #1e2838; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;">
            <span style="font-size: 10px; color: #64748b; font-weight: 700;">PAN / TILT MOTOR</span>
            <div style="display: grid; grid-template-columns: repeat(3, 32px); gap: 4px; margin-top: 4px;">
              <div></div>
              <button class="cctv-ptz-pad-btn" type="button" data-cctv-ptz-dir="up" title="Tilt Up">▲</button>
              <div></div>
              <button class="cctv-ptz-pad-btn" type="button" data-cctv-ptz-dir="left" title="Pan Left">◀</button>
              <div style="display:grid; place-items:center; font-size:9px; color:#2fd9a8;">PTZ</div>
              <button class="cctv-ptz-pad-btn" type="button" data-cctv-ptz-dir="right" title="Pan Right">▶</button>
              <div></div>
              <button class="cctv-ptz-pad-btn" type="button" data-cctv-ptz-dir="down" title="Tilt Down">▼</button>
              <div></div>
            </div>
          </div>

          <div style="background: #0f1622; padding: 12px; border-radius: 8px; border: 1px solid #1e2838; font-size: 11px; display: flex; flex-direction: column; gap: 6px;">
            <div><span style="color:#64748b;">Sensor Temp:</span> <strong style="color:#ffffff;">${cam.temp}</strong></div>
            <div><span style="color:#64748b;">Bitrate:</span> <strong style="color:#2fd9a8;">${cam.bitrate}</strong></div>
            <div><span style="color:#64748b;">Latency:</span> <strong style="color:#38bdf8;">${cam.latency}</strong></div>
            <div><span style="color:#64748b;">Firmware:</span> <strong style="color:#cbd5e1;">v4.18.2-rtsp</strong></div>
            <div><span style="color:#64748b;">IR Night Mode:</span> <strong style="color:#2fd9a8;">Auto-Sens</strong></div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Close Diagnostics</button>
          <button class="admin-modal-button-primary" type="button" data-admin-modal-close>Recalibrate Optics</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type === "cctv-calibrate") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      title = "Sensor Calibration";
      desc = "Optical alignment and telematics diagnostics completed for all active camera feeds.";
      primaryBtn = "Done";
      isInfoOnly = true;
    } else if (type === "cctv-add-device") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      title = "Register Surveillance Feed";
      desc = "Enroll a new RTSP / WebRTC camera unit or telemetry sensor hub into USAD mesh.";
      customHtml = `
        <form class="admin-login-form" data-cctv-add-feed-form style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Camera Identifier / Name</label>
            <input class="admin-input" id="new-cam-title" placeholder="e.g. CAM 9.1/ws — Balintawak South Gate" required style="height: 38px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Corridor Zone</label>
              <select class="admin-input" id="new-cam-corridor" style="height: 38px;">
                <option value="trinoma">Trinoma Hub</option>
                <option value="fleet">Fleet Onboard</option>
                <option value="edsa">EDSA Corridor</option>
                <option value="depot">Depot Bays</option>
              </select>
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Stream Protocol</label>
              <select class="admin-input" id="new-cam-protocol" style="height: 38px;">
                <option value="webrtc">WebRTC (Ultra Low Latency)</option>
                <option value="rtsp">RTSP over TLS</option>
              </select>
            </div>
          </div>
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">RTSP URL / Static IP</label>
            <input class="admin-input" id="new-cam-ip" placeholder="rtsp://10.24.0.42:554/live/feed" value="rtsp://10.24.0.42:554/live/feed" style="height: 38px;">
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Connect &amp; Stream</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type === "generate-report") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`;
      title = "Generate Operational Report";
      desc = "Compile audited ridership revenue, headway compliance, or vehicle maintenance records.";
      customHtml = `
        <form class="admin-login-form" data-admin-generate-report-form style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Report Title</label>
            <input class="admin-input" id="rep-gen-title" placeholder="e.g. Peak Surge &amp; RFID Revenue Audit" value="Mid-Month Fleet &amp; Fare Reconciliation" required style="height: 38px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Audit Category</label>
              <select class="admin-input" id="rep-gen-category" style="height: 38px;">
                <option value="financial">Revenue &amp; Finance</option>
                <option value="otp">Fleet &amp; Headway</option>
                <option value="crew">Crew &amp; Personnel</option>
                <option value="fuel">Fuel &amp; Maintenance</option>
              </select>
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Corridor Scope</label>
              <select class="admin-input" id="rep-gen-corridor" style="height: 38px;">
                <option value="All Corridors">All Corridors (4)</option>
                <option value="Trinoma Express">Trinoma Hub Express</option>
                <option value="EDSA Carousel">EDSA Carousel Loop</option>
                <option value="Malolos Central">Malolos Central Loop</option>
                <option value="C-5 &amp; Quezon">C-5 &amp; Quezon Feeder</option>
              </select>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Timeframe</label>
              <select class="admin-input" id="rep-gen-period" style="height: 38px;">
                <option value="Month to Date">Month to Date (Oct 2026)</option>
                <option value="Past 7 Days">Past 7 Days</option>
                <option value="Today">Today (Oct 21, 2026)</option>
                <option value="Q3 2026">Q3 2026 Full Quarter</option>
              </select>
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Export Format</label>
              <select class="admin-input" id="rep-gen-format" style="height: 38px;">
                <option value="PDF">PDF (Formal Signed Audit)</option>
                <option value="CSV">CSV (Raw Telematics Ledger)</option>
                <option value="XLSX">XLSX (Financial Spreadsheet)</option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 14px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Compile &amp; Archive</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("view-report-")) {
      const repId = type.replace("view-report-", "");
      const report = adminReportsData.find((r) => r.id === repId) || adminReportsData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
      title = `${report.id}: ${report.title}`;
      desc = `Official transit operational audit for <strong>${report.corridor}</strong>.`;
      customHtml = `
        <div style="background: #0b1017; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin: 16px 0; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
            <span style="color: #64748b;">Audit Period:</span>
            <strong style="color: #ffffff;">${report.period}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
            <span style="color: #64748b;">Primary Metric:</span>
            <strong style="color: #2fd9a8;">${report.primaryMetric}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
            <span style="color: #64748b;">Secondary Metric:</span>
            <span style="color: #cbd5e1;">${report.secondaryMetric}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
            <span style="color: #64748b;">Format &amp; File Size:</span>
            <strong style="color: #38bdf8;">${report.format} (${report.fileSize})</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
            <span style="color: #64748b;">Verified By:</span>
            <span style="color: #e2e8f0;">${report.author}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Audit Status:</span>
            <span style="color: ${report.status === "Finalized" ? "#2fd9a8" : report.status === "Pending Sign-off" ? "#fbbf24" : "#94a3b8"}; font-weight: 700;">${report.status}</span>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Close</button>
          <button class="admin-modal-button-primary" type="button" data-report-action="download" data-report-id="${report.id}">Download ${report.format}</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("download-report-")) {
      const repId = type.replace("download-report-", "");
      const report = adminReportsData.find((r) => r.id === repId) || adminReportsData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
      title = `Downloading ${report.id}.${report.format.toLowerCase()}`;
      desc = `Exporting <strong>${report.title}</strong> (${report.fileSize}). Data signed by Saraza TRD Central Control.`;
      primaryBtn = "Done";
      isInfoOnly = true;
    } else if (type.startsWith("run-scheduled-")) {
      const schedId = type.replace("run-scheduled-", "");
      const sched = adminScheduledReportsData.find((s) => s.id === schedId) || adminScheduledReportsData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      title = "Audit Job Dispatched";
      desc = `Instant extraction queued for <strong>${sched.title}</strong>.<br><br>The generated ${sched.format} audit has been packaged and transmitted to <strong>${sched.recipient}</strong>.`;
      primaryBtn = "Dismiss";
      isInfoOnly = true;
    }

    modal.innerHTML = `
      <div class="admin-modal-box">
        <div class="admin-modal-icon-wrapper">
          <div class="admin-pulse-ring"></div>
          ${icon}
        </div>
        <h3 class="admin-modal-title">${title}</h3>
        <p class="admin-modal-desc">${desc}</p>
        ${customHtml || `
          <div class="admin-modal-actions">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="button" ${isInfoOnly ? "data-admin-modal-close" : "data-admin-modal-auth"}>${primaryBtn}</button>
          </div>
        `}
      </div>
    `;

    screen.append(modal);
    modal.querySelector(".admin-modal-button-primary, .admin-modal-button-secondary")?.focus();
  };

  const loginScreen = (showError = false) => `
    <div class="auth-content">
      <div class="auth-brand">
        ${mark}
        <h2>Introducing, <span>USAD</span></h2>
      </div>
      <form class="login-form${showError ? " is-error" : ""}" data-login-form novalidate>
        ${showError ? '<p class="form-alert" role="alert" tabindex="-1">Invalid Email or Password</p>' : ""}
        <div class="form-field">
          <label for="login-email">Email</label>
          <input id="login-email" name="email" type="email" placeholder="Enter Email/username" autocomplete="email" aria-describedby="email-error"${showError ? ' aria-invalid="true"' : ""}>
          <span class="field-error" id="email-error" role="alert" hidden>Enter a valid email address.</span>
        </div>
        <div class="form-field">
          <label for="login-password">Password</label>
          <input id="login-password" name="password" type="password" placeholder="Enter password" autocomplete="current-password"${showError ? ' aria-invalid="true"' : ""}>
          <span class="field-error" id="login-password-error" role="alert" hidden>Password is required.</span>
        </div>
        <button class="text-link forgot-link" type="button" data-info="Password recovery is not connected in this prototype.">Forgot password?</button>
        <button class="login-button" type="submit">Login</button>
        <div class="social-divider"><span></span><span>or</span><span></span></div>
        ${socialButtons}
        <p class="register-copy">Don't have an account? <button class="text-link" type="button" data-screen="register">Register now</button></p>
        ${showError ? '<button class="text-link service-link" type="button" data-screen="backend-error">Having trouble? View service status</button>' : ""}
        <p class="interaction-message" data-message role="status" aria-live="polite"></p>
      </form>
    </div>
    <div class="auth-helper-bar">
      <button class="auth-helper-chip" type="button" data-mobile-action="autofill-demo" title="Auto-fill with commuter demo account">Auto-fill Demo Account</button>
      <button class="auth-helper-chip" type="button" data-mobile-action="toggle-error" title="Toggle error alert banner">${showError ? "Hide Error Banner" : "Show Error Banner"}</button>
    </div>`;

  const backendErrorScreen = () => `
    <div class="backend-content">
      <img class="backend-illustration" src="assets/3d-images/connection-error.png" alt="" draggable="false">
      <h2>There seems to be an error on our end</h2>
      <p>No worries, we are certain that this will get fixed soon,<br>we apologize for any inconveniences caused.</p>
      <div class="backend-links">
        <button type="button" class="text-link secondary-link" data-info="This prototype does not connect to a live service.">Learn why this happens</button>
        <button type="button" class="text-link" data-info="Frequently asked questions are not connected in this prototype.">FAQ</button>
      </div>
      <p class="interaction-message" data-message role="status" aria-live="polite"></p>
      <button class="back-to-login" type="button" data-screen="login">Back to login</button>
    </div>`;

  const registerScreen = (showError = false, showTermsError = false) => `
    <div class="auth-content register-content">
      <div class="auth-stack">
        <h2 class="screen-title">Sign up</h2>
      </div>
      <form class="register-form${showError ? " is-error" : ""}" data-register-form novalidate>
        ${showError ? '<p class="form-alert" role="alert" tabindex="-1">Please review the highlighted fields.</p>' : ""}
        <div class="form-field">
          <label for="register-username">Username</label>
          <input id="register-username" name="username" type="text" placeholder="JockyKing" autocomplete="username"${showError ? ' aria-invalid="true"' : ""}>
          <span class="field-error" id="register-username-error" role="alert" hidden>Username is required.</span>
        </div>
        <div class="form-field">
          <label for="register-email">Email</label>
          <input id="register-email" name="email" type="email" placeholder="jockypottingli@edu.ph" autocomplete="email"${showError ? ' aria-invalid="true"' : ""}>
          <span class="field-error" id="register-email-error" role="alert" hidden>Please enter a valid email address.</span>
        </div>
        <div class="form-field">
          <label for="register-password">Password</label>
          <input id="register-password" name="password" type="password" placeholder="••••••••" autocomplete="new-password"${showError ? ' aria-invalid="true"' : ""}>
          <span class="field-error" id="register-password-error" role="alert" hidden>Include at least one number or special character.</span>
        </div>
        <div class="form-field">
          <label for="register-confirm-password">Confirm Password</label>
          <input id="register-confirm-password" name="confirmPassword" type="password" placeholder="••••••••" autocomplete="new-password"${showError ? ' aria-invalid="true"' : ""}>
          <span class="field-error" id="register-confirm-password-error" role="alert" hidden>Passwords do not match.</span>
        </div>
        <div class="terms-consent">
          <input id="terms-accepted" name="termsAccepted" type="checkbox" required aria-label="I agree to the Terms of Service and Privacy Policy" aria-describedby="terms-error"${showTermsError ? ' aria-invalid="true"' : ""}>
          <p class="terms-copy"><label for="terms-accepted">By signing up, you agree to our</label> <button class="text-link" type="button" data-info="Terms and policy are not connected in this prototype.">Terms of Service</button> and <button class="text-link" type="button" data-info="Privacy policy is not connected in this prototype.">Privacy Policy</button>&nbsp;.</p>
        </div>
        <span class="field-error terms-error" id="terms-error" role="alert"${showTermsError ? "" : " hidden"}>Please accept the Terms of Service and Privacy Policy to continue.</span>
        <button class="login-button" type="submit">Sign up</button>
        <div class="social-divider"><span></span><span>or</span><span></span></div>
        ${socialButtons}
        <p class="register-copy">Already have an account? <button class="text-link" type="button" data-screen="login">Sign in</button></p>
        <p class="interaction-message" data-message role="status" aria-live="polite"></p>
      </form>
    </div>`;

  const verificationScreen = () => {
    const email = escapeHtml(registrationData.email || "your email");
    return `
      <div class="verification-content">
        <h2 class="screen-title">Verification</h2>
        <p class="verification-copy">We sent a verification code to <span>${email}</span>.<br>Please check your inbox or spam folder.</p>
        <form class="verification-form" data-verification-form>
          <div class="form-field">
            <label for="verification-code">Verification Code</label>
            <input id="verification-code" name="verificationCode" type="text" inputmode="numeric" placeholder="Enter verification code..." autocomplete="one-time-code" required>
          </div>
          <button class="login-button" type="submit">Next</button>
          <p class="verification-resend">Didn't receive any email? <button class="text-link" type="button" data-info="Resending the verification code is not connected in this prototype.">Resend</button></p>
        </form>
      </div>`;
  };

  const registerSuccessScreen = () => {
    const username = escapeHtml(registrationData.username || "Friend");
    return `
      <div class="success-content">
        <h2 class="success-heading">Welcome,<br><span>${username}</span></h2>
        <div class="verification-robot success-robot" aria-hidden="true">
          <img class="mascot-illustration" src="assets/3d-images/robot-mascot.png" alt="" draggable="false">
        </div>
        <p class="robot-copy success-copy">You're all set, ${username}!<br>Hang tight while we prepare your account.</p>
        <div class="success-loading" role="status" aria-label="Preparing your account">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" pathLength="100"/></svg>
          <span class="visually-hidden">Preparing your account…</span>
        </div>
      </div>`;
  };

  const navigation = (active) => `
    <nav class="app-navigation" aria-label="Main navigation">
      <button class="nav-item${active === "home" ? " is-active" : ""}" type="button" data-screen="home" aria-current="${active === "home" ? "page" : "false"}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/></svg><span>Home</span>
      </button>
      <button class="nav-item${active === "live-map" ? " is-active" : ""}" type="button" data-screen="live-map" aria-current="${active === "live-map" ? "page" : "false"}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg><span>Live Map</span>
      </button>
      <button class="nav-book" type="button" data-action="quick-book" aria-label="Quick book"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
      <button class="nav-item${active === "tickets" ? " is-active" : ""}" type="button" data-screen="tickets" aria-current="${active === "tickets" ? "page" : "false"}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M13 8v2m0 2v2m0 2v1"/></svg><span>Tickets</span>
      </button>
      <button class="nav-item${active === "profile" ? " is-active" : ""}" type="button" data-screen="profile" aria-current="${active === "profile" ? "page" : "false"}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-1.5a7 7 0 0 1 14 0V21H5Z"/></svg><span>Profile</span>
      </button>
    </nav>`;

  const mapMarkup = (compact = false, live = false) => {
    const roads = live
      ? '<path class="road-local" d="M-20 45 94 72 148 59 215 86 380 65M-20 128 75 153 153 135 224 167 380 143M-20 214 92 194 160 224 247 208 380 242M-20 302 81 277 165 306 238 284 380 318M-20 392 88 360 161 395 255 372 380 414M-20 486 92 454 167 486 247 463 380 502M-20 574 84 548 164 577 255 553 380 596M42-20 62 102 42 206 76 303 50 404 87 505 68 660M118-20 133 78 110 174 145 272 124 373 153 468 137 570 160 660M235-20 218 93 251 186 224 285 261 383 232 475 272 572 251 660M326-20 302 92 335 188 310 282 348 374 318 469 350 566 330 660"/><path class="road-secondary" d="M158-10 169 112 151 181 191 253 163 329 210 386 200 469 231 552 202 650M-15 100 130 122 354 95M30 255 163 329 345 355M-12 455 210 386 365 422M66 0 91 180 44 313M290 35 252 202 290 300 269 620"/><path class="road-main" d="M158-10 169 112 151 181 191 253 163 329 210 386 200 469 231 552 202 650"/><path class="route-line route-line-normal" d="M217 515 200 469 210 386"/><path class="route-line route-line-moderate" d="M210 386 163 329 191 253"/><path class="route-line route-line-congested" d="M191 253 186 245"/><path class="bus-travel-path" d="M217 515 200 469 210 386 163 329 191 253 186 245"/><circle class="map-junction" cx="163" cy="329" r="8"/><circle class="map-junction" cx="191" cy="253" r="7"/><circle class="map-junction" cx="210" cy="386" r="7"/>'
      : '<path class="road-main" d="M-12 136 68 95 118 108 164 65 217 78 286 20 374 35"/><path class="road-secondary" d="M-15 48 68 95 95 166M118 108 152 180M164 65 147 0M217 78 231 158M286 20 312 0M286 20 332 114"/><path class="route-line" d="M48 119 110 104 160 70 220 77 296 35"/>';
    const viewBox = live ? "0 0 360 640" : "0 0 360 180";
    return `
      <div class="map-art${compact ? " is-compact" : ""}${live ? " is-live" : ""}" role="${live ? "group" : "img"}" aria-label="Illustrative, not-to-scale route map from Robinsons Place Malolos to Trinoma via the North Luzon Expressway">
        <div class="map-scene">
          <span class="map-block map-block-one"></span><span class="map-block map-block-two"></span>
          <span class="map-block map-block-three"></span><span class="map-block map-block-four"></span>
          ${live ? '<span class="map-park map-park-one"></span><span class="map-park map-park-two"></span><span class="map-district-label district-malolos">MALOLOS</span><span class="map-district-label district-bocaue">BOCAUE</span><span class="map-district-label district-marilao">MARILAO</span><span class="map-district-label district-balintawak">BALINTAWAK</span><span class="map-district-label district-trinoma">TRINOMA</span>' : ""}
          <svg class="map-roads" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${roads}</svg>
          <span class="map-label map-label-one">${live ? "ROBINSONS MALOLOS" : "MALINTA"}</span><span class="map-label map-label-two">${live ? "NORTH LUZON EXPY" : "NORTH AVE"}</span>
          <span class="map-marker map-marker-start" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-8.1 8-13a8 8 0 1 0-16 0c0 4.9 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>
          ${live ? '<span class="map-marker map-marker-bus" data-sim-bus="0" tabindex="0" role="img" aria-label="Simulated bus 1. Malolos to North Avenue. 3 minutes away, 8 seats available, on time." aria-describedby="bus-tooltip-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg><span class="map-bus-tooltip" id="bus-tooltip-1" role="tooltip"><strong>Bus 01</strong><span>Malolos → North Avenue</span><span>3 min · 8 seats</span><small>On time · Demo data</small></span></span><span class="map-marker map-marker-bus map-marker-bus-alt" data-sim-bus="1" tabindex="0" role="img" aria-label="Simulated bus 2. Malolos to North Avenue. Less than 1 minute away, 1 seat available, on time." aria-describedby="bus-tooltip-2"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg><span class="map-bus-tooltip" id="bus-tooltip-2" role="tooltip"><strong>Bus 02</strong><span>Malolos → North Avenue</span><span>&lt;1 min · 1 seat</span><small>On time · Demo data</small></span></span>' : '<span class="map-marker map-marker-bus" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg></span>'}
          <span class="map-marker map-marker-destination" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-8.1 8-13a8 8 0 1 0-16 0c0 4.9 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>
          ${compact ? "" : '<span class="map-compass" aria-hidden="true">N</span>'}
        </div>
      </div>`;
  };

  const homeHeaderContent = ({ searchPlaceholder = "Where are you heading?", searchMode = "route", footerMarkup = null } = {}) => `
    <div class="home-header-content">
      <div class="home-greeting-row">
        <div><p class="location-kicker"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Your Location</p><h1>Robinsons Place Malolos</h1></div>
        <button class="notification-button" type="button" aria-label="Notifications, ${unreadNotificationCount()} unread" data-screen="notifications"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span class="notification-count"${unreadNotificationCount() ? "" : " hidden"}>${unreadNotificationCount()}</span></button>
      </div>
      <form class="destination-search" data-route-search>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
        <input name="destination" type="text" placeholder="${searchPlaceholder}" aria-label="${searchPlaceholder}"${searchMode === "history" ? " data-trip-history-search" : ""}>
        <button type="submit" aria-label="Search rides"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="9" cy="7" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="11" cy="17" r="1.7"/></svg></button>
      </form>
      ${footerMarkup ?? `<div class="home-shortcuts">
        <button type="button" data-info="Your saved routes will appear here."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4V4Z"/></svg>Saved Routes</button>
        <button type="button" data-info="Fare estimates are shown with ride results."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5"/></svg>Fare Estimator</button>
        <button type="button" data-info="Home location updated for this demo."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Set Home</button>
      </div>`}
    </div>`;

  const homeScreen = () => `
    <div class="commuter-app">
      <div class="home-scroll">
        <header class="home-header">
          ${homeHeaderContent()}
        </header>
        <section class="pouch-panel" aria-label="U-Pouch balance">
          <div><span>Current U-Pouch Balance:</span><strong>₱2.00</strong></div>
          <button type="button" data-info="Top up is a visual demo only."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Top Up</span></button>
          <span class="pouch-icon" aria-hidden="true"><svg viewBox="0 0 40 36"><defs><linearGradient id="pouch-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#19bd91"/><stop offset="1" stop-color="#109b78"/></linearGradient></defs><path fill="url(#pouch-gradient)" d="M8 3h24a4 4 0 0 1 4 4v4h-7V8H8a4 4 0 0 0 0 8h27a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4H8a8 8 0 0 1-8-8V11a8 8 0 0 1 8-8Z"/><path fill="#fff" d="M8 7h21a2 2 0 0 1 2 2v2H8a2 2 0 1 1 0-4Zm24 15h4v8h-4z"/></svg></span>
        </section>
        <section class="home-map-section" aria-label="Nearby vehicles map">
          ${mapMarkup()}
          <span class="live-chip"><i></i> Demo map</span>
          <button class="expand-map" type="button" data-screen="live-map" aria-label="Open live map"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg></button>
        </section>
        <div class="home-stats" aria-label="Ride summary">
          <div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h13l3 4h2v6h-2m-14 0H3V7Zm2 0v6h12V7m-9 10a2 2 0 1 1-4 0m14 0a2 2 0 1 1-4 0"/></svg><strong>2</strong><span>Nearby</span></div>
          <div><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><strong>1 min</strong><span>Fastest</span></div>
          <div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M13 8v2m0 2v2m0 2v1"/></svg><strong>${bookingConfirmed ? "1" : "0"}</strong><span>Booked</span></div>
        </div>
        <section class="vehicle-section">
          <div class="section-heading"><h2>Vehicles near you</h2><span><i></i> 2 en route</span></div>
          <button class="vehicle-row" type="button" data-action="quick-book">
            <span class="vehicle-logo">MLS<br><small>NAVE</small></span>
            <span class="vehicle-info"><strong>Malolos – North Avenue Station</strong><small>via North Luzon Expressway · 8 seats available</small></span>
            <span class="vehicle-eta">3 min<small>On time</small></span>
          </button>
          <button class="vehicle-row" type="button" data-action="quick-book">
            <span class="vehicle-logo ochre">MLS<br><small>NAVE</small></span>
            <span class="vehicle-info"><strong>Malolos – North Avenue Station</strong><small>via North Luzon Expressway · 1 seat available</small></span>
            <span class="vehicle-eta soon">&lt;1 min<small>On time</small></span>
          </button>
        </section>
        <p class="home-demo-note">Illustrative vehicle ETAs · No live tracking</p>
      </div>
      ${navigation("home")}
    </div>`;

  const accountVerificationScreen = () => {
    const concessionTypes = [
      { id: "student", label: "Student", detail: "20% Discount", icon: '<path d="M3 9 12 4l9 5-9 5-9-5Z"/><path d="M6 11v5c3.5 3 8.5 3 12 0v-5m3-2v6"/>' },
      { id: "senior", label: "Senior", detail: "60+ y/o", icon: '<circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2m-2-4 4 4m-4 0h4"/>' },
      { id: "pwd", label: "PWD", detail: "Valid ID", icon: '<circle cx="12" cy="5" r="2"/><path d="M10 9h5l2 4h-4l-1 3m-2-7-2 5h4l2 4m-3-2-3 4"/>' },
    ];
    const stepLabel = (step, label) => `<span class="verification-step${discountVerificationStep === step ? " is-current" : discountVerificationStep > step ? " is-complete" : ""}"${discountVerificationStep === step ? ' aria-current="step"' : ""}><i>${discountVerificationStep > step ? "✓" : step}</i><strong>${label}</strong></span>`;
    const uploadCard = (side, title) => {
      const file = discountVerificationFiles[side];
      const preview = file?.previewUrl
        ? `<img class="verification-upload-preview" src="${escapeHtml(file.previewUrl)}" alt="${side === "front" ? "Front" : "Back"} of uploaded discount ID">`
        : `<span class="verification-upload-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3"/></svg></span>`;
      return `<article class="verification-upload-card${file ? " has-file" : ""}">
        ${preview}
        <strong>${file ? escapeHtml(file.name) : title}</strong>
        <small>${file ? file.type === "application/pdf" ? "PDF added" : "Image added" : "Ensure details are free of glares, reflections or blurriness."}</small>
        <div class="verification-upload-actions">
          <button type="button" data-trigger-id-upload="${side}" data-upload-kind="camera" aria-label="Take photo of ${side} of ID" title="Take photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3"/></svg></button>
          <button type="button" data-trigger-id-upload="${side}" data-upload-kind="file" aria-label="Choose ${side} ID file" title="Choose file"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6l2 2h8v12H4zM12 10v6m-3-3 3-3 3 3"/></svg></button>
          ${file ? `<button type="button" class="verification-remove-upload" data-remove-id-upload="${side}">Remove</button>` : ""}
          <input class="verification-file-input" type="file" accept="image/jpeg,image/png,application/pdf" capture="environment" data-discount-id-upload="${side}" data-upload-kind="camera" aria-hidden="true" tabindex="-1">
          <input class="verification-file-input" type="file" accept="image/jpeg,image/png,application/pdf" data-discount-id-upload="${side}" data-upload-kind="file" aria-hidden="true" tabindex="-1">
        </div>
      </article>`;
    };
    const stepContent = discountVerificationStep === 1
      ? `<div class="verification-section-label"><strong>Select Concession Type</strong><span>${discountVerificationType === "student" ? "20% Discount" : "Discount ID"}</span></div>
          <div class="verification-types" role="group" aria-label="Concession type">
            ${concessionTypes.map((type) => `<button type="button" class="verification-type${discountVerificationType === type.id ? " is-selected" : ""}" data-concession-type="${type.id}" aria-pressed="${discountVerificationType === type.id}"><span class="verification-type-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${type.icon}</svg></span><strong>${type.label}</strong><small>${type.id === discountVerificationType ? "Selected" : type.detail}</small></button>`).join("")}
          </div>
          <div class="verification-section-label verification-upload-heading"><strong>Document Upload</strong><span>JPG, PNG or PDF</span></div>
          <div class="verification-upload-list">${uploadCard("front", "Upload Front of School ID")}${uploadCard("back", "Upload Back of School ID")}</div>
          <p class="verification-note">Automated ID verification usually takes 1-2 minutes once submitted.</p>
          ${discountVerificationMessage ? `<p class="verification-message" data-verification-message role="status" aria-live="polite">${escapeHtml(discountVerificationMessage)}</p>` : ""}
          <button class="verification-primary" type="button" data-verification-action="review">Continue to Verification <span aria-hidden="true">→</span></button>`
      : discountVerificationStep === 2
        ? `<section class="verification-review" aria-labelledby="verification-review-title">
          <h2 id="verification-review-title">Review your documents</h2>
          <p>Check that your concession type and ID images are correct.</p>
          <div class="verification-review-type"><strong>Concession Type</strong><span>${concessionTypes.find((type) => type.id === discountVerificationType)?.label}</span></div>
          <div class="verification-review-files">${["front", "back"].map((side) => `<div><strong>${side === "front" ? "Front" : "Back"} of ID</strong>${discountVerificationFiles[side]?.previewUrl ? `<img src="${escapeHtml(discountVerificationFiles[side].previewUrl)}" alt="${side} ID preview">` : `<span class="verification-file-name">${escapeHtml(discountVerificationFiles[side]?.name || "ID document")}</span>`}</div>`).join("")}</div>
          <label class="verification-confirm"><input type="checkbox" data-verification-confirmed${discountVerificationConfirmed ? " checked" : ""}><span>I confirm these details are clear and belong to me.</span></label>
          <p class="verification-message" data-verification-message role="status" aria-live="polite">${escapeHtml(discountVerificationMessage)}</p>
          <div class="verification-review-actions"><button type="button" class="verification-secondary" data-verification-action="edit">Edit Documents</button><button type="button" class="verification-primary" data-verification-action="submit"${discountVerificationConfirmed ? "" : " disabled"}>Submit for Verification</button></div>
        </section>`
        : `<section class="verification-complete" aria-labelledby="verification-complete-title">
          <span class="verification-complete-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg></span>
          <h2 id="verification-complete-title">Request ready</h2>
          <p>Your ${concessionTypes.find((type) => type.id === discountVerificationType)?.label} ID is marked <strong>Pending</strong> in this prototype.</p>
          <p>Documents are not sent to a live identity verification service.</p>
          <button class="verification-primary" type="button" data-screen="profile">Back to Account</button>
        </section>`;
    return `<div class="commuter-app verification-app">
      <div class="settings-scroll verification-scroll">
        <header class="settings-header verify-account-header"><div class="device-status-spacer" aria-hidden="true"></div><div class="settings-title"><h1>Verify Discount ID</h1></div></header>
        <main class="discount-verification-content">
          <div class="verification-stepper" role="list" aria-label="Verification progress">${stepLabel(1, "Upload ID")}<span aria-hidden="true"></span>${stepLabel(2, "Review")}<span aria-hidden="true"></span>${stepLabel(3, "Verify")}</div>
          ${stepContent}
        </main>
      </div>
      ${navigation("profile")}
    </div>`;
  };

  const quickBookScreen = () => `
    <div class="commuter-app has-modal">
      ${homeScreen()}
      <div class="modal-scrim" data-quick-book-overlay>
        <form class="bottom-sheet quick-book-sheet" data-quick-book>
          <span class="sheet-handle"></span>
          <h2>Quick Book</h2><p class="sheet-subtitle">Find and reserve a seat in seconds</p>
          <div class="route-fields">
            <label><span class="route-dot origin-dot"></span><input name="origin" aria-label="Starting point" value="${escapeHtml(tripData.origin)}" required></label>
            <label><span class="route-dot destination-dot"></span><input name="destination" aria-label="Destination" value="${escapeHtml(tripData.destination)}" required></label>
          </div>
          <label class="sheet-label" for="passenger-count">Passengers</label>
          <div class="passenger-stepper"><span id="passenger-count">${tripData.passengers} ${tripData.passengers === 1 ? "passenger" : "passengers"}</span><div><button type="button" data-passengers="minus" aria-label="Remove passenger">−</button><strong>${tripData.passengers}</strong><button type="button" data-passengers="plus" aria-label="Add passenger">+</button></div></div>
          <label class="sheet-label">Payment Method</label>
          <div class="payment-options">
            <label class="payment-option${tripData.payment === "U-Pouch" ? " selected" : ""}"><input type="radio" name="payment" value="U-Pouch"${tripData.payment === "U-Pouch" ? " checked" : ""}><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/></svg></span><span><strong>U-Pouch</strong><small>₱2.00 <em>Insufficient amount</em></small></span><button type="button" data-info="Top up is a visual demo only.">＋ Top Up</button></label>
            <label class="payment-option${tripData.payment === "GCash" ? " selected" : ""}"><input type="radio" name="payment" value="GCash"${tripData.payment === "GCash" ? " checked" : ""}><span class="payment-icon gcash">G</span><span><strong>GCash</strong><small>••••5678 · Sufficient Balance</small></span></label>
            <label class="payment-option${tripData.payment === "Credit / Debit Card" ? " selected" : ""}"><input type="radio" name="payment" value="Credit / Debit Card"${tripData.payment === "Credit / Debit Card" ? " checked" : ""}><span class="payment-icon card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg></span><span><strong>Credit / Debit Card</strong><small>••4567</small></span></label>
          </div>
          <button class="sheet-primary" type="submit">Find Rides <span>→</span></button>
        </form>
      </div>
    </div>`;

  const rideResultsScreen = () => `
    <div class="ride-results">
      <header class="results-header">
        <button type="button" class="round-back" data-screen="home" aria-label="Back to home">‹</button>
        <div><h1>${escapeHtml(tripData.origin)} <span>→ ${escapeHtml(tripData.destination)}</span></h1><p>${tripData.passengers} ${tripData.passengers === 1 ? "passenger" : "passengers"} · ${escapeHtml(tripData.payment)}</p></div>
      </header>
      <div class="results-map">${mapMarkup(true)}<span class="destination-label">${escapeHtml(tripData.destination)}</span></div>
      <div class="result-filter"><button class="filter-selected" type="button">Fastest</button><button type="button" data-info="Showing the fastest available seats.">More Seats</button></div>
      <div class="discount-note"><span>✓</span> Student Discount Applied</div>
      <section class="ride-list">
        <article class="ride-card"><span class="ride-logo">MLS<small>NAVE</small></span><div class="ride-detail"><h2>Malolos – North Avenue Station</h2><p>via North Luzon Expressway</p><span>8 seats available · ₱80.00</span></div><div class="ride-arrival">&lt;1 min<small>Arrival</small></div><button type="button" class="ride-book" data-action="open-confirmation">Book</button></article>
        <article class="ride-card"><span class="ride-logo">MLS<small>NAVE</small></span><div class="ride-detail"><h2>Malolos – North Avenue Station</h2><p>via North Luzon Expressway</p><span>8 seats available · ₱80.00</span></div><div class="ride-arrival">3 min<small>Arrival</small></div><button type="button" class="ride-book" data-action="open-confirmation">Book</button></article>
        <article class="ride-card is-sold-out"><span class="ride-logo">MLS<small>NAVE</small></span><div class="ride-detail"><h2>Malolos – North Avenue Station</h2><p>via North Luzon Expressway</p><span>0 seats · ₱80.00</span></div><div class="ride-arrival">9 min<small>Arrival</small></div><button type="button" class="ride-book" disabled>Full</button></article>
      </section>
      <p class="prototype-stamp">Sample ride options · Not live availability</p>
    </div>`;

  const bookingConfirmationScreen = () => `
    <div class="ride-results with-confirmation">
      ${rideResultsScreen()}
      <div class="modal-scrim">
        <section class="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title">
          <button class="modal-close" type="button" aria-label="Close confirmation" data-screen="find-rides">×</button>
          <h2 id="booking-dialog-title">Booking Confirmation</h2><p class="sheet-subtitle">Ride Details</p>
          <div class="confirm-route"><span class="ride-logo">MLS<small>NAVE</small></span><div><strong>Malolos – North Avenue Station</strong><small>via North Luzon Expressway · Drop-Off Near ${escapeHtml(tripData.destination)}</small><span>8 seats available</span></div></div>
          <dl class="fare-breakdown"><div><dt>Regular Fare</dt><dd>₱${(100 * tripData.passengers).toFixed(2)}</dd></div><div><dt>Student Discount</dt><dd>-₱${(20 * tripData.passengers).toFixed(2)}</dd></div><div class="fare-total"><dt>Total Fare</dt><dd>₱${(80 * tripData.passengers).toFixed(2)}</dd></div></dl>
          <div class="dialog-actions"><button type="button" data-screen="find-rides">Cancel</button><button type="button" class="confirm-action" data-action="confirm-booking">Confirm</button></div>
        </section>
      </div>
    </div>`;

  const bookingConfirmedScreen = () => {
    const trip = tripHistory.find(({ id }) => id === selectedHistoryTripId) ?? {
      id: "USAD-7X29-KM41",
      receiptId: "USAD-7X29-KM41",
      origin: tripData.origin,
      destination: tripData.destination,
      fare: 80 * tripData.passengers,
      seat: tripData.seat,
      passengers: tripData.passengers,
      payment: tripData.payment,
      status: "upcoming",
    };
    const isCurrentBooking = bookingConfirmed && trip.status === "upcoming";
    return `
    <div class="booking-confirmed">
      <button type="button" class="confirmed-back" data-screen="${selectedHistoryTripId ? "tickets" : "home"}" aria-label="Back">‹</button>
      <div class="confirmed-check" aria-hidden="true">${trip.status === "cancelled" ? "↺" : "✓"}</div>
      <h1>${trip.status === "cancelled" ? "Trip Refunded" : isCurrentBooking ? "Booking Confirmed" : "Trip Receipt"}</h1>
      <p>₱${Number(trip.fare).toFixed(2)} total · ${escapeHtml(trip.payment)} demo</p>
      <section class="ticket-panel">
        <div class="demo-qr" role="img" aria-label="Illustrative non-scannable ticket code"><i></i><i></i><i></i><b></b></div>
        <span class="ticket-caption">Ticket Reference</span><strong class="ticket-number">${escapeHtml(trip.receiptId || trip.id)}</strong>
        <div class="ticket-route"><span class="ride-logo">MLS<small>NAVE</small></span><div><strong>${escapeHtml(trip.destination)}</strong><small>${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</small></div></div>
        <div class="ticket-facts"><div><span>Trip status</span><strong>${trip.status === "cancelled" ? "Refunded" : trip.status === "upcoming" ? "Booked" : "Completed"}</strong></div><div><span>Seat</span><strong>${escapeHtml(trip.seat || "—")}</strong></div><div><span>Passengers</span><strong>${trip.passengers || 1}</strong></div><div><span>Fare total</span><strong>₱${Number(trip.fare).toFixed(2)}</strong></div></div>
        ${trip.status === "upcoming" ? '<button type="button" class="track-ride" data-screen="live-map"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Track this ride</button>' : '<button type="button" class="track-ride" data-screen="tickets">Back to trip history <span>→</span></button>'}
      </section>
      ${isCurrentBooking ? '<button type="button" class="cancel-booking" data-action="cancel-booking">Cancel booking</button>' : ""}
      <p class="prototype-stamp">Illustrative demo · No live service connected</p>
    </div>`;
  };

  const liveSeatOverviewScreen = () => {
    const bus = liveBusDetails[selectedLiveBus];
    return `
    <div class="seat-capacity-page">
      <div class="seat-capacity-shell">
        <section class="seat-capacity-panel panel-map" aria-label="Live seat capacity overview">
          <div class="seat-capacity-sticky">
            <header class="seat-capacity-header">
              <div class="seat-capacity-title-wrap">
                <h2>Find Available Seats</h2>
              </div>
              <button class="seat-capacity-back" type="button" data-screen="live-map" aria-label="Back to live map">‹</button>
            </header>
            <label class="seat-search" aria-label="Search for buses">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
              <input type="search" placeholder="Search for bus..." aria-label="Search for buses">
            </label>
            <div class="seat-category-tabs" role="tablist" aria-label="Nearby route filters">
              <button class="is-active" type="button">Bus Near Me</button>
              <button type="button">Nearby Stops</button>
              <button type="button">Recent Rid</button>
            </div>
          </div>
          <div class="seat-map-surface">
            ${mapMarkup(false, true)}
            <button class="seat-map-bubble" type="button" data-screen="live-seat-detail">${bus.name}</button>
          </div>
          <div class="seat-bus-card">
            <div class="seat-bus-meta">
              <div class="seat-bus-icon" aria-hidden="true">MLS</div>
              <div>
                <strong>Bus Information</strong>
                <span>${bus.fleetId} · ${bus.route}</span>
              </div>
            </div>
            <div class="seat-bus-rows">
              <div><span>Estimated Fare</span><strong>${bus.fare}</strong></div>
              <div><span>Available Seats</span><strong>${bus.seats} ${bus.seats === 1 ? "seat" : "seats"}</strong></div>
            </div>
            <div class="seat-layout" aria-label="Seat layout">
              ${seatLayoutMarkup(bus)}
            </div>
            <div class="seat-legend">
              <span><i class="seat-dot available"></i> Available</span>
              <span><i class="seat-dot occupied"></i> Occupied</span>
            </div>
          </div>
          ${navigation("live-map")}
        </section>

        <aside class="seat-capacity-panel panel-book" aria-label="Quick booking panel">
          <div class="seat-book-card">
            <div class="seat-book-header">
              <h3>Quick Book</h3>
              <button type="button" aria-label="Close quick book" data-screen="live-map">×</button>
            </div>
            <p class="sheet-subtitle">Find and reserve a seat in seconds</p>
            <div class="route-fields">
              <label><span class="route-dot origin-dot"></span><input name="origin" aria-label="Starting point" value="${escapeHtml(tripData.origin)}" readonly></label>
              <label><span class="route-dot destination-dot"></span><input name="destination" aria-label="Destination" value="${escapeHtml(tripData.destination)}" readonly></label>
            </div>
            <label class="sheet-label" for="seat-passengers">Passengers</label>
            <div class="passenger-stepper"><span id="seat-passengers">${tripData.passengers} ${tripData.passengers === 1 ? "passenger" : "passengers"}</span><div><button type="button" data-passengers="minus" aria-label="Remove passenger">−</button><strong>${tripData.passengers}</strong><button type="button" data-passengers="plus" aria-label="Add passenger">+</button></div></div>
            <label class="sheet-label">Payment Method</label>
            <div class="payment-options">
              <label class="payment-option${tripData.payment === "U-Pouch" ? " selected" : ""}"><input type="radio" name="payment" value="U-Pouch"${tripData.payment === "U-Pouch" ? " checked" : ""}><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/></svg></span><span><strong>U-Pouch</strong><small>₱2.00 <em>Insufficient amount</em></small></span><button type="button" data-info="Top up is a visual demo only.">＋ Top Up</button></label>
              <label class="payment-option${tripData.payment === "GCash" ? " selected" : ""}"><input type="radio" name="payment" value="GCash"${tripData.payment === "GCash" ? " checked" : ""}><span class="payment-icon gcash">G</span><span><strong>GCash</strong><small>••••5678 · Sufficient Balance</small></span></label>
            </div>
            <button class="sheet-primary" type="button" data-action="open-confirmation">Find Rides <span>→</span></button>
          </div>
        </aside>
      </div>
    </div>
  `;
  };

  const seatLayoutMarkup = (bus) => Array.from({ length: 10 }, (_, index) => {
    const row = index % 5 + 1;
    const side = index < 5 ? "A" : "B";
    const seatId = `${row}${side}`;
    const status = index < bus.seats ? selectedBusSeatId === seatId ? "selected" : "empty" : "occupied";
    return `<span class="seat-seat ${status}">${row}${side}</span>`;
  }).join("");

  const busSeatPlanMarkup = (bus) => Array.from({ length: 5 }, (_, rowIndex) => {
    const row = rowIndex + 1;
    const seatButton = (side) => {
      const seatId = `${row}${side}`;
      const seatIndex = rowIndex * 2 + (side === "B" ? 1 : 0);
      const occupied = seatIndex >= bus.seats;
      const selected = !occupied && selectedBusSeatId === seatId;
      const seatState = occupied ? "occupied" : selected ? "selected" : "empty";
      const label = occupied ? "occupied" : selected ? "selected" : "available";
      return `<button class="seat-seat ${seatState}" type="button" data-bus-seat="${seatId}" aria-label="Seat ${seatId}, ${label}" aria-pressed="${selected}"${occupied ? " disabled" : ""}>${seatId}</button>`;
    };
    return `<div class="bus-seat-row">${seatButton("A")}<span class="bus-seat-aisle" aria-hidden="true"></span>${seatButton("B")}</div>`;
  }).join("");

  const liveSeatDetailScreen = () => {
    const bus = liveBusDetails[selectedLiveBus];
    const availableSeatIds = Array.from({ length: 10 }, (_, index) => `${Math.floor(index / 2) + 1}${index % 2 ? "B" : "A"}`).slice(0, bus.seats);
    if (!availableSeatIds.includes(selectedBusSeatId)) selectedBusSeatId = availableSeatIds[0] ?? "";
    const seatOptions = availableSeatIds.map((seatId) => {
      const [row, side] = seatId;
      const description = `Row ${row}, ${side === "A" ? "left" : "right"} side`;
      return `<option value="${seatId}"${selectedBusSeatId === seatId ? " selected" : ""}>${seatId} · ${description}</option>`;
    }).join("");
    return `
    <div class="seat-capacity-page seat-detail-booking">
      <div class="seat-detail-background" inert aria-hidden="true">${liveSeatOverviewScreen()}</div>
      <div class="modal-scrim seat-detail-booking-scrim" data-seat-booking-overlay>
        <form class="bottom-sheet quick-book-sheet seat-detail-booking-sheet" data-quick-book aria-label="Quick Book">
          <span class="sheet-handle"></span>
          <div class="seat-detail-booking-scroll">
            <h2>Quick Book</h2>
            <p class="sheet-subtitle">Find and reserve a seat in seconds</p>
            <div class="route-fields">
              <label><span class="route-dot origin-dot"></span><input name="origin" aria-label="Starting point" value="${escapeHtml(tripData.origin)}" readonly></label>
              <label><span class="route-dot destination-dot"></span><input name="destination" aria-label="Destination" value="${escapeHtml(tripData.destination)}" readonly></label>
            </div>
            <label class="sheet-label" for="passenger-count">Passengers</label>
            <div class="passenger-stepper"><span id="passenger-count">${tripData.passengers} ${tripData.passengers === 1 ? "passenger" : "passengers"}</span><div><button type="button" data-passengers="minus" aria-label="Remove passenger">−</button><strong>${tripData.passengers}</strong><button type="button" data-passengers="plus" aria-label="Add passenger">+</button></div></div>
            <label class="sheet-label" for="live-seat-picker">Seat/s</label>
            <select id="live-seat-picker" class="seat-picker" name="seat" aria-label="Select a seat">${seatOptions}</select>
            <label class="sheet-label">Payment Method</label>
            <div class="payment-options">
              <label class="payment-option${tripData.payment === "U-Pouch" ? " selected" : ""}"><input type="radio" name="payment" value="U-Pouch"${tripData.payment === "U-Pouch" ? " checked" : ""}><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/></svg></span><span><strong>U-Pouch</strong><small>₱2.00 <em>Insufficient amount</em></small></span><button type="button" data-info="Top up is a visual demo only.">＋ Top Up</button></label>
              <label class="payment-option${tripData.payment === "GCash" ? " selected" : ""}"><input type="radio" name="payment" value="GCash"${tripData.payment === "GCash" ? " checked" : ""}><span class="payment-icon gcash">G</span><span><strong>GCash</strong><small>••••5678 · Sufficient Balance</small></span></label>
              <label class="payment-option${tripData.payment === "Credit / Debit Card" ? " selected" : ""}"><input type="radio" name="payment" value="Credit / Debit Card"${tripData.payment === "Credit / Debit Card" ? " checked" : ""}><span class="payment-icon card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg></span><span><strong>Credit / Debit Card</strong><small>••4567</small></span></label>
            </div>
          </div>
          <div class="seat-detail-booking-footer"><button class="sheet-primary" type="submit">Find Rides <span>→</span></button></div>
        </form>
      </div>
    </div>
  `;
  };

  const secondaryTabScreen = (state) => {
    const titles = { "live-map": "Live Map", tickets: "My Tickets", profile: "Account Information", faq: "Customer Support", notifications: "Notifications" };
    const notificationIcon = (type) => {
      const paths = {
        ride: '<path d="M5 16V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9M5 12h14M8 19h.01M16 19h.01M7 16h10l2 3H5l2-3Z"/>',
        ticket: '<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z"/><path d="M13 8v2m0 2v2m0 2v1"/>',
        service: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><path d="M12 8v4m0 3h.01"/>',
        promo: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
      };
      return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[type]}</svg>`;
    };
    const notificationContent = `
      <div class="notification-page">
        <section class="notification-overview" aria-label="Notification controls">
          <div><strong><span data-notification-unread-count aria-live="polite" aria-atomic="true">${unreadNotificationCount()}</span> unread</strong><small>Sample alerts · not live updates</small></div>
          <button type="button" class="notification-mark-all" data-notifications-mark-all${unreadNotificationCount() ? "" : " disabled"}>Mark all read</button>
        </section>
        <div class="notification-filters" role="group" aria-label="Filter notifications">
          <button type="button" data-notification-filter="all" aria-pressed="${notificationFilter === "all"}" class="${notificationFilter === "all" ? "is-active" : ""}">All</button>
          <button type="button" data-notification-filter="unread" aria-pressed="${notificationFilter === "unread"}" class="${notificationFilter === "unread" ? "is-active" : ""}">Unread <span data-notification-unread-tab-count>${unreadNotificationCount()}</span></button>
        </div>
        <section class="notification-list" aria-label="Notifications" data-notification-list>
          ${notifications.map((notification) => `
            <button type="button" class="notification-item${notification.unread ? " is-unread" : ""}" data-notification-id="${notification.id}" aria-label="${notification.unread ? "Mark as read: " : "Mark as unread: "}${escapeHtml(notification.title)}">
              <span class="notification-item-icon is-${notification.type}">${notificationIcon(notification.type)}</span>
              <span class="notification-item-copy"><strong>${escapeHtml(notification.title)}</strong><span>${escapeHtml(notification.body)}</span><small>${escapeHtml(notification.time)}</small></span>
              <span class="notification-unread-dot" aria-hidden="true"${notification.unread ? "" : " hidden"}></span>
            </button>`).join("")}
        </section>
        <p class="notification-empty" data-notification-empty role="status" aria-live="polite" hidden>No unread notifications. You’re all caught up.</p>
        <p class="notification-disclaimer">Notifications are examples only. Push alerts and live service updates are not connected.</p>
      </div>`;
    const profileField = (field, label, type = "text") => `
      <div class="account-edit-field">
        <label for="profile-field-${field}">${label}</label>
        <span class="account-edit-control">
          <input id="profile-field-${field}" type="${type}" value="${escapeHtml(accountProfile[field])}" readonly data-profile-field="${field}">
          <button type="button" data-edit-field="${field}" aria-label="Edit ${label}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.8L19 8.4 15.6 5 4.8 15.8 4 20Z"/></svg>
          </button>
        </span>
      </div>`;
    const paymentIcon = (icon) => {
      if (icon === "pouch") return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/><circle cx="18" cy="12.5" r=".7"/></svg>';
      if (icon === "card") return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg>';
      if (icon === "gcash") return '<span class="payment-brand-icon gcash-brand">G</span>';
      if (icon === "maya") return '<span class="payment-brand-icon maya-brand">M</span>';
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5 14 9.5a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0m3-7-4 4a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0"/></svg>';
    };
    const tripHistoryScreen = () => {
      const completedTrips = tripHistory.filter((trip) => trip.status === "completed");
      const cancelledTrips = tripHistory.filter((trip) => trip.status === "cancelled");
      const monthlySummary = { month: "October 2024", totalSpent: 960, rides: 12, co2Saved: 18.4 };
      const filters = `<div class="home-shortcuts trip-history-filters" role="group" aria-label="Filter trips">
        <button type="button" data-trip-filter="all" class="is-active" aria-pressed="true">All Trips</button>
        <button type="button" data-trip-filter="completed" aria-pressed="false">Completed (${completedTrips.length})</button>
        <button type="button" data-trip-filter="cancelled" aria-pressed="false">Cancelled (${cancelledTrips.length})</button>
        <button type="button" data-trip-filter="month" aria-pressed="false">This Month</button>
      </div>`;
      const cards = tripHistory.map((trip) => {
        const statusLabel = trip.status === "cancelled" ? "Refunded" : trip.status === "upcoming" ? "Booked" : "Completed";
        const fareDetail = trip.status === "cancelled" ? `Refunded ₱${trip.originalFare.toFixed(2)}` : `Paid via ${escapeHtml(trip.payment)}`;
        return `<article class="trip-history-card" data-trip-history-card data-trip-status="${trip.status}" data-trip-period="${trip.inMonth ? "month" : "older"}">
          <header class="trip-history-card-header"><span class="trip-history-code">${escapeHtml(trip.id)}</span><time>${escapeHtml(trip.date)}</time><span class="trip-history-status is-${trip.status}">${statusLabel}</span></header>
          <div class="trip-history-card-body">
            <div class="trip-history-stops">
              <div class="trip-history-stop"><i class="trip-origin-dot"></i><span><strong>${escapeHtml(trip.origin)}</strong><small>${escapeHtml(trip.originDetail)}</small></span></div>
              <div class="trip-history-stop"><i class="trip-destination-dot"></i><span><strong>${escapeHtml(trip.destination)}</strong><small>${escapeHtml(trip.destinationDetail)}</small></span></div>
            </div>
            <div class="trip-history-fare"><strong>₱${trip.fare.toFixed(2)}</strong><span>Seat ${escapeHtml(trip.seat)}</span><small>${fareDetail}</small></div>
          </div>
          ${trip.studentDiscount ? '<p class="trip-history-discount">Student Discount Applied (20% Off)</p>' : ""}
          <footer class="trip-history-actions">
            <button type="button" class="trip-receipt-link" data-view-trip="${trip.id}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.75h5l3 3v9.5H4zM9 2v3h3M6 8h4m-4 2.5h4"/></svg>${escapeHtml(trip.receiptLabel)}</button>
            ${trip.showRateAction ? '<button type="button" class="trip-rate-button" data-info="Trip rating is a prototype-only action.">Rate Trip</button>' : ""}
            ${trip.rebookLabel ? `<button type="button" class="trip-rebook-button${trip.rebookStyle === "secondary" ? " is-secondary" : ""}" data-action="rebook-trip" data-trip-id="${trip.id}">${escapeHtml(trip.rebookLabel)}</button>` : ""}
          </footer>
        </article>`;
      }).join("");
      return `<div class="trip-history-page">
        <header class="home-header ticket-history-header">${homeHeaderContent({ searchPlaceholder: "Search trips by bus code, date or invoice...", searchMode: "history", footerMarkup: filters })}</header>
        <div class="trip-history-body">
          <section class="trip-history-summary" aria-label="Monthly trip summary">
            <header><div class="trip-history-summary-title"><span aria-hidden="true"></span><h2>${monthlySummary.month} Spending</h2></div><button type="button" data-info="Tax invoice download is not connected in this prototype.">Download Tax Invoice</button></header>
            <div class="trip-history-stats"><div><span>Total Spent</span><strong>₱${monthlySummary.totalSpent.toFixed(2)}</strong></div><div><span>Rides Taken</span><strong>${monthlySummary.rides} Rides</strong></div><div><span>Saved CO₂</span><strong>${monthlySummary.co2Saved.toFixed(1)} kg</strong></div></div>
          </section>
          <div class="trip-history-section-heading"><h2>Recent Activity</h2><span>Malolos ⇄ Trinoma / EDSA</span></div>
          <section class="trip-history-list" data-trip-history-list aria-label="Recent trips">${cards}</section>
          <p class="trip-history-empty" data-trip-history-empty hidden>No trips match this search or filter.</p>
          <p class="trip-history-disclaimer">Sample trip history · Not connected to live booking records</p>
        </div>
      </div>`;
    };
    const liveMapScreen = () => `
      <div class="tab-map" tabindex="0" aria-label="Illustrative live operations map. Drag to pan, use plus and minus to zoom, or use arrow keys.">
        <header class="live-map-header">
          <div class="live-map-header-content">
            <div class="live-map-topbar">
              <div class="live-map-location"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Live View</span><strong>Live Operations Map</strong></div>
              <button class="notification-button compact" type="button" data-screen="notifications" aria-label="Notifications, ${unreadNotificationCount()} unread"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span class="notification-count"${unreadNotificationCount() ? "" : " hidden"}>${unreadNotificationCount()}</span></button>
            </div>
            <div class="live-map-search" role="search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
              <input type="search" data-live-map-search placeholder="Search trips by bus code, route..." aria-label="Search trips by bus code or route">
              <button type="button" data-live-filter-toggle aria-label="Toggle trip filters" aria-expanded="true" aria-controls="live-map-filters"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="9" cy="7" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="11" cy="17" r="1.7"/></svg></button>
            </div>
            <div class="live-map-filters" id="live-map-filters" role="group" aria-label="Filter map activity">
              <button type="button" class="is-active" data-live-map-filter="all" aria-pressed="true">All Trips</button>
              <button type="button" data-live-map-filter="completed" aria-pressed="false">Completed (11)</button>
              <button type="button" data-live-map-filter="cancelled" aria-pressed="false">Cancelled (1)</button>
              <button type="button" data-live-map-filter="month" aria-pressed="false">This Month</button>
            </div>
            <p class="live-map-filter-summary" data-live-map-filter-summary role="status" aria-live="polite">12 trips · 2 buses on this corridor</p>
          </div>
        </header>
        ${mapMarkup(false, true)}
        <aside class="live-map-legend" aria-label="Traffic flow legend"><strong>Traffic Flow</strong><span class="is-current" data-traffic-level="normal"><i class="is-normal"></i>Normal Flow</span><span data-traffic-level="moderate"><i class="is-moderate"></i>Moderate</span><span data-traffic-level="congested"><i class="is-congested"></i>Congested</span></aside>
        <div class="map-controls" aria-label="Map controls"><button type="button" data-map-control="zoom-in" aria-label="Zoom in">+</button><output data-map-zoom>100%</output><button type="button" data-map-control="zoom-out" aria-label="Zoom out">−</button><span></span><button type="button" data-map-control="reset" aria-label="Reset map position"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11a8 8 0 1 1 2.3 5.7M4 5v6h6"/></svg></button></div>
        <p class="map-attribution">Illustrative map · Not to scale</p>
      </div>`;
    const content = state === "notifications"
      ? notificationContent
      : state === "live-map"
        ? liveMapScreen()
        : state === "tickets"
          ? tripHistoryScreen()
          : state === "profile"
            ? `<div class="account-page account-profile-page">
              <section class="profile-user-card" aria-label="Account profile">
                <span class="account-avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></span>
                <div class="profile-user-copy"><strong>${escapeHtml(registrationData.username || "JockyThePythonKing")}</strong><span>${escapeHtml([accountProfile.firstName, accountProfile.middleName, accountProfile.lastName].filter(Boolean).join(" "))}</span><span class="profile-status-badge${discountVerificationStatus === "pending" ? " is-pending" : ""}">${discountVerificationStatus === "pending" ? "Pending" : "Unverified"}</span></div>
              </section>
              <button class="profile-verify-button" type="button" data-screen="verify-account">Verify Account <span aria-hidden="true">→</span></button>
              <section class="profile-menu-card" aria-labelledby="profile-security-heading">
                <h2 id="profile-security-heading">Account Security</h2>
                <details class="profile-detail-inline">
                  <summary class="profile-menu-row">Change Password <span aria-hidden="true">›</span></summary>
                  <div class="account-section-content">
                    ${profileField("password", "Password", "password")}
                    <p class="account-message account-inline-message" data-profile-message role="status" aria-live="polite"></p>
                  </div>
                </details>
                <button class="profile-menu-row profile-toggle-row is-on" type="button" data-setting-toggle role="switch" aria-checked="true" aria-label="Two-factor authentication">Two-Factor Authentication</button>
              </section>
              <section class="profile-menu-card" aria-labelledby="profile-preferences-heading">
                <h2 id="profile-preferences-heading">Preferences</h2>
                <button class="profile-menu-row profile-toggle-row is-on" type="button" data-setting-toggle role="switch" aria-checked="true" aria-label="Push notifications">Push Notifications</button>
                <button class="profile-menu-row profile-toggle-row is-on" type="button" data-setting-toggle role="switch" aria-checked="true" aria-label="Email marketing">Email Marketing</button>
              </section>
              <section class="profile-menu-card" aria-labelledby="profile-support-heading">
                <h2 id="profile-support-heading">Support</h2>
                <button class="profile-menu-row" type="button" data-screen="faq">Help Center <span aria-hidden="true">›</span></button>
              </section>
              <details class="profile-menu-card profile-extra-card">
                <summary>Customer Information <span aria-hidden="true">›</span></summary>
                <div class="profile-extra-content">
                  ${profileField("email", "Email", "email")}
                  ${profileField("contactNumber", "Contact Number", "tel")}
                  ${profileField("firstName", "First Name")}
                  ${profileField("middleName", "Middle Name")}
                  ${profileField("lastName", "Last Name")}
                  ${profileField("discountId", "Discount ID")}
                  ${profileField("address", "Address")}
                </div>
              </details>
              <details class="profile-menu-card profile-extra-card">
                <summary>Payment Options <span aria-hidden="true">›</span></summary>
                <div class="profile-extra-content account-payment-list">
                  <div class="account-payment-row"><span class="account-payment-icon">${paymentIcon("pouch")}</span><strong>U-Pouch</strong><small>₱2.00</small><button class="toggle-switch is-on account-payment-toggle" type="button" data-setting-toggle role="switch" aria-checked="true" aria-label="Enable U-Pouch"></button></div>
                  <div class="account-payment-row"><span class="account-payment-icon">${paymentIcon("wallet")}</span><strong>E-Wallet</strong><small>Unlinked</small><button class="account-payment-link" type="button" data-info="E-Wallet linking is not connected in this prototype." aria-label="Link E-Wallet">${paymentIcon("link")}</button></div>
                  <div class="account-payment-row"><span class="account-payment-icon">${paymentIcon("card")}</span><strong>Card</strong><small>Unlinked</small><button class="account-payment-link" type="button" data-info="Card linking is not connected in this prototype." aria-label="Link card">${paymentIcon("link")}</button></div>
                  <div class="account-payment-row"><span class="account-payment-icon">${paymentIcon("gcash")}</span><strong>GCash</strong><small>Unlinked</small><button class="account-payment-link" type="button" data-info="GCash linking is not connected in this prototype." aria-label="Link GCash">${paymentIcon("link")}</button></div>
                  <div class="account-payment-row"><span class="account-payment-icon">${paymentIcon("maya")}</span><strong>Maya</strong><small>Unlinked</small><button class="account-payment-link" type="button" data-info="Maya linking is not connected in this prototype." aria-label="Link Maya">${paymentIcon("link")}</button></div>
                </div>
              </details>
              <p class="account-message profile-message" data-message role="status" aria-live="polite"></p>
              <button class="profile-support-banner" type="button" data-info="Customer service is not connected in this prototype."><span>Can’t find the topic you are looking for?</span><small>24/7 Live Customer Service</small><i aria-hidden="true">?</i></button>
            </div>`
            : `<div class="faq-page">
              <section class="faq-intro">
                <h2>Got Questions?</h2>
                <label class="faq-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input type="search" data-faq-search placeholder="Search help topics..." aria-label="Search frequently asked questions"></label>
                <div class="faq-categories" aria-label="FAQ categories">
                  <button type="button" data-faq-category="transactions" aria-pressed="false"><img src="assets/3d-images/wallet.png" alt=""><span>Transactions</span></button>
                  <button type="button" data-faq-category="operations" aria-pressed="false"><img src="assets/3d-images/cone.png" alt=""><span>Operations</span></button>
                  <button type="button" data-faq-category="fares" aria-pressed="false"><img src="assets/3d-images/archery-target.png" alt=""><span>Fares</span></button>
                  <button type="button" data-faq-category="promotions" aria-pressed="false"><img src="assets/3d-images/lightning.png" alt=""><span>Promos</span></button>
                </div>
              </section>
              <section class="faq-list-section" aria-labelledby="faq-list-title">
                <h2 id="faq-list-title">Frequently Asked Questions</h2>
                <div class="faq-list" data-faq-list>
                  <details class="faq-question" data-category="transactions"><summary>What is SARAZA USAD?</summary><p>USAD is a commuter experience prototype for Saraza TRD Transport Services Corp. This demo illustrates trip information and support screens; it is not connected to live services.</p></details>
                  <details class="faq-question" data-category="fares"><summary>How is the “Smart Fare” calculated?</summary><p>Fare amounts shown in this prototype are sample values for demonstration. No live fare calculation or payment is performed.</p></details>
                  <details class="faq-question" data-category="operations"><summary>How do commuters avoid waiting for full buses?</summary><p>Check the sample seat availability shown with each ride option. Availability in this prototype is illustrative and may not reflect a real vehicle.</p></details>
                  <details class="faq-question" data-category="operations"><summary>How are drivers or conductors notified of changes?</summary><p>Notifications and service updates are represented as UI examples only. This prototype does not send messages to drivers or conductors.</p></details>
                </div>
                <p class="faq-empty" data-faq-empty hidden>No matching topics. Try a different search or category.</p>
              </section>
              <section class="faq-contact" aria-label="Contact support">
                <div><strong>Can't find the topic you're looking for?</strong><small>Customer service chat · Demo</small></div>
                <button type="button" aria-label="Contact customer support" data-info="Customer support chat is not connected in this prototype."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-11.7 6.2L4 19l1.3-3.5A7.5 7.5 0 1 1 20 11.5Z"/><path d="M9 11h.01M15 11h.01m-5 3h4"/></svg></button>
              </section>
              <p class="faq-message" data-message role="status" aria-live="polite"></p>
              <section class="faq-endcap"><img src="assets/3d-images/robot-mascot.png" alt="Smiling USAD support assistant"><h3>You've caught up to the end</h3><p>FAQs update automatically as new questions arise.<br>For now, relax and let us handle the heavy lifting.</p></section>
            </div>`;
    const isSettingsFrame = state === "profile" || state === "faq" || state === "notifications" || state === "tickets";
    const hasBrandedHeader = isSettingsFrame || state === "tickets";
    const header = state === "live-map" || state === "tickets"
      ? ""
      : state === "profile"
        ? `<header class="settings-header profile-settings-header"><div class="device-status-spacer" aria-hidden="true"></div><div class="profile-settings-title"><h1>Account Profile</h1></div></header>`
        : hasBrandedHeader
          ? `<header class="settings-header"><div class="device-status-spacer" aria-hidden="true"></div><div class="settings-title"><button type="button" class="settings-back" data-screen="${state === "faq" ? "profile" : "home"}" aria-label="${state === "faq" ? "Back to Account Information" : "Back to home"}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><h1>${titles[state]}</h1></div></header>`
          : `<header class="tab-header"><button type="button" class="round-back" data-screen="home" aria-label="Back to home">‹</button><h1>${titles[state]}</h1></header>`;
    const busPopup = state === "live-map" ? `
        <div class="modal-scrim bus-popup-scrim" data-bus-popup hidden>
          <section class="bottom-sheet quick-book-sheet bus-capacity-popup" role="dialog" aria-modal="true" aria-labelledby="bus-popup-title" tabindex="-1">
            <span class="sheet-handle"></span>
            <h2 id="bus-popup-title" data-bus-name>Bus 01</h2>
            <p class="sheet-subtitle" data-bus-route>Malolos → Trinoma</p>
            <div class="bus-popup-scroll" aria-label="Bus details and seat plan">
            <details class="bus-route-overview">
              <summary class="bus-route-overview-summary"><span><strong>Route Malolos ⇄ Trinoma</strong><small>42 mins · NLEX Express · Normal Flow</small></span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></summary>
              <div class="bus-route-overview-content">
                <div class="bus-route-overview-meta"><span>via Tabang Exit</span><span>Updated 1m ago</span></div>
                <div class="bus-route-operations">
                  <div><strong>Terminal Demand</strong><span>Tabang Bridge <b>118 pax</b></span><span>Malolos Hub <b>42 pax</b></span></div>
                  <div><strong>Fleet Deployment</strong><span>Active on Road <b>14 buses</b></span><span>Dispatched Next <b>~4 mins</b></span></div>
                </div>
                <div class="bus-next-departure"><strong data-bus-dispatch-title>Next Departure: MLS-042</strong><small data-bus-dispatch-meta>8 available seats · 3 min away</small></div>
                <p>Illustrative operations data · Not live tracking</p>
              </div>
            </details>
            <div class="route-fields bus-fleet-row">
              <label><span class="route-dot origin-dot"></span><input data-bus-fleet aria-label="Bus ID" value="MLS-042" readonly></label>
            </div>
            <label class="sheet-label">Available Seats</label>
            <div class="passenger-stepper bus-capacity-stepper"><span>Seat capacity</span><strong data-bus-seats>8</strong><small data-bus-eta>3 min away</small></div>
            <label class="sheet-label">Bus Information</label>
            <div class="payment-options bus-info-list">
              <div class="payment-option"><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg></span><span><strong>Estimated Fare</strong><small data-bus-fare>₱80.00</small></span></div>
            </div>
            <label class="sheet-label">Seat Layout</label>
            <div class="bus-seat-front"><span>FRONT</span><strong>Driver</strong></div>
            <div class="bus-popup-seat-layout" data-bus-seat-layout role="group" aria-label="Available bus seats"></div>
            <p class="bus-seat-selection" data-seat-selection aria-live="polite">Select an available seat</p>
            </div>
            <button class="sheet-primary" type="button" data-screen="live-seat-detail">View seat details <span>→</span></button>
            <p class="bus-popup-note">Illustrative demo data · Not live tracking</p>
          </section>
        </div>` : "";
    return `<div class="commuter-app secondary-tab${isSettingsFrame ? " settings-frame" : ""}"><div class="tab-scroll${isSettingsFrame ? " settings-scroll" : ""}${state === "profile" ? " profile-scroll" : ""}${state === "tickets" ? " ticket-scroll" : ""}">${header}<div class="tab-content">${content}</div></div>${isSettingsFrame && state !== "profile" && state !== "tickets" ? "" : navigation(state)}${busPopup}${state === "live-map" || isSettingsFrame ? "" : '<p class="prototype-stamp">Illustrative demo · No live service connected</p>'}</div>`;
  };

  const updateFaqResults = () => {
    const search = screen.querySelector("[data-faq-search]");
    const questions = [...screen.querySelectorAll(".faq-question")];
    const query = search?.value.trim().toLocaleLowerCase() ?? "";
    let visibleCount = 0;
    questions.forEach((question) => {
      const categoryMatches = activeFaqCategory === "all" || question.dataset.category === activeFaqCategory;
      const queryMatches = !query || question.textContent.toLocaleLowerCase().includes(query);
      question.hidden = !categoryMatches || !queryMatches;
      if (!question.hidden) visibleCount += 1;
    });
    const emptyState = screen.querySelector("[data-faq-empty]");
    if (emptyState) emptyState.hidden = visibleCount > 0;
  };

  const updateTripHistoryView = () => {
    let visibleCount = 0;
    const query = tripHistoryQuery.trim().toLocaleLowerCase();
    screen.querySelectorAll("[data-trip-filter]").forEach((button) => {
      const selected = button.dataset.tripFilter === tripHistoryFilter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    screen.querySelectorAll("[data-trip-history-card]").forEach((card) => {
      const filterMatches = tripHistoryFilter === "all"
        || card.dataset.tripStatus === tripHistoryFilter
        || (tripHistoryFilter === "month" && card.dataset.tripPeriod === "month");
      const queryMatches = !query || card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !filterMatches || !queryMatches;
      if (!card.hidden) visibleCount += 1;
    });
    const emptyState = screen.querySelector("[data-trip-history-empty]");
    if (emptyState) emptyState.hidden = visibleCount > 0;
  };

  const updateNotificationView = () => {
    const unreadCount = unreadNotificationCount();
    const count = screen.querySelector("[data-notification-unread-count]");
    const tabCount = screen.querySelector("[data-notification-unread-tab-count]");
    const markAllButton = screen.querySelector("[data-notifications-mark-all]");
    const emptyState = screen.querySelector("[data-notification-empty]");
    let visibleCount = 0;

    if (count) count.textContent = String(unreadCount);
    if (tabCount) tabCount.textContent = String(unreadCount);
    if (markAllButton) markAllButton.disabled = unreadCount === 0;
    screen.querySelectorAll("[data-notification-filter]").forEach((button) => {
      const selected = button.dataset.notificationFilter === notificationFilter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    screen.querySelectorAll("[data-notification-id]").forEach((button) => {
      const notification = notifications.find(({ id }) => id === button.dataset.notificationId);
      if (!notification) throw new Error(`Unknown notification in the inbox: ${button.dataset.notificationId}.`);
      const hidden = notificationFilter === "unread" && !notification.unread;
      button.hidden = hidden;
      if (!hidden) visibleCount += 1;
      button.classList.toggle("is-unread", notification.unread);
      button.setAttribute("aria-label", `${notification.unread ? "Mark as read: " : "Mark as unread: "}${notification.title}`);
      const unreadDot = button.querySelector(".notification-unread-dot");
      if (unreadDot) unreadDot.hidden = !notification.unread;
    });
    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
      emptyState.textContent = notificationFilter === "unread"
        ? "No unread notifications. You’re all caught up."
        : "There are no notifications yet.";
    }
  };

  const applyLiveMapTransform = () => {
    const map = screen.querySelector(".tab-map");
    const scene = screen.querySelector(".tab-map .map-scene");
    const zoomOutput = screen.querySelector("[data-map-zoom]");
    if (!map || !scene) return;
    const width = map.clientWidth;
    const height = map.clientHeight;
    const maxX = Math.max(0, (width * 1.6 * liveMapZoom - width) / 2);
    const maxY = Math.max(0, (height * 1.3 * liveMapZoom - height) / 2);
    liveMapPan.x = Math.min(maxX, Math.max(-maxX, liveMapPan.x));
    liveMapPan.y = Math.min(maxY, Math.max(-maxY, liveMapPan.y));
    scene.style.transform = `translate3d(${liveMapPan.x}px, ${liveMapPan.y}px, 0) scale(${liveMapZoom})`;
    if (zoomOutput) zoomOutput.textContent = `${Math.round(liveMapZoom * 100)}%`;
  };

  const updateLiveMapView = () => {
    const map = screen.querySelector(".tab-map");
    if (!map) return;
    map.dataset.liveFilter = liveMapFilter;
    let visibleBusCount = 0;
    const query = liveMapQuery.trim().toLocaleLowerCase();
    const showLiveFleet = liveMapFilter === "all" || liveMapFilter === "month";

    screen.querySelectorAll("[data-live-map-filter]").forEach((button) => {
      const selected = button.dataset.liveMapFilter === liveMapFilter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    screen.querySelectorAll("[data-sim-bus]").forEach((marker) => {
      const bus = liveBusDetails[Number(marker.dataset.simBus)];
      const matchesQuery = !query || [bus.name, bus.fleetId, bus.route].some((value) => value.toLocaleLowerCase().includes(query));
      marker.hidden = !showLiveFleet || !matchesQuery;
      if (!marker.hidden) visibleBusCount += 1;
    });
    const summary = screen.querySelector("[data-live-map-filter-summary]");
    if (!summary) return;
    const filterSummaries = {
      all: "12 trips · 2 buses on this corridor",
      completed: "11 completed trips · October 2024",
      cancelled: "1 cancelled trip · no active bus shown",
      month: "October 2024 · 12 trips · 18.4 kg CO₂ saved",
    };
    summary.textContent = showLiveFleet && query
      ? visibleBusCount
        ? `${visibleBusCount} matching ${visibleBusCount === 1 ? "bus" : "buses"} on this corridor`
        : "No matching buses. Try another bus code or route."
      : filterSummaries[liveMapFilter];
  };

  const stopLiveMapSimulation = () => {
    if (liveMapAnimationFrame) cancelAnimationFrame(liveMapAnimationFrame);
    liveMapAnimationFrame = 0;
  };

  const startLiveMapSimulation = () => {
    const map = screen.querySelector(".tab-map");
    const scene = map?.querySelector(".map-scene");
    const routePath = map?.querySelector(".map-roads .bus-travel-path");
    const buses = [...screen.querySelectorAll("[data-sim-bus]")];
    if (!map || !scene || !routePath || !buses.length) return;
    buses.forEach((bus) => {
      const info = liveBusDetails[Number(bus.dataset.simBus)];
      bus.setAttribute("role", "button");
      bus.setAttribute("aria-haspopup", "dialog");
      bus.setAttribute("aria-controls", "bus-popup-title");
      if (info) bus.setAttribute("aria-label", `${info.name}. ${info.route}. ${info.eta} away, ${info.seats} ${info.seats === 1 ? "seat" : "seats"} available, ${info.status.toLowerCase()}.`);
    });

    const placeOnPath = (marker, path, progress) => {
      const pathLength = path.getTotalLength();
      const distance = pathLength * progress;
      const point = path.getPointAtLength(distance);
      const nextPoint = path.getPointAtLength(Math.min(pathLength, distance + Math.max(1, pathLength * 0.002)));
      const viewBox = path.ownerSVGElement.viewBox.baseVal;
      const scale = Math.min(scene.clientWidth / viewBox.width, scene.clientHeight / viewBox.height);
      const offsetX = (scene.clientWidth - viewBox.width * scale) / 2;
      const offsetY = (scene.clientHeight - viewBox.height * scale) / 2;
      const localX = offsetX + point.x * scale;
      const localY = offsetY + point.y * scale;
      marker.style.left = `${localX / scene.offsetWidth * 100}%`;
      marker.style.top = `${localY / scene.offsetHeight * 100}%`;
      marker.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI}deg)`;
    };
    const trafficStates = ["normal", "moderate", "congested"];
    const updateTrafficState = (elapsed) => {
      const cyclePosition = elapsed % 34000;
      const state = cyclePosition < 18000 ? trafficStates[0] : cyclePosition < 28000 ? trafficStates[1] : trafficStates[2];
      map.dataset.trafficState = state;
      screen.querySelectorAll("[data-traffic-level]").forEach((item) => {
        item.classList.toggle("is-current", item.dataset.trafficLevel === state);
      });
      return state;
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      buses.forEach((bus, index) => {
        bus.style.visibility = "visible";
        placeOnPath(bus, routePath, index ? 0.68 : 0.28);
      });
      updateTrafficState(0);
      return;
    }

    const startedAt = performance.now();
    const busDuration = 28000;
    const terminalPause = 2200;
    const busCycleDuration = busDuration + terminalPause;
    const animate = (now) => {
      if (activeState !== "live-map") return;
      const elapsed = now - startedAt;
      updateTrafficState(elapsed);
      buses.forEach((bus, index) => {
        if (bus.matches(":hover, :focus-visible")) return;
        const cycleTime = (elapsed + index * busDuration * 0.48) % busCycleDuration;
        if (cycleTime >= busDuration) {
          bus.style.visibility = "hidden";
          return;
        }
        bus.style.visibility = "visible";
        const progress = cycleTime / busDuration;
        placeOnPath(bus, routePath, progress);
      });
      liveMapAnimationFrame = requestAnimationFrame(animate);
    };
    liveMapAnimationFrame = requestAnimationFrame(animate);
  };

  const renderScreen = (state, options = {}) => {
    if (welcomeTimeout) window.clearTimeout(welcomeTimeout);
    welcomeTimeout = 0;
    stopLiveMapSimulation();
    activeState = state;
    liveMapDrag = null;
    screen.replaceChildren();
    if (state === "admin-login") {
      screen.innerHTML = adminLoginScreen(adminShowError);
    } else if (state === "admin-dashboard") {
      screen.innerHTML = adminDashboardScreen();
    } else if (state === "login") {
      screen.innerHTML = loginScreen(mobileLoginShowError);
    } else if (state === "login-error") {
      mobileLoginShowError = true;
      screen.innerHTML = loginScreen(true);
    } else if (state === "register") {
      screen.innerHTML = registerScreen();
    } else if (state === "register-error") {
      screen.innerHTML = registerScreen(true, options.termsError === true);
    } else if (state === "verification") {
      screen.innerHTML = verificationScreen();
    } else if (state === "register-success") {
      screen.innerHTML = registerSuccessScreen();
    } else if (state === "home") {
      screen.innerHTML = homeScreen();
    } else if (state === "quick-book") {
      screen.innerHTML = quickBookScreen();
    } else if (state === "find-rides") {
      screen.innerHTML = rideResultsScreen();
    } else if (state === "booking-confirmation") {
      screen.innerHTML = bookingConfirmationScreen();
    } else if (state === "booking-confirmed") {
      screen.innerHTML = bookingConfirmedScreen();
    } else if (state === "verify-account") {
      screen.innerHTML = accountVerificationScreen();
    } else if (state === "live-seat-overview") {
      screen.innerHTML = liveSeatOverviewScreen();
    } else if (state === "live-seat-detail") {
      screen.innerHTML = liveSeatDetailScreen();
    } else if (state === "live-map" || state === "tickets" || state === "profile" || state === "faq" || state === "notifications") {
      screen.innerHTML = secondaryTabScreen(state);
      if (state === "live-map") {
        liveMapPan = { x: 0, y: 0 };
        liveMapZoom = 1;
        liveMapFilter = "all";
        liveMapQuery = "";
        applyLiveMapTransform();
        updateLiveMapView();
        startLiveMapSimulation();
      } else if (state === "faq") {
        activeFaqCategory = "all";
        updateFaqResults();
      } else if (state === "notifications") {
        updateNotificationView();
      } else if (state === "tickets") {
        tripHistoryFilter = "all";
        tripHistoryQuery = "";
        updateTripHistoryView();
      }
    } else if (state === "backend-error") {
      screen.innerHTML = backendErrorScreen();
    } else {
      throw new Error(`Unknown USAD prototype screen: ${state}`);
    }
    if (["home", "quick-book", "find-rides", "booking-confirmation", "booking-confirmed", "verify-account", "live-map", "live-seat-overview", "live-seat-detail", "tickets", "profile", "faq", "notifications"].includes(state)) {
      screen.firstElementChild?.classList.add("screen-enter");
    }
    enforceMinimumFontSize();
    if (state === "register-success") {
      welcomeTimeout = window.setTimeout(() => {
        if (activeState !== "register-success") return;
        screen.querySelector(".success-content")?.classList.add("is-leaving");
        welcomeTimeout = window.setTimeout(() => {
          if (activeState === "register-success") renderScreen("home");
        }, 400);
      }, 1600);
    }
  };

  const closeBottomSheet = (overlay, onClose) => {
    const sheet = overlay.querySelector(".bottom-sheet");
    if (!sheet || overlay.hidden || sheet.classList.contains("is-closing")) return;
    let closeFinished = false;
    const finishClose = () => {
      if (closeFinished) return;
      closeFinished = true;
      sheet.removeEventListener("animationend", onAnimationEnd);
      if (!overlay.isConnected) return;
      overlay.hidden = true;
      overlay.classList.remove("is-closing");
      sheet.classList.remove("is-closing");
      onClose?.();
    };
    const onAnimationEnd = (event) => {
      if (event.target === sheet && event.animationName === "bottom-sheet-dismiss") finishClose();
    };
    sheet.addEventListener("animationend", onAnimationEnd);
    overlay.classList.add("is-closing");
    sheet.classList.add("is-closing");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finishClose();
  };

  const openQuickBookOverlay = () => {
    const currentPage = screen.firstElementChild;
    if (!currentPage || screen.querySelector("[data-quick-book-overlay]")) return;
    const template = document.createElement("template");
    template.innerHTML = quickBookScreen();
    const overlay = template.content.querySelector("[data-quick-book-overlay]");
    if (!overlay) return;
    quickBookReturnFocus = document.activeElement;
    currentPage.append(overlay);
    overlay.querySelector(".bottom-sheet")?.focus();
  };

  const closeQuickBookOverlay = (overlay) => {
    closeBottomSheet(overlay, () => {
      overlay.remove();
      if (activeState === "quick-book") {
        renderScreen("home");
        return;
      }
      if (quickBookReturnFocus?.isConnected) quickBookReturnFocus.focus();
      quickBookReturnFocus = null;
    });
  };

  const closeSeatBookingOverlay = (overlay) => {
    closeBottomSheet(overlay, () => {
      if (activeState === "live-map") {
        overlay.remove();
        screen.querySelector(`[data-sim-bus="${selectedLiveBus}"]`)?.focus();
      } else {
        renderScreen("live-map");
      }
    });
  };

  const openLiveBusSeatBookingOverlay = () => {
    const busPopup = screen.querySelector("[data-bus-popup]:not([hidden])");
    const currentPage = screen.firstElementChild;
    if (!busPopup || !currentPage) return;
    const template = document.createElement("template");
    template.innerHTML = liveSeatDetailScreen();
    const bookingOverlay = template.content.querySelector("[data-seat-booking-overlay]");
    if (!bookingOverlay) return;
    closeBottomSheet(busPopup, () => {
      busPopup.remove();
      currentPage.append(bookingOverlay);
      bookingOverlay.querySelector(".bottom-sheet")?.focus();
    });
  };

  const updateCanvas = () => {
    world.style.zoom = String(zoom);
    if (currentRole === "admin") {
      world.style.left = `calc(50% - 690px + ${panX / zoom}px)`;
      world.style.top = `calc(50% - 435px + ${panY / zoom}px)`;
    } else {
      world.style.left = `calc(50% - 196.5px + ${panX / zoom}px)`;
      world.style.top = `calc(50% - 426px + ${panY / zoom}px)`;
    }
    zoomOutput.value = `${Math.round(zoom * 100)}%`;
    zoomOutput.textContent = `${Math.round(zoom * 100)}%`;
  };

  const resetCanvas = () => {
    if (currentRole === "admin") {
      const availW = Math.max(320, viewport.clientWidth - 48);
      const availH = Math.max(320, viewport.clientHeight - 48);
      const fitZoom = Math.min(1, Math.max(0.35, Math.min(availW / 1380, availH / 870)));
      zoom = Math.round(fitZoom * 20) / 20 || 0.75;
      panX = 0;
      panY = 0;
    } else {
      zoom = 1;
      panX = 0;
      panY = Math.max(0, (852 * zoom - viewport.clientHeight) / 2 + 12);
    }
    updateCanvas();
  };

  const openWorkspace = (role = "user") => {
    currentRole = role;
    rolePage.hidden = true;
    workspacePage.hidden = false;
    roleNote.textContent = "";
    if (workspaceRoleLabel) {
      workspaceRoleLabel.textContent = role === "admin" ? "Admin" : "User";
    }
    if (role === "admin") {
      world.classList.add("is-admin");
      screen.classList.add("is-admin");
      adminShowError = false;
      renderScreen("admin-login");
    } else {
      world.classList.remove("is-admin");
      screen.classList.remove("is-admin");
      mobileLoginShowError = false;
      renderScreen("login");
    }
    resetCanvas();
    viewport.focus({ preventScroll: true });
  };

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      openWorkspace(button.dataset.open);
    });
  });

  backButton.addEventListener("click", () => {
    workspacePage.hidden = true;
    rolePage.hidden = false;
    world.classList.remove("is-admin");
    screen.classList.remove("is-admin");
    const target = document.querySelector(`[data-open="${currentRole}"]`) ?? document.querySelector('[data-open="user"]');
    target?.focus();
  });

  document.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const multiplier = button.dataset.zoom === "in" ? 1.12 : 1 / 1.12;
      const nextZoom = Math.min(1.25, Math.max(0.35, zoom * multiplier));
      zoom = nextZoom;
      updateCanvas();
    });
  });

  fitButton.addEventListener("click", resetCanvas);

  viewport.addEventListener("wheel", (event) => {
    if (event.target.closest("#phone-screen")) return;
    event.preventDefault();
    const multiplier = event.deltaY < 0 ? 1.08 : 1 / 1.08;
    const bounds = viewport.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left - bounds.width / 2;
    const pointerY = event.clientY - bounds.top - bounds.height / 2;
    const nextZoom = Math.min(1.25, Math.max(0.35, zoom * multiplier));
    const ratio = nextZoom / zoom;
    panX = pointerX - (pointerX - panX) * ratio;
    panY = pointerY - (pointerY - panY) * ratio;
    zoom = nextZoom;
    updateCanvas();
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target !== viewport) return;
    dragOrigin = { x: event.clientX - panX, y: event.clientY - panY, pointerId: event.pointerId };
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragOrigin || dragOrigin.pointerId !== event.pointerId) return;
    panX = event.clientX - dragOrigin.x;
    panY = event.clientY - dragOrigin.y;
    updateCanvas();
  });

  const stopDragging = (event) => {
    if (!dragOrigin || (event && dragOrigin.pointerId !== event.pointerId)) return;
    dragOrigin = null;
    viewport.classList.remove("is-dragging");
  };

  viewport.addEventListener("pointerup", stopDragging);
  viewport.addEventListener("pointercancel", stopDragging);
  viewport.addEventListener("lostpointercapture", stopDragging);

  viewport.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 80 : 40;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (event.key === "ArrowLeft") panX += step;
      if (event.key === "ArrowRight") panX -= step;
      if (event.key === "ArrowUp") panY += step;
      if (event.key === "ArrowDown") panY -= step;
      updateCanvas();
    } else if (event.key === "+" || event.key === "=") {
      zoom = Math.min(1.25, zoom * 1.12);
      updateCanvas();
    } else if (event.key === "-") {
      zoom = Math.max(0.35, zoom / 1.12);
      updateCanvas();
    } else if (event.key === "Home") {
      resetCanvas();
    }
  });

  screen.addEventListener("pointerdown", (event) => {
    const map = event.target.closest(".tab-map");
    if (activeState !== "live-map" || !map || event.button !== 0 || event.target.closest(".map-controls, .map-live-card, .live-map-header, .live-map-legend, .live-operations-panel, [data-sim-bus], [data-bus-popup]")) return;
    liveMapDrag = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      panX: liveMapPan.x,
      panY: liveMapPan.y,
    };
    map.classList.add("is-dragging");
    map.setPointerCapture(event.pointerId);
  });

  screen.addEventListener("pointermove", (event) => {
    if (!liveMapDrag || liveMapDrag.pointerId !== event.pointerId) return;
    liveMapPan.x = liveMapDrag.panX + (event.clientX - liveMapDrag.originX) / zoom;
    liveMapPan.y = liveMapDrag.panY + (event.clientY - liveMapDrag.originY) / zoom;
    applyLiveMapTransform();
  });

  const stopLiveMapDrag = (event) => {
    if (!liveMapDrag || (event && liveMapDrag.pointerId !== event.pointerId)) return;
    liveMapDrag = null;
    screen.querySelector(".tab-map")?.classList.remove("is-dragging");
  };

  screen.addEventListener("pointerup", stopLiveMapDrag);
  screen.addEventListener("pointercancel", stopLiveMapDrag);
  screen.addEventListener("lostpointercapture", stopLiveMapDrag);

  screen.addEventListener("wheel", (event) => {
    if (activeState !== "live-map" || !event.target.closest(".tab-map") || event.target.closest(".live-map-header, .live-map-legend, .live-operations-panel, .map-controls")) return;
    event.preventDefault();
    event.stopPropagation();
    liveMapZoom = Math.min(2.4, Math.max(1, liveMapZoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12)));
    applyLiveMapTransform();
  }, { passive: false });

  screen.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const quickBookOverlay = screen.querySelector("[data-quick-book-overlay]");
      if (quickBookOverlay) {
        closeQuickBookOverlay(quickBookOverlay);
        return;
      }
    }
    if (event.key === "Escape" && (activeState === "live-map" || activeState === "live-seat-detail")) {
      const bookingOverlay = screen.querySelector("[data-seat-booking-overlay]");
      if (bookingOverlay) {
        closeSeatBookingOverlay(bookingOverlay);
      }
      return;
    }
    const busMarker = event.target.closest("[data-sim-bus]");
    if (busMarker && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      busMarker.click();
      return;
    }
    if (event.key === "Escape" && activeState === "live-map") {
      const popup = screen.querySelector("[data-bus-popup]:not([hidden])");
      if (popup) {
        closeBottomSheet(popup, () => screen.querySelector(`[data-sim-bus="${selectedLiveBus}"]`)?.focus());
        return;
      }
    }
    if (activeState !== "live-map" || !event.target.closest(".tab-map")) return;
    const panStep = event.shiftKey ? 80 : 36;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (event.key === "ArrowLeft") liveMapPan.x += panStep;
      if (event.key === "ArrowRight") liveMapPan.x -= panStep;
      if (event.key === "ArrowUp") liveMapPan.y += panStep;
      if (event.key === "ArrowDown") liveMapPan.y -= panStep;
      applyLiveMapTransform();
    } else if (event.key === "+" || event.key === "=") {
      liveMapZoom = Math.min(2.4, liveMapZoom * 1.15);
      applyLiveMapTransform();
    } else if (event.key === "-") {
      liveMapZoom = Math.max(1, liveMapZoom / 1.15);
      applyLiveMapTransform();
    } else if (event.key === "Home") {
      liveMapPan = { x: 0, y: 0 };
      liveMapZoom = 1;
      applyLiveMapTransform();
    }
  });

  screen.addEventListener("submit", (event) => {
    if (event.target.matches("[data-admin-login-form]")) {
      event.preventDefault();
      const emailInput = screen.querySelector("#admin-email");
      const passwordInput = screen.querySelector("#admin-password");
      if (!emailInput || !passwordInput) return;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      if (!email || !password) {
        adminShowError = true;
        renderScreen("admin-login");
        screen.querySelector("#admin-email")?.focus();
        return;
      }
      adminShowError = false;
      renderScreen("admin-dashboard");
      return;
    }

    if (event.target.matches("[data-admin-assign-form]")) {
      event.preventDefault();
      const busVal = screen.querySelector("#assign-bus")?.value ?? "Bus 01";
      const driverVal = screen.querySelector("#assign-driver")?.value?.trim() || "Assigned Driver";
      const routeVal = screen.querySelector("#assign-route")?.value || "Trinoma Express";
      const targetBus = adminFleetData.find((b) => b.busNo.toLowerCase() === busVal.toLowerCase() || b.id.toLowerCase() === busVal.toLowerCase().replace(" ", "-"));
      if (targetBus) {
        targetBus.driver = driverVal;
        targetBus.route = routeVal;
        targetBus.status = "On Duty";
        targetBus.statusClass = "on-duty";
        targetBus.dot = "green";
        targetBus.filterCategory = "on-duty";
      }
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const tbody = screen.querySelector("#admin-fleet-tbody");
      if (tbody) tbody.innerHTML = renderAdminFleetRows();
      return;
    }

    if (event.target.matches("[data-login-form]")) {
      event.preventDefault();
      const email = screen.querySelector("#login-email");
      const emailError = screen.querySelector("#email-error");
      const password = screen.querySelector("#login-password");
      const passwordError = screen.querySelector("#login-password-error");
      if (!email || !emailError || !password || !passwordError) {
        throw new Error("USAD login could not validate the form: a required field or error message is missing.");
      }
      if (!email.value.trim() || !email.validity.valid) {
        email.setAttribute("aria-invalid", "true");
        emailError.hidden = false;
        email.focus();
        return;
      }
      if (!password.value) {
        password.setAttribute("aria-invalid", "true");
        passwordError.hidden = false;
        password.focus();
        return;
      }
      const localPart = email.value.trim().split("@")[0];
      registrationData = {
        username: localPart.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
        email: email.value.trim(),
      };
      accountProfile.email = registrationData.email;
      renderScreen("home");
      return;
    }

    if (event.target.matches("[data-register-form]")) {
      event.preventDefault();
      const username = screen.querySelector("#register-username");
      const email = screen.querySelector("#register-email");
      const password = screen.querySelector("#register-password");
      const confirmPassword = screen.querySelector("#register-confirm-password");
      const termsAccepted = screen.querySelector("#terms-accepted");
      if (!username || !email || !password || !confirmPassword || !termsAccepted) {
        throw new Error("USAD registration could not validate the form: a required field or consent checkbox is missing.");
      }
      const hasEmptyField = !username.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value;
      const invalidEmail = email ? !email.validity.valid : true;
      const weakPassword = password ? !/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password.value) : true;
      const mismatch = password && confirmPassword ? password.value !== confirmPassword.value : true;
      const termsError = !termsAccepted.checked;

      if (hasEmptyField || invalidEmail || weakPassword || mismatch || termsError) {
        renderScreen("register-error", { termsError });
        const restoredUsername = screen.querySelector("#register-username");
        const restoredEmail = screen.querySelector("#register-email");
        const restoredPassword = screen.querySelector("#register-password");
        const restoredConfirmPassword = screen.querySelector("#register-confirm-password");
        const restoredTermsAccepted = screen.querySelector("#terms-accepted");
        if (restoredUsername) restoredUsername.value = username.value;
        if (restoredEmail) restoredEmail.value = email.value;
        if (restoredPassword) restoredPassword.value = password.value;
        if (restoredConfirmPassword) restoredConfirmPassword.value = confirmPassword.value;
        if (restoredTermsAccepted) restoredTermsAccepted.checked = termsAccepted.checked;
        screen.querySelector(".form-alert")?.focus({ preventScroll: true });
        return;
      }

      registrationData = {
        username: username.value.trim(),
        email: email.value.trim(),
      };
      accountProfile.email = registrationData.email;

      renderScreen("verification");
    }

    if (event.target.matches("[data-verification-form]")) {
      event.preventDefault();
      renderScreen("register-success");
      return;
    }

    if (event.target.matches("[data-route-search]")) {
      event.preventDefault();
      if (activeState === "tickets") {
        tripHistoryQuery = String(new FormData(event.target).get("destination") ?? "");
        updateTripHistoryView();
        return;
      }
      const destination = new FormData(event.target).get("destination");
      if (typeof destination === "string" && destination.trim()) {
        tripData.destination = destination.trim();
        renderScreen("find-rides");
      } else {
        openQuickBookOverlay();
      }
      return;
    }

    if (event.target.matches("[data-quick-book]")) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const origin = formData.get("origin");
      const destination = formData.get("destination");
      const payment = formData.get("payment");
      const passengerText = screen.querySelector("#passenger-count")?.textContent ?? "1";
      const passengers = Number.parseInt(passengerText, 10);
      if (typeof origin !== "string" || !origin.trim() || typeof destination !== "string" || !destination.trim() || !Number.isInteger(passengers) || passengers < 1 || typeof payment !== "string") {
        throw new Error("USAD quick booking could not continue: route, passenger, or payment selection is invalid.");
      }
      tripData = { ...tripData, origin: origin.trim(), destination: destination.trim(), passengers, payment };
      bookingConfirmed = false;
      renderScreen("find-rides");
    }

    if (event.target.matches("[data-admin-add-staff-form]")) {
      event.preventDefault();
      const nameIn = screen.querySelector("#new-staff-name");
      const roleIn = screen.querySelector("#new-staff-role");
      const depotIn = screen.querySelector("#new-staff-depot");
      const busIn = screen.querySelector("#new-staff-bus");
      const rateIn = screen.querySelector("#new-staff-rate");

      const name = nameIn?.value.trim() || "New Staff Member";
      const role = roleIn?.value || "Driver";
      const depot = depotIn?.value || "Trinoma Hub";
      const busNo = busIn?.value.trim() || "-";
      const rate = rateIn?.value.trim() || "$4.50";
      const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "ST";
      const code = `A0${Math.floor(Math.random() * 8 + 1)}DSGN${Math.floor(Math.random() * 900 + 100)} • ${role === "Driver" ? "DRV" : role === "Dispatcher" ? "DSP" : "MNT"}`;

      adminStaffMembersData.unshift({
        id: `staff-${Date.now()}`,
        name,
        staffId: code,
        initials,
        avatarClass: "",
        role,
        roleKey: role.toLowerCase(),
        busNo,
        depot,
        rate,
        maxHours: "8 hrs",
        status: "On Duty",
        statusKey: "on-duty",
        statusClass: "on-duty"
      });

      screen.querySelector(".admin-modal-backdrop")?.remove();
      const tbody = screen.querySelector("#staff-table-tbody");
      if (tbody) tbody.innerHTML = renderStaffTableRows();
      return;
    }

    if (event.target.matches("[data-cctv-add-feed-form]")) {
      event.preventDefault();
      const title = screen.querySelector("#new-cam-title")?.value?.trim() || "New Camera Unit";
      const corridor = screen.querySelector("#new-cam-corridor")?.value || "trinoma";
      const nextNum = adminCameraFeedsData.length + 1;
      adminCameraFeedsData.unshift({
        id: `cam-${Date.now()}`,
        code: `CAM ${nextNum}.1/ws`,
        title,
        corridor,
        corridorLabel: corridor === "trinoma" ? "Trinoma Hub" : corridor === "fleet" ? "Fleet Onboard" : corridor === "edsa" ? "EDSA Corridor" : "Depot Bays",
        image: "assets/cctv/cam1.jpg",
        status: "LIVE",
        resolution: "1080p60",
        bitrate: "4.2 Mbps",
        latency: "12ms",
        uptime: "0h 01m",
        fps: 60,
        sensorHealth: "Optimal",
        temp: "39°C",
        aiDetections: []
      });
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const grid = screen.querySelector("#cctv-grid-container");
      if (grid) grid.innerHTML = renderCameraFeedsGrid();
      return;
    }

    if (event.target.matches("[data-admin-generate-report-form]")) {
      event.preventDefault();
      const title = screen.querySelector("#rep-gen-title")?.value?.trim() || "Operational Audit Report";
      const category = screen.querySelector("#rep-gen-category")?.value || "financial";
      const corridor = screen.querySelector("#rep-gen-corridor")?.value || "All Corridors";
      const period = screen.querySelector("#rep-gen-period")?.value || "Month to Date";
      const format = screen.querySelector("#rep-gen-format")?.value || "PDF";
      const nextNum = 1048 + adminReportsData.length - 5;
      const newRep = {
        id: `REP-2026-${nextNum}`,
        title,
        corridor,
        category,
        categoryLabel: category === "financial" ? "Revenue & Finance" : category === "otp" ? "Fleet & Headway" : category === "crew" ? "Crew & Personnel" : "Fuel & Maintenance",
        period: `${period} (Verified)`,
        primaryMetric: category === "financial" ? "₱385,420 Fare Rev" : category === "otp" ? "93.4% On-Time" : category === "crew" ? "100% Shift Fill" : "3.48 km/L Fleet Avg",
        secondaryMetric: "Automated Data Ingestion",
        status: "Finalized",
        statusClass: "completed",
        format,
        fileSize: format === "PDF" ? "1.8 MB" : format === "CSV" ? "240 KB" : "860 KB",
        author: "Jocky Cabataña"
      };
      adminReportsData.unshift(newRep);
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const tbody = screen.querySelector("#reports-table-tbody");
      if (tbody) tbody.innerHTML = renderReportsTableRows();
      return;
    }
  });

  screen.addEventListener("input", (event) => {
    if (event.target.matches("[data-report-search]")) {
      reportsSearchQuery = event.target.value;
      const tbody = screen.querySelector("#reports-table-tbody");
      if (tbody) tbody.innerHTML = renderReportsTableRows();
    }

    if (event.target.matches("[data-cctv-search]")) {
      cameraSearchQuery = event.target.value;
      const grid = screen.querySelector("#cctv-grid-container");
      if (grid) grid.innerHTML = renderCameraFeedsGrid();
    }

    if (event.target.matches("[data-staff-search]")) {
      staffSearchQuery = event.target.value;
      const tbody = screen.querySelector("#staff-table-tbody");
      if (tbody) tbody.innerHTML = renderStaffTableRows();
    }

    if (event.target.matches("[data-staff-per-page]")) {
      staffPerPage = Number(event.target.value);
      const tbody = screen.querySelector("#staff-table-tbody");
      if (tbody) tbody.innerHTML = renderStaffTableRows();
    }

    if (event.target.matches("[data-faq-search]")) {
      updateFaqResults();
    }

    if (event.target.matches("[data-trip-history-search]")) {
      tripHistoryQuery = event.target.value;
      updateTripHistoryView();
    }

    if (event.target.matches("[data-live-map-search]")) {
      liveMapQuery = event.target.value;
      updateLiveMapView();
    }

    if (event.target.matches("[data-admin-fleet-search]")) {
      fleetSearchQuery = event.target.value;
      const tbody = screen.querySelector("#admin-fleet-tbody");
      if (tbody) tbody.innerHTML = renderAdminFleetRows();
    }

    if (event.target.matches("[data-analytics-scale]")) {
      predictiveTransitLoadScale = Number(event.target.value);
      const display = screen.querySelector("#scale-val-display");
      if (display) display.textContent = `${predictiveTransitLoadScale}%`;
      const barsContainer = screen.querySelector("#analytics-bars-container");
      if (barsContainer) barsContainer.innerHTML = renderForecastBars();
      const metricsContainer = screen.querySelector("#analytics-metrics-container");
      if (metricsContainer) metricsContainer.innerHTML = renderPredictiveStats();
    }

    if (event.target.matches("#admin-email, #admin-password")) {
      event.target.removeAttribute("aria-invalid");
      const alert = screen.querySelector("#admin-auth-alert");
      if (alert) alert.hidden = true;
    }

    if (event.target.matches("#login-email, #login-password")) {
      const emailError = screen.querySelector("#email-error");
      const passwordError = screen.querySelector("#login-password-error");
      if (event.target.id === "login-email" && emailError) emailError.hidden = true;
      if (event.target.id === "login-password" && passwordError) passwordError.hidden = true;
      event.target.removeAttribute("aria-invalid");
      const formAlert = screen.querySelector(".form-alert");
      if (formAlert) formAlert.remove();
      const loginForm = screen.querySelector(".login-form");
      if (loginForm) loginForm.classList.remove("is-error");
      mobileLoginShowError = false;
      const toggleBtn = screen.querySelector('[data-mobile-action="toggle-error"]');
      if (toggleBtn) toggleBtn.textContent = "Show Error Banner";
    }

    if (event.target.matches("#register-email, #register-username, #register-password, #register-confirm-password")) {
      event.target.removeAttribute("aria-invalid");
      const fieldError = screen.querySelector(`#${event.target.id}-error`);
      if (fieldError) fieldError.hidden = true;
    }

    if (event.target.matches("[data-profile-field]")) {
      event.target.removeAttribute("aria-invalid");
      const message = event.target.closest(".account-section")?.querySelector("[data-profile-message]");
      if (message) message.textContent = "";
    }
  });

  screen.addEventListener("change", (event) => {
    if (event.target.matches("#live-seat-picker")) {
      selectedBusSeatId = event.target.value;
    }

    if (event.target.matches("[data-discount-id-upload]")) {
      const file = event.target.files?.[0];
      const side = event.target.dataset.discountIdUpload;
      if (!file || !(side in discountVerificationFiles)) return;
      const previousFile = discountVerificationFiles[side];
      if (previousFile?.previewUrl) URL.revokeObjectURL(previousFile.previewUrl);
      discountVerificationFiles[side] = {
        name: file.name,
        type: file.type,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      };
      discountVerificationMessage = "";
      renderScreen("verify-account");
      return;
    }

    if (event.target.matches("[data-verification-confirmed]")) {
      discountVerificationConfirmed = event.target.checked;
      const submitButton = screen.querySelector('[data-verification-action="submit"]');
      if (submitButton) submitButton.disabled = !discountVerificationConfirmed;
      return;
    }

    if (event.target.matches("[data-admin-corridor]")) {
      activeCorridorFilter = event.target.value;
    }

    if (event.target.matches("[data-cctv-filter]")) {
      activeCameraCorridorFilter = event.target.value;
      const grid = screen.querySelector("#cctv-grid-container");
      if (grid) grid.innerHTML = renderCameraFeedsGrid();
    }

    if (event.target.matches("[data-analytics-profile]")) {
      predictiveOperatingProfile = event.target.value;
    }

    if (event.target.matches("[data-dispatch-note]")) {
      dispatchNoteInput = event.target.value;
    }

    if (event.target.matches("[data-report-date-range]")) {
      activeReportsDateRange = event.target.value;
      const tbody = screen.querySelector("#reports-table-tbody");
      if (tbody) tbody.innerHTML = renderReportsTableRows();
    }

    if (event.target.matches("[data-report-corridor]")) {
      activeReportsCorridor = event.target.value;
      const tbody = screen.querySelector("#reports-table-tbody");
      if (tbody) tbody.innerHTML = renderReportsTableRows();
    }

    if (event.target.matches("#terms-accepted") && event.target.checked) {
      event.target.removeAttribute("aria-invalid");
      const termsError = screen.querySelector("#terms-error");
      if (termsError) termsError.hidden = true;
    }
  });

  screen.addEventListener("click", (event) => {
    const repCatBtn = event.target.closest("[data-report-category]");
    if (repCatBtn) {
      activeReportsCategoryFilter = repCatBtn.dataset.reportCategory;
      screen.querySelectorAll("[data-report-category]").forEach((b) => {
        b.classList.toggle("is-active", b === repCatBtn);
      });
      const tbody = screen.querySelector("#reports-table-tbody");
      if (tbody) tbody.innerHTML = renderReportsTableRows();
      return;
    }

    const repActionBtn = event.target.closest("[data-report-action]");
    if (repActionBtn) {
      const { reportAction } = repActionBtn.dataset;
      const repId = repActionBtn.dataset.reportId;
      const schedId = repActionBtn.dataset.schedId;
      if (reportAction === "generate") {
        openAdminModal("generate-report");
      } else if (reportAction === "view") {
        openAdminModal(`view-report-${repId}`);
      } else if (reportAction === "download") {
        openAdminModal(`download-report-${repId}`);
      } else if (reportAction === "run-scheduled") {
        openAdminModal(`run-scheduled-${schedId}`);
      }
      return;
    }

    const adminActionBtn = event.target.closest("[data-admin-action]");
    if (adminActionBtn) {
      const { adminAction } = adminActionBtn.dataset;
      if (adminAction === "forgot-password") {
        openAdminModal("forgot-password");
      } else if (adminAction === "autofill-demo") {
        const emailInput = screen.querySelector("#admin-email");
        const passwordInput = screen.querySelector("#admin-password");
        if (emailInput) {
          emailInput.value = "admin@saraza.com";
          emailInput.removeAttribute("aria-invalid");
        }
        if (passwordInput) {
          passwordInput.value = "AdminPass123!";
          passwordInput.removeAttribute("aria-invalid");
        }
        adminShowError = false;
        const alert = screen.querySelector("#admin-auth-alert");
        if (alert) alert.hidden = true;
      } else if (adminAction === "toggle-error") {
        adminShowError = !adminShowError;
        renderScreen("admin-login");
      } else if (adminAction === "sign-out") {
        screen.querySelector(".admin-modal-backdrop")?.remove();
        adminShowError = false;
        renderScreen("admin-login");
      } else if (adminAction === "open-assign") {
        openAdminModal("assign-dispatch");
      } else if (adminAction === "user-menu") {
        openAdminModal("user-menu");
      } else if (adminAction === "export-surge") {
        openAdminModal("export-surge");
      } else if (adminAction === "approve-redistribution") {
        openAdminModal("approve-redistribution");
      } else if (adminAction === "simulate-surge") {
        openAdminModal("simulate-surge");
      } else if (adminAction === "prev-page" || adminAction === "next-page") {
        // Prototype pagination indicator
        const pageSpan = screen.querySelector(".admin-pagination span");
        if (pageSpan) {
          pageSpan.textContent = adminAction === "prev-page" ? "Page 1 of 4" : "Page 2 of 4";
        }
      }
      return;
    }

    const mobileActionBtn = event.target.closest("[data-mobile-action]");
    if (mobileActionBtn) {
      const { mobileAction } = mobileActionBtn.dataset;
      if (mobileAction === "autofill-demo") {
        const emailInput = screen.querySelector("#login-email");
        const passwordInput = screen.querySelector("#login-password");
        if (emailInput) {
          emailInput.value = "jocky@saraza.com";
          emailInput.removeAttribute("aria-invalid");
        }
        if (passwordInput) {
          passwordInput.value = "Password123!";
          passwordInput.removeAttribute("aria-invalid");
        }
        const emailError = screen.querySelector("#email-error");
        const passwordError = screen.querySelector("#login-password-error");
        if (emailError) emailError.hidden = true;
        if (passwordError) passwordError.hidden = true;
        const formAlert = screen.querySelector(".form-alert");
        if (formAlert) formAlert.remove();
        const loginForm = screen.querySelector(".login-form");
        if (loginForm) loginForm.classList.remove("is-error");
        mobileLoginShowError = false;
        const toggleBtn = screen.querySelector('[data-mobile-action="toggle-error"]');
        if (toggleBtn) toggleBtn.textContent = "Show Error Banner";
      } else if (mobileAction === "toggle-error") {
        mobileLoginShowError = !mobileLoginShowError;
        renderScreen(mobileLoginShowError ? "login-error" : "login");
      }
      return;
    }

    const scrubBtn = event.target.closest("[data-scrub-hour]");
    if (scrubBtn) {
      predictiveSelectedHour = Number(scrubBtn.dataset.scrubHour);
      screen.querySelectorAll("[data-scrub-hour]").forEach((btn) => {
        btn.classList.toggle("is-active", Number(btn.dataset.scrubHour) === predictiveSelectedHour);
      });
      const barsContainer = screen.querySelector("#analytics-bars-container");
      if (barsContainer) barsContainer.innerHTML = renderForecastBars();
      const metricsContainer = screen.querySelector("#analytics-metrics-container");
      if (metricsContainer) metricsContainer.innerHTML = renderPredictiveStats();
      return;
    }

    const chartCol = event.target.closest("[data-chart-hour]");
    if (chartCol) {
      predictiveSelectedHour = Number(chartCol.dataset.chartHour);
      screen.querySelectorAll("[data-scrub-hour]").forEach((btn) => {
        btn.classList.toggle("is-active", Number(btn.dataset.scrubHour) === predictiveSelectedHour);
      });
      const barsContainer = screen.querySelector("#analytics-bars-container");
      if (barsContainer) barsContainer.innerHTML = renderForecastBars();
      const metricsContainer = screen.querySelector("#analytics-metrics-container");
      if (metricsContainer) metricsContainer.innerHTML = renderPredictiveStats();
      return;
    }

    const fleetFilterBtn = event.target.closest("[data-admin-fleet-filter]");
    if (fleetFilterBtn) {
      activeFleetFilter = fleetFilterBtn.dataset.adminFleetFilter;
      screen.querySelectorAll("[data-admin-fleet-filter]").forEach((btn) => {
        btn.classList.toggle("is-active", btn === fleetFilterBtn);
      });
      const tbody = screen.querySelector("#admin-fleet-tbody");
      if (tbody) tbody.innerHTML = renderAdminFleetRows();
      return;
    }

    const telemetryBtn = event.target.closest("[data-admin-telemetry]");
    if (telemetryBtn) {
      openAdminModal(`telemetry-${telemetryBtn.dataset.adminTelemetry}`);
      return;
    }

    const telemetryTab = event.target.closest("[data-telemetry-tab]");
    if (telemetryTab) {
      dispatchTelemetryFilter = telemetryTab.dataset.telemetryTab;
      screen.querySelectorAll("[data-telemetry-tab]").forEach((tab) => {
        tab.classList.toggle("is-active", tab === telemetryTab);
      });
      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      return;
    }

    const selectBusRow = event.target.closest("[data-select-bus]");
    if (selectBusRow) {
      selectedDispatchBusId = selectBusRow.dataset.selectBus;
      screen.querySelectorAll("[data-select-bus]").forEach((r) => {
        r.classList.toggle("is-selected", r === selectBusRow);
      });
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = renderDispatchControlPanel();
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    const mapBus = event.target.closest("[data-map-bus]");
    if (mapBus) {
      selectedDispatchBusId = mapBus.dataset.mapBus;
      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = renderDispatchControlPanel();
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    const corridorFilterBtn = event.target.closest("[data-corridor-filter]");
    if (corridorFilterBtn) {
      dispatchCorridorFilter = corridorFilterBtn.dataset.corridorFilter;
      screen.querySelectorAll("[data-corridor-filter]").forEach((btn) => {
        btn.classList.toggle("is-active", btn === corridorFilterBtn);
      });
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    const mapZoomBtn = event.target.closest("[data-map-zoom]");
    if (mapZoomBtn) {
      const zoom = mapZoomBtn.dataset.mapZoom;
      if (zoom === "in") dispatchMapZoom = Math.min(1.8, Math.round((dispatchMapZoom + 0.15) * 100) / 100);
      else if (zoom === "out") dispatchMapZoom = Math.max(0.7, Math.round((dispatchMapZoom - 0.15) * 100) / 100);
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    if (event.target.closest("[data-map-layers]")) {
      dispatchLayersActive = !dispatchLayersActive;
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    const dispatchActionBtn = event.target.closest("[data-dispatch-action]");
    if (dispatchActionBtn) {
      const action = dispatchActionBtn.dataset.dispatchAction;
      const unit = fleetDispatchTelemetryUnits.find((u) => u.id === selectedDispatchBusId) || fleetDispatchTelemetryUnits[0];
      const textarea = screen.querySelector("[data-dispatch-note]");

      if (action === "reroute") {
        dispatchNoteInput = `[Detour Order] Route via Shaw Blvd / C-5 service bypass to recover +8m headway gap.`;
        if (textarea) {
          textarea.value = dispatchNoteInput;
          textarea.focus();
        }
      } else if (action === "hold") {
        dispatchNoteInput = `[Headway Hold] Hold at SM North Edsa Terminal Bay 2 for 4 min to normalize spacing with Bus 02.`;
        if (textarea) {
          textarea.value = dispatchNoteInput;
          textarea.focus();
        }
      } else if (action === "recall") {
        dispatchNoteInput = `[Depot Recall] Immediate return to Saraza Central Depot for telemetry diagnostic inspection.`;
        if (textarea) {
          textarea.value = dispatchNoteInput;
          textarea.focus();
        }
      } else if (action === "assign-driver") {
        openAdminModal(`assign-driver-unit-${unit.id}`);
      } else if (action === "send-order") {
        openAdminModal(`dispatch-order-sent-${unit.id}`);
        dispatchNoteInput = "";
        if (textarea) textarea.value = "";
      }
      return;
    }

    const confirmCrewBtn = event.target.closest("[data-admin-confirm-crew]");
    if (confirmCrewBtn) {
      const busId = confirmCrewBtn.dataset.adminConfirmCrew;
      const unit = fleetDispatchTelemetryUnits.find((u) => u.id === busId);
      const driverIn = screen.querySelector("#reassign-driver-input");
      const conductorIn = screen.querySelector("#reassign-conductor-input");
      if (unit && driverIn && driverIn.value.trim()) {
        unit.driverName = driverIn.value.trim();
      }
      if (unit && conductorIn && conductorIn.value.trim()) {
        unit.conductorName = conductorIn.value.trim();
      }
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = renderDispatchControlPanel();
      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      return;
    }

    const staffRoleFilter = event.target.closest("[data-staff-role-filter]");
    if (staffRoleFilter) {
      activeStaffRoleFilter = staffRoleFilter.dataset.staffRoleFilter;
      screen.querySelectorAll("[data-staff-role-filter]").forEach((btn) => {
        btn.classList.toggle("is-active", btn === staffRoleFilter);
      });
      const tbody = screen.querySelector("#staff-table-tbody");
      if (tbody) tbody.innerHTML = renderStaffTableRows();
      return;
    }

    const staffActionBtn = event.target.closest("[data-staff-action]");
    if (staffActionBtn) {
      const action = staffActionBtn.dataset.staffAction;
      if (action === "export-csv") {
        openAdminModal("export-staff-csv");
      } else if (action === "add-staff") {
        openAdminModal("add-staff");
      } else if (action === "open-menu") {
        const staffId = staffActionBtn.dataset.staffId;
        openAdminModal(`staff-detail-${staffId}`);
      } else if (action === "toggle-depot-filter") {
        if (staffDepotFilter === "all") staffDepotFilter = "Trinoma";
        else if (staffDepotFilter === "Trinoma") staffDepotFilter = "Malolos";
        else staffDepotFilter = "all";
        renderScreen("admin-dashboard");
      }
      return;
    }

    const staffCheckbox = event.target.closest("[data-staff-checkbox]");
    if (staffCheckbox) {
      const id = staffCheckbox.dataset.staffCheckbox;
      if (staffCheckbox.checked) {
        staffSelectedRows.add(id);
      } else {
        staffSelectedRows.delete(id);
      }
      const row = screen.querySelector(`[data-staff-row="${id}"]`);
      if (row) {
        const isChecked = staffSelectedRows.has(id);
        row.classList.toggle("is-selected", isChecked);
        const avatar = row.querySelector(".staff-avatar");
        if (avatar) avatar.classList.toggle("is-selected", isChecked);
      }
      return;
    }

    const staffRow = event.target.closest("[data-staff-row]");
    if (staffRow && !event.target.closest("[data-staff-action]") && !event.target.closest("[data-staff-checkbox]")) {
      const id = staffRow.dataset.staffRow;
      if (staffSelectedRows.has(id)) {
        staffSelectedRows.delete(id);
      } else {
        staffSelectedRows.add(id);
      }
      const isChecked = staffSelectedRows.has(id);
      staffRow.classList.toggle("is-selected", isChecked);
      const checkbox = staffRow.querySelector("[data-staff-checkbox]");
      if (checkbox) checkbox.checked = isChecked;
      const avatar = staffRow.querySelector(".staff-avatar");
      if (avatar) avatar.classList.toggle("is-selected", isChecked);
      return;
    }

    const staffCheckAll = event.target.closest("[data-staff-check-all]");
    if (staffCheckAll) {
      const isChecked = staffCheckAll.checked;
      adminStaffMembersData.forEach((s) => {
        if (isChecked) staffSelectedRows.add(s.id);
        else staffSelectedRows.delete(s.id);
      });
      const tbody = screen.querySelector("#staff-table-tbody");
      if (tbody) tbody.innerHTML = renderStaffTableRows();
      return;
    }

    const staffQuickStatus = event.target.closest("[data-staff-quick-status]");
    if (staffQuickStatus) {
      const sId = staffQuickStatus.dataset.staffQuickStatus;
      const s = adminStaffMembersData.find((m) => m.id === sId);
      if (s) {
        if (s.status === "On Duty") {
          s.status = "On Break";
          s.statusKey = "on-break";
          s.statusClass = "on-break";
        } else {
          s.status = "On Duty";
          s.statusKey = "on-duty";
          s.statusClass = "on-duty";
        }
      }
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const tbody = screen.querySelector("#staff-table-tbody");
      if (tbody) tbody.innerHTML = renderStaffTableRows();
      return;
    }

    const staffPageBtn = event.target.closest("[data-staff-page]");
    if (staffPageBtn) {
      const pageVal = staffPageBtn.dataset.staffPage;
      if (pageVal === "prev") staffCurrentPage = Math.max(1, staffCurrentPage - 1);
      else if (pageVal === "next") staffCurrentPage = Math.min(19, staffCurrentPage + 1);
      else staffCurrentPage = Number(pageVal) || 1;
      screen.querySelectorAll("[data-staff-page]").forEach((btn) => {
        if (btn.dataset.staffPage === String(staffCurrentPage)) {
          btn.classList.add("is-active");
        } else if (btn.dataset.staffPage !== "prev" && btn.dataset.staffPage !== "next") {
          btn.classList.remove("is-active");
        }
      });
      return;
    }

    const cctvLayoutBtn = event.target.closest("[data-cctv-layout]");
    if (cctvLayoutBtn) {
      activeCameraLayout = cctvLayoutBtn.dataset.cctvLayout;
      screen.querySelectorAll("[data-cctv-layout]").forEach((btn) => {
        btn.classList.toggle("is-active", btn === cctvLayoutBtn);
      });
      const grid = screen.querySelector("#cctv-grid-container");
      if (grid) grid.innerHTML = renderCameraFeedsGrid();
      return;
    }

    // Toggle switches inside Feed Settings popup
    const cctvToggleSwitch = event.target.closest("[data-cctv-toggle]");
    if (cctvToggleSwitch) {
      const toggleType = cctvToggleSwitch.dataset.cctvToggle;
      if (toggleType === "ai") {
        cameraAiDetectionEnabled = !cameraAiDetectionEnabled;
      } else if (toggleType === "scanlines") {
        cameraScanlinesEnabled = !cameraScanlinesEnabled;
      } else if (toggleType === "osd") {
        cameraOsdEnabled = !cameraOsdEnabled;
      }
      const isNowOn = toggleType === "ai" ? cameraAiDetectionEnabled :
        toggleType === "scanlines" ? cameraScanlinesEnabled : cameraOsdEnabled;
      cctvToggleSwitch.classList.toggle("is-on", isNowOn);
      cctvToggleSwitch.setAttribute("aria-checked", isNowOn ? "true" : "false");

      const grid = screen.querySelector("#cctv-grid-container");
      if (grid) grid.innerHTML = renderCameraFeedsGrid();
      return;
    }

    // Dismiss settings popup when clicking outside the menu wrap
    if (cctvSettingsPopupOpen && !event.target.closest(".cctv-settings-menu-wrap")) {
      cctvSettingsPopupOpen = false;
      renderScreen("admin-dashboard");
      return;
    }

    const cctvWaveformTabBtn = event.target.closest("[data-cctv-waveform-tab]");
    if (cctvWaveformTabBtn) {
      cameraWaveformTab = cctvWaveformTabBtn.dataset.cctvWaveformTab;
      screen.querySelectorAll("[data-cctv-waveform-tab]").forEach((btn) => {
        btn.classList.toggle("is-active", btn === cctvWaveformTabBtn);
      });
      const container = screen.querySelector("#cctv-waveform-container");
      if (container) container.innerHTML = renderSensorTelemetryWaveform();
      return;
    }

    const cctvActionBtn = event.target.closest("[data-cctv-action]");
    if (cctvActionBtn) {
      const action = cctvActionBtn.dataset.cctvAction;
      const camId = cctvActionBtn.dataset.cctvId;
      if (action === "toggle-settings-popup") {
        cctvSettingsPopupOpen = !cctvSettingsPopupOpen;
        renderScreen("admin-dashboard");
        return;
      } else if (action === "close-settings-popup") {
        cctvSettingsPopupOpen = false;
        renderScreen("admin-dashboard");
        return;
      } else if (action === "focus") {
        if (activeCameraLayout === "focus" && focusedCameraId === camId) {
          activeCameraLayout = "3x2";
        } else {
          focusedCameraId = camId || "cam-01";
          activeCameraLayout = "focus";
        }
        screen.querySelectorAll("[data-cctv-layout]").forEach((btn) => {
          btn.classList.toggle("is-active", btn.dataset.cctvLayout === activeCameraLayout);
        });
        const grid = screen.querySelector("#cctv-grid-container");
        if (grid) grid.innerHTML = renderCameraFeedsGrid();
      } else if (action === "snapshot") {
        openAdminModal(`cctv-snapshot-${camId}`);
      } else if (action === "ptz") {
        openAdminModal(`cctv-ptz-${camId}`);
      } else if (action === "calibrate") {
        openAdminModal("cctv-calibrate");
      } else if (action === "add-device") {
        openAdminModal("cctv-add-device");
      }
      return;
    }

    const ptzPadBtn = event.target.closest("[data-cctv-ptz-dir]");
    if (ptzPadBtn) {
      ptzPadBtn.style.transform = "scale(0.85)";
      setTimeout(() => { if (ptzPadBtn) ptzPadBtn.style.transform = ""; }, 150);
      return;
    }

    const navItem = event.target.closest("[data-admin-nav]");
    if (navItem) {
      activeAdminSidebarTab = navItem.dataset.adminNav;
      renderScreen("admin-dashboard");
      return;
    }

    const adminAuthTile = event.target.closest("[data-admin-auth]");
    if (adminAuthTile) {
      openAdminModal(adminAuthTile.dataset.adminAuth);
      return;
    }

    if (event.target.closest("[data-admin-modal-close]")) {
      screen.querySelector(".admin-modal-backdrop")?.remove();
      return;
    }

    if (event.target.closest("[data-admin-modal-auth]")) {
      screen.querySelector(".admin-modal-backdrop")?.remove();
      adminShowError = false;
      renderScreen("admin-dashboard");
      return;
    }

    const modalBackdrop = event.target.closest(".admin-modal-backdrop");
    if (modalBackdrop && event.target === modalBackdrop) {
      modalBackdrop.remove();
      return;
    }

    const quickBookOverlay = event.target.closest("[data-quick-book-overlay]");
    if (quickBookOverlay && event.target === quickBookOverlay) {
      closeQuickBookOverlay(quickBookOverlay);
      return;
    }

    const bookingOverlay = event.target.closest("[data-seat-booking-overlay]");
    if ((activeState === "live-map" || activeState === "live-seat-detail") && bookingOverlay && event.target === bookingOverlay) {
      closeSeatBookingOverlay(bookingOverlay);
      return;
    }

    const seatButton = event.target.closest("[data-bus-seat]");
    if (seatButton) {
      if (seatButton.disabled) return;
      selectedBusSeatId = seatButton.dataset.busSeat;
      screen.querySelectorAll("[data-bus-seat]").forEach((seat) => {
        const selected = seat === seatButton;
        seat.classList.toggle("selected", selected);
        seat.classList.toggle("empty", !selected && !seat.disabled);
        seat.setAttribute("aria-pressed", String(selected));
        seat.setAttribute("aria-label", `Seat ${seat.dataset.busSeat}, ${selected ? "selected" : seat.disabled ? "occupied" : "available"}`);
      });
      screen.querySelectorAll("[data-seat-selection]").forEach((summary) => {
        summary.textContent = `Seat ${selectedBusSeatId} selected`;
      });
      return;
    }

    const busMarker = event.target.closest("[data-sim-bus]");
    if (busMarker) {
      const nextBus = Number(busMarker.dataset.simBus);
      if (nextBus !== selectedLiveBus) selectedBusSeatId = "";
      selectedLiveBus = nextBus;
      const bus = liveBusDetails[selectedLiveBus];
      const popup = screen.querySelector("[data-bus-popup]");
      if (!bus || !popup) return;
      popup.classList.remove("is-closing");
      popup.querySelector(".bottom-sheet")?.classList.remove("is-closing");
      popup.querySelector("[data-bus-name]").textContent = bus.name;
      popup.querySelector("[data-bus-route]").textContent = bus.route;
      popup.querySelector("[data-bus-seats]").textContent = String(bus.seats);
      popup.querySelector("[data-bus-eta]").textContent = `${bus.eta} away`;
      popup.querySelector("[data-bus-fleet]").value = bus.fleetId;
      popup.querySelector("[data-bus-fare]").textContent = bus.fare;
      popup.querySelector("[data-bus-dispatch-title]").textContent = `Next Departure: ${bus.fleetId}`;
      popup.querySelector("[data-bus-dispatch-meta]").textContent = `${bus.seats} available ${bus.seats === 1 ? "seat" : "seats"} · ${bus.eta} away`;
      popup.querySelector("[data-bus-seat-layout]").innerHTML = busSeatPlanMarkup(bus);
      popup.querySelector("[data-seat-selection]").textContent = selectedBusSeatId ? `Seat ${selectedBusSeatId} selected` : "Select an available seat";
      popup.hidden = false;
      popup.querySelector(".bottom-sheet").focus();
      return;
    }

    const popup = event.target.closest("[data-bus-popup]");
    if (popup && event.target === popup) {
      closeBottomSheet(popup, () => screen.querySelector(`[data-sim-bus="${selectedLiveBus}"]`)?.focus());
      return;
    }

    const liveMapFilterButton = event.target.closest("[data-live-map-filter]");
    if (liveMapFilterButton) {
      liveMapFilter = liveMapFilterButton.dataset.liveMapFilter;
      updateLiveMapView();
      return;
    }

    const liveMapFilterToggle = event.target.closest("[data-live-filter-toggle]");
    if (liveMapFilterToggle) {
      const filters = screen.querySelector("#live-map-filters");
      if (!filters) return;
      filters.hidden = !filters.hidden;
      liveMapFilterToggle.setAttribute("aria-expanded", String(!filters.hidden));
      return;
    }

    const notificationFilterButton = event.target.closest("[data-notification-filter]");
    if (notificationFilterButton) {
      notificationFilter = notificationFilterButton.dataset.notificationFilter;
      updateNotificationView();
      return;
    }

    const tripFilterButton = event.target.closest("[data-trip-filter]");
    if (tripFilterButton) {
      tripHistoryFilter = tripFilterButton.dataset.tripFilter;
      updateTripHistoryView();
      return;
    }

    if (event.target.closest("[data-notifications-mark-all]")) {
      notifications.forEach((notification) => {
        notification.unread = false;
      });
      updateNotificationView();
      return;
    }

    const notificationButton = event.target.closest("[data-notification-id]");
    if (notificationButton) {
      const notification = notifications.find(({ id }) => id === notificationButton.dataset.notificationId);
      if (!notification) throw new Error(`Unknown notification in the inbox: ${notificationButton.dataset.notificationId}.`);
      notification.unread = !notification.unread;
      updateNotificationView();
      return;
    }

    const faqCategory = event.target.closest("[data-faq-category]");
    if (faqCategory) {
      activeFaqCategory = faqCategory.dataset.faqCategory;
      screen.querySelectorAll("[data-faq-category]").forEach((button) => {
        const selected = button === faqCategory;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      updateFaqResults();
      return;
    }

    const concessionType = event.target.closest("[data-concession-type]");
    if (concessionType) {
      discountVerificationType = concessionType.dataset.concessionType;
      discountVerificationMessage = "";
      renderScreen("verify-account");
      return;
    }

    const uploadTrigger = event.target.closest("[data-trigger-id-upload]");
    if (uploadTrigger) {
      const input = screen.querySelector(`[data-discount-id-upload="${uploadTrigger.dataset.triggerIdUpload}"][data-upload-kind="${uploadTrigger.dataset.uploadKind}"]`);
      input?.click();
      return;
    }

    const removeIdUpload = event.target.closest("[data-remove-id-upload]");
    if (removeIdUpload) {
      const side = removeIdUpload.dataset.removeIdUpload;
      const file = discountVerificationFiles[side];
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      discountVerificationFiles[side] = null;
      discountVerificationConfirmed = false;
      discountVerificationMessage = "";
      renderScreen("verify-account");
      return;
    }

    const verificationAction = event.target.closest("[data-verification-action]");
    if (verificationAction) {
      if (verificationAction.dataset.verificationAction === "review") {
        if (!discountVerificationFiles.front || !discountVerificationFiles.back) {
          discountVerificationMessage = "Upload both sides of your ID to continue.";
          renderScreen("verify-account");
          return;
        }
        discountVerificationStep = 2;
        discountVerificationConfirmed = false;
      } else if (verificationAction.dataset.verificationAction === "edit") {
        discountVerificationStep = 1;
        discountVerificationConfirmed = false;
      } else if (verificationAction.dataset.verificationAction === "submit") {
        if (!discountVerificationConfirmed) return;
        discountVerificationStep = 3;
        discountVerificationStatus = "pending";
      } else {
        throw new Error(`Unknown verification action: ${verificationAction.dataset.verificationAction}`);
      }
      discountVerificationMessage = "";
      renderScreen("verify-account");
      return;
    }

    const settingToggle = event.target.closest("[data-setting-toggle]");
    if (settingToggle) {
      const isOn = settingToggle.getAttribute("aria-checked") === "true";
      settingToggle.setAttribute("aria-checked", String(!isOn));
      settingToggle.classList.toggle("is-on", !isOn);
      return;
    }

    const profileSectionButton = event.target.closest("[data-profile-section]");
    if (profileSectionButton) {
      const section = screen.querySelector(`#${profileSectionButton.dataset.profileSection}`);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const editFieldButton = event.target.closest("[data-edit-field]");
    if (editFieldButton) {
      const field = editFieldButton.dataset.editField;
      const input = screen.querySelector(`[data-profile-field="${field}"]`);
      const message = editFieldButton.closest(".account-section")?.querySelector("[data-profile-message]") ?? screen.querySelector("[data-message]");
      if (!input || !(field in accountProfile)) {
        throw new Error(`Account profile field could not be edited: ${field}.`);
      }
      const label = input.labels?.[0]?.textContent?.trim() ?? "profile field";
      if (input.readOnly) {
        input.readOnly = false;
        editFieldButton.setAttribute("aria-label", `Save ${label}`);
        editFieldButton.classList.add("is-saving");
        editFieldButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>';
        input.focus();
        input.select();
      } else if (!input.value.trim() || !input.validity.valid) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
        if (message) message.textContent = input.value.trim() ? `Enter a valid ${label.toLowerCase()}.` : `${label} cannot be empty.`;
      } else {
        accountProfile[field] = input.value.trim();
        input.readOnly = true;
        input.removeAttribute("aria-invalid");
        editFieldButton.setAttribute("aria-label", `Edit ${label}`);
        editFieldButton.classList.remove("is-saving");
        editFieldButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.8L19 8.4 15.6 5 4.8 15.8 4 20Z"/></svg>';
        if (message) message.textContent = "Profile update saved in this prototype.";
      }
      return;
    }

    const mapControl = event.target.closest("[data-map-control]");
    if (mapControl) {
      const control = mapControl.dataset.mapControl;
      if (control === "zoom-in") liveMapZoom = Math.min(2.4, liveMapZoom * 1.2);
      else if (control === "zoom-out") liveMapZoom = Math.max(1, liveMapZoom / 1.2);
      else if (control === "reset") {
        liveMapPan = { x: 0, y: 0 };
        liveMapZoom = 1;
      } else {
        throw new Error(`Unknown live map control: ${control}`);
      }
      applyLiveMapTransform();
      return;
    }

    const stateButton = event.target.closest('[data-screen="live-seat-detail"]');
    if (stateButton && activeState === "live-map") {
      openLiveBusSeatBookingOverlay();
      return;
    }

    const navigationButton = event.target.closest("[data-screen]");
    if (navigationButton) {
      renderScreen(navigationButton.dataset.screen);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const { action } = actionButton.dataset;
      if (action === "quick-book") {
        openQuickBookOverlay();
      } else if (action === "open-confirmation") {
        renderScreen("booking-confirmation");
      } else if (action === "confirm-booking") {
        bookingConfirmed = true;
        renderScreen("booking-confirmed");
      } else if (action === "cancel-booking") {
        bookingConfirmed = false;
        renderScreen("home");
      } else {
        throw new Error(`Unknown USAD prototype action: ${action}`);
      }
      return;
    }

    const passengerButton = event.target.closest("[data-passengers]");
    if (passengerButton) {
      tripData.passengers = Math.min(6, Math.max(1, tripData.passengers + (passengerButton.dataset.passengers === "plus" ? 1 : -1)));
      const count = screen.querySelector("#passenger-count");
      if (count) count.textContent = `${tripData.passengers} ${tripData.passengers === 1 ? "passenger" : "passengers"}`;
      const countStrong = passengerButton.closest(".passenger-stepper")?.querySelector("strong");
      if (countStrong) countStrong.textContent = String(tripData.passengers);
      return;
    }

    const infoButton = event.target.closest("[data-info]");
    if (infoButton) {
      const message = infoButton.closest(".account-section")?.querySelector("[data-profile-message]") ?? screen.querySelector("[data-message]");
      if (message) message.textContent = infoButton.dataset.info;
    }
  });

  renderScreen(activeState);
  resetCanvas();
})();
