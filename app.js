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
  const fullscreenButton = document.querySelector("#fullscreen-button");
  const fullscreenStatus = document.querySelector("#fullscreen-status");
  const workspaceRoleLabel = document.querySelector("#workspace-role-label");

  if (!rolePage || !workspacePage || !roleNote || !viewport || !world || !screen || !zoomOutput || !backButton || !fitButton || !fullscreenButton || !fullscreenStatus) {
    throw new Error("USAD prototype could not initialize: required interface elements are missing.");
  }

  const routes = window.USAD_ROUTES;
  if (!Array.isArray(routes) || routes.length === 0) {
    throw new Error("USAD prototype could not initialize: active route data is missing.");
  }
  const activeRoute = routes[0];
  const renderRouteOptions = (selectedRouteId = activeRoute.id) => routes.map((route) => `
    <option value="${route.id}"${selectedRouteId === route.id ? " selected" : ""}>${route.label}</option>
  `).join("");

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
    { id: "bus-arrival", type: "ride", title: "Your bus is approaching", body: `${activeRoute.name} · Bus 01 is about 3 minutes away.`, time: "2 min ago", unread: true },
    { id: "booking-confirmed", type: "ticket", title: "Booking confirmed", body: `Your sample trip to ${activeRoute.destinationShort} is ready to view in My Tickets.`, time: "Yesterday", unread: true },
    { id: "service-update", type: "service", title: "Service update", body: "This is a sample service notice. Live service alerts are not connected.", time: "Oct 14", unread: false },
    { id: "fare-offer", type: "promo", title: "A little more in your U-Pouch", body: "Explore the sample offers shown in the app. No offer is active.", time: "Oct 12", unread: false },
  ];
  let notificationFilter = "all";
  const regularUserFarePerPassenger = 120;
  const discountedUserFarePerPassenger = 100;
  let welcomeTimeout = 0;
  let activeFaqCategory = "all";
  let tripHistoryTab = "upcoming";
  let tripHistoryQuery = "";
  let selectedHistoryTripId = "";
  let activeTripRatingId = "";
  let selectedTripRating = 0;
  let selectedTripComment = "";
  const tripRatings = new Map();
  let discountVerificationType = "student";
  let discountVerificationStep = 1;
  let discountVerificationFiles = { front: null, back: null };
  let discountVerificationConfirmed = false;
  let discountVerificationStatus = "unverified";
  let discountVerificationMessage = "";
  let tripHistory = [
    { id: "MLS-042", date: "Today · 8:15 AM", status: "completed", origin: activeRoute.origin, originDetail: activeRoute.originShort, destination: activeRoute.destination, destinationDetail: `Via ${activeRoute.via}`, fare: regularUserFarePerPassenger, seat: "1A", payment: "GCash", co2Saved: 6.2, receiptId: "USAD-7X29-KM41", inMonth: true, receiptLabel: "E-Ticket & Receipt", showRateAction: true, rebookLabel: "Rebook" },
    { id: "TRN-018", date: "Yesterday · 5:45 PM", status: "completed", origin: activeRoute.destination, originDetail: activeRoute.destinationShort, destination: activeRoute.origin, destinationDetail: `Via ${activeRoute.via}`, fare: regularUserFarePerPassenger, seat: "4B", payment: "U-Pouch", co2Saved: 6.1, receiptId: "USAD-4P18-TR62", inMonth: true, receiptLabel: "Receipt", rebookLabel: "Rebook Route" },
    { id: "MLS-105", date: "Oct 24 · 7:30 AM", status: "completed", origin: activeRoute.origin, originDetail: activeRoute.originShort, destination: activeRoute.destination, destinationDetail: `Via ${activeRoute.via}`, fare: discountedUserFarePerPassenger, seat: "2A", payment: "GCash", co2Saved: 6.1, receiptId: "USAD-2N05-ML47", inMonth: true, studentDiscount: true, receiptLabel: "View Receipt", rebookLabel: "Rebook", rebookStyle: "secondary" },
    { id: "TRN-009", date: "Oct 20 · 6:10 PM", status: "cancelled", origin: activeRoute.destination, originDetail: "Trip cancelled by operator", destination: activeRoute.origin, destinationDetail: "Refunded to U-Pouch", fare: 0, originalFare: regularUserFarePerPassenger, seat: "—", payment: "U-Pouch", co2Saved: 0, receiptId: "USAD-9R09-TR18", inMonth: false, receiptLabel: "Refund Details" },
  ];
  let bookingReferenceSequence = 1;
  const createBookingReference = () => {
    let reference;
    do {
      reference = `USAD-${Date.now().toString(36).toUpperCase()}-${String(bookingReferenceSequence++).padStart(3, "0")}`;
    } while (tripHistory.some((trip) => trip.id === reference || trip.receiptId === reference));
    return reference;
  };
  const toDateInputValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const defaultDepartureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return toDateInputValue(date);
  };
  const formatDeparture = (date, time) => new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(`${date}T${time}`));
  let tripData = {
    origin: activeRoute.origin,
    destination: activeRoute.destinationShort,
    passengers: 1,
    payment: "GCash",
    seat: "1A",
    departureDate: defaultDepartureDate(),
    departureTime: "08:15",
  };
  let bookingConfirmed = false;
  let topUpReturnFocus = null;
  let passwordUpdatedReturnFocus = null;
  const liveBusDetails = [
    { name: "Bus 01", fleetId: "MLS-042", route: activeRoute.label, eta: "3 min", seats: 8, fare: `₱${discountedUserFarePerPassenger.toFixed(2)}`, status: "On time" },
    { name: "Bus 02", fleetId: "MLS-018", route: activeRoute.label, eta: "Less than 1 min", seats: 1, fare: `₱${discountedUserFarePerPassenger.toFixed(2)}`, status: "On time" },
  ];
  let selectedLiveBus = 0;
  let selectedBusSeatId = "";
  let quickBookReturnFocus = null;
  let liveMapPan = { x: 0, y: 0 };
  let liveMapZoom = 1;
  let liveMapDrag = null;
  let liveMapAnimationFrame = 0;
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
  let activeCorridorFilter = activeRoute.id;
  let activeAdminSidebarTab = "live-operations";
  let selectedDispatchBusId = "bus-01";
  let dispatchPanelOpen = false;
  let selectedDispatchSeatBooking = null;
  let nextWalkInBookingNumber = 1;
  const adminFleetSize = 20;
  let dispatchTelemetryFilter = "all";
  let dispatchMapZoom = 1;
  let dispatchNoteInput = "";
  const dispatchRemittances = [];
  const formatPeso = (amount) => new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
  const sampleFarePerPassenger = 100;
  const sampleUPouchBalance = 2;
  const insufficientUPouchPayment = (payment, passengers) =>
    payment === "U-Pouch" && sampleUPouchBalance < sampleFarePerPassenger * passengers;
  const peakDispatchQueue = [
    { id: "peak-03", busNo: "03", route: "Trinoma Express", terminal: "Malolos Central Depot", driver: "Eldrei Acero", fuel: "92%", status: "ready" },
    { id: "peak-07", busNo: "07", route: "Trinoma Express", terminal: "Malolos Central Depot", driver: "Juan Dela Cruz", fuel: "88%", status: "ready" },
    { id: "peak-11", busNo: "11", route: "EDSA Northbound", terminal: "SM North Staging Bay 4", driver: "Rogers Santos", fuel: "84%", status: "ready" },
  ];
  let peakDispatchAnnouncement = "";
  let activeStaffRoleFilter = "all";
  let staffSearchQuery = "";
  let staffDepotFilter = "all";
  let staffCurrentPage = 1;
  const staffPageSize = 8;
  let staffSelectedRows = new Set();
  let activeCameraLocationFilter = "all";
  let activeCameraLayout = "3x2"; // "3x2", "2x2", "focus"
  let focusedCameraId = "cam-01";
  let cameraAiDetectionEnabled = true;
  let cameraScanlinesEnabled = true;
  let cameraOsdEnabled = true;
  let cctvSettingsPopupOpen = false;
  let cameraWaveformTab = "monitor"; // "monitor", "ai", "debug"
  let cameraSearchQuery = "";
  let predictiveSelectedBucket = "period-8";
  let predictiveTransitLoadScale = 100;
  let predictiveOperatingProfile = "Standard Service";
  let activePredictivePeriod = "daily";
  let activeAnalyticsRouteId = activeRoute.id;
  const getDateInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  let activeTripLogDate = getDateInputValue(new Date());
  let showAllTripLogs = false;
  let activeReportsCorridor = activeRoute.id;
  let activeRevenueChartPeriod = "monthly";
  let reportsSearchQuery = "";
  let selectedReportDetailId = "REP-2026-1048";
  function getDispatchSnapshot() {
    const movingUnits = fleetDispatchTelemetryUnits.filter((unit) => unit.category === "deployed" || unit.category === "delayed");
    const delayedUnits = movingUnits.filter((unit) => unit.category === "delayed");
    const nearFullUnits = fleetDispatchTelemetryUnits.filter((unit) => unit.occupancyPct >= 90);
    const terminalUnits = fleetDispatchTelemetryUnits.filter((unit) => unit.category === "terminal");
    return { movingUnits, delayedUnits, nearFullUnits, terminalUnits };
  }

  const reportingSummary = {
    revenueMonthToDate: 1248650,
    cashRevenueMonthToDate: 784400,
    pouchRevenueMonthToDate: 464250,
    revenueDaysElapsed: 21,
    passengersMonthToDate: 142880,
    passengersAveragePerDay: 4760,
    concessionPassengersMonthToDate: 31420,
    dieselLiters: 18420,
    operatingKilometers: 63010,
    fleetEfficiency: 3.42,
    operatingCostPerKilometer: 19.99
  };
  const dailyRevenue = {
    total: reportingSummary.revenueMonthToDate / reportingSummary.revenueDaysElapsed,
    cash: reportingSummary.cashRevenueMonthToDate / reportingSummary.revenueDaysElapsed,
    pouch: reportingSummary.pouchRevenueMonthToDate / reportingSummary.revenueDaysElapsed
  };
  const formatPhp = (amount) => `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const predictiveDailyPassengerBaseline = 1350;
  const PREDICTIVE_DAILY_AXIS_MAXIMUM = 1800;
  const predictiveDemandPeriodBase = [
    { id: "period-1", multiplier: 0.82 },
    { id: "period-2", multiplier: 0.88 },
    { id: "period-3", multiplier: 0.94 },
    { id: "period-4", multiplier: 1 },
    { id: "period-5", multiplier: 1.06 },
    { id: "period-6", multiplier: 1.12 },
    { id: "period-7", multiplier: 1.08 },
    { id: "period-8", multiplier: 1.16 }
  ];
  const predictivePeriodOptions = {
    daily: { label: "Daily", unit: "day", days: 1, bucketPrefix: "Day", shortPrefix: "Day" },
    weekly: { label: "Weekly", unit: "week", days: 7, bucketPrefix: "Week", shortPrefix: "Wk" },
    monthly: { label: "Monthly", unit: "month", days: 30, bucketPrefix: "Month", shortPrefix: "Mo" }
  };
  const predictiveOperatingProfileFactors = {
    "Standard Service": [1, 1, 1, 1, 1, 1, 1, 1],
    "Peak Service": [1.08, 1.1, 1.12, 1.15, 1.18, 1.22, 1.25, 1.28],
    "Reduced Service": [0.92, 0.9, 0.88, 0.86, 0.84, 0.82, 0.8, 0.78]
  };
  let predictiveDemandForecast = [];

  const updatePredictiveForecastData = () => {
    const period = predictivePeriodOptions[activePredictivePeriod];
    if (!period) throw new Error(`Unknown passenger demand period: "${activePredictivePeriod}".`);
    const selectedRoute = routes.find((route) => route.id === activeAnalyticsRouteId);
    if (!selectedRoute) throw new Error(`Passenger demand forecast could not find route "${activeAnalyticsRouteId}".`);
    const profileFactors = predictiveOperatingProfileFactors[predictiveOperatingProfile];
    if (!profileFactors) throw new Error(`Unknown passenger demand operating profile: "${predictiveOperatingProfile}".`);
    if (!Array.isArray(selectedRoute.demandFactors) || selectedRoute.demandFactors.length !== predictiveDemandPeriodBase.length) {
      throw new Error(`Passenger demand forecast data is incomplete for route "${selectedRoute.id}".`);
    }
    predictiveDemandForecast = predictiveDemandPeriodBase.map((periodData, index) => {
      const multiplier = periodData.multiplier * profileFactors[index] * selectedRoute.demandFactors[index];
      const effectiveMultiplier = multiplier * predictiveTransitLoadScale / 100;
      return {
        ...periodData,
        label: `${period.shortPrefix} ${index + 1}`,
        periodLabel: `${period.bucketPrefix} ${index + 1}`,
        val: Math.round(predictiveDailyPassengerBaseline * period.days * multiplier),
        state: effectiveMultiplier >= 1.1 ? "surge" : effectiveMultiplier >= 0.9 ? "normal" : "low",
        heat: effectiveMultiplier >= 1.1 ? "red" : effectiveMultiplier >= 0.9 ? "blue" : "green"
      };
    });
  };
  updatePredictiveForecastData();

  const getPredictivePeriod = () => {
    const period = predictivePeriodOptions[activePredictivePeriod];
    if (!period) throw new Error(`Unknown passenger demand period: "${activePredictivePeriod}".`);
    return period;
  };

  const PREDICTIVE_CHART_PLOT_HEIGHT = 140;
  const PREDICTIVE_CHART_AXIS_HEIGHT = 165;
  const PREDICTIVE_CHART_X_AXIS_HEIGHT = PREDICTIVE_CHART_AXIS_HEIGHT - PREDICTIVE_CHART_PLOT_HEIGHT;
  const getScaledPredictiveValue = (item) => Math.round(item.val * (predictiveTransitLoadScale / 100));
  const getPredictiveThresholdBottom = (multiplier) => {
    const thresholdValue = predictiveDailyPassengerBaseline * getPredictivePeriod().days * multiplier;
    return PREDICTIVE_CHART_X_AXIS_HEIGHT
      + (thresholdValue / getPredictiveAxisMaximum()) * PREDICTIVE_CHART_PLOT_HEIGHT;
  };
  const getPredictiveAxisMaximum = () => {
    const period = getPredictivePeriod();
    const axisUnit = PREDICTIVE_DAILY_AXIS_MAXIMUM * period.days;
    const peakAtMaxCapacity = predictiveDemandPeriodBase.reduce((peak, item, index) => {
      const maximumRouteFactor = Math.max(...routes.map((route) => route.demandFactors[index]));
      const maximumProfileFactor = Math.max(...Object.values(predictiveOperatingProfileFactors).map((factors) => factors[index]));
      return Math.max(
        peak,
        predictiveDailyPassengerBaseline * period.days * item.multiplier * maximumRouteFactor * maximumProfileFactor * 1.5
      );
    }, axisUnit);
    return Math.ceil(peakAtMaxCapacity / (axisUnit / 4)) * (axisUnit / 4);
  };

  const renderPredictiveYAxis = () => {
    const axisMaximum = getPredictiveAxisMaximum();
    const ticks = [axisMaximum, axisMaximum * 0.75, axisMaximum * 0.5, axisMaximum * 0.25, 0]
      .map((value) => `<span>${Math.round(value).toLocaleString()}</span>`)
      .join("");
    return `<div class="chart-y-axis-ticks" aria-hidden="true">${ticks}</div>`;
  };

  const renderForecastBars = (previousHeights = new Map()) => {
    const axisMaximum = getPredictiveAxisMaximum();
    const period = getPredictivePeriod();
    return predictiveDemandForecast.map((item) => {
      const scaledVal = getScaledPredictiveValue(item);
      const heightPx = Math.round((scaledVal / axisMaximum) * PREDICTIVE_CHART_PLOT_HEIGHT);
      const startHeight = previousHeights.get(item.id) ?? heightPx;
      const startScale = heightPx > 0 ? startHeight / heightPx : 1;
      const isSelected = item.id === predictiveSelectedBucket;
      return `
        <div class="chart-bar-col${isSelected ? " is-selected" : ""}" data-chart-period="${item.id}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="${item.periodLabel}: ${scaledVal.toLocaleString()} projected passengers per ${period.unit}" aria-describedby="demand-${item.id}-tooltip" style="--bar-height: ${heightPx}px">
          ${isSelected ? `<div class="bar-selected-badge">${scaledVal.toLocaleString()}</div>` : ""}
          <div class="chart-bar-fill ${item.state}" style="height: ${heightPx}px; transform: scaleY(${startScale});"></div>
          <span class="chart-bar-tooltip" id="demand-${item.id}-tooltip" role="tooltip">${item.periodLabel} · ${scaledVal.toLocaleString()} projected passengers per ${period.unit}</span>
          <div class="bar-heat-pill ${item.heat}"></div>
          <span class="bar-time-label">${item.label}</span>
        </div>
      `;
    }).join("");
  };

  const renderPredictiveStats = () => {
    const period = getPredictivePeriod();
    const selectedItem = predictiveDemandForecast.find((item) => item.id === predictiveSelectedBucket) ?? predictiveDemandForecast[7];
    const scaledVal = Math.round(selectedItem.val * (predictiveTransitLoadScale / 100));
    const demandLabel = selectedItem.state === "surge" ? "Peak surge" : selectedItem.state === "normal" ? "Normal" : "Low";

    let stateClass = "text-low";
    let stateText = demandLabel;
    if (selectedItem.state === "surge") {
      stateClass = "text-surge";
    } else if (selectedItem.state === "normal") {
      stateClass = "text-normal";
    }

    return `
      <div class="analytics-metric-box">
        <span class="metric-box-label">Selected demand period</span>
        <strong class="metric-box-val">${selectedItem.periodLabel}</strong>
      </div>
      <div class="analytics-metric-divider"></div>
      <div class="analytics-metric-box">
        <span class="metric-box-label">Selected projected ridership</span>
        <strong class="metric-box-val">${scaledVal.toLocaleString()} / ${period.unit}</strong>
      </div>
      <div class="analytics-metric-divider"></div>
      <div class="analytics-metric-box">
        <span class="metric-box-label">Demand outlook</span>
        <strong class="metric-box-val ${stateClass}">${stateText}</strong>
      </div>
    `;
  };

  const updatePredictiveView = () => {
    const selectedForecastRoute = routes.find((route) => route.id === activeAnalyticsRouteId);
    if (!selectedForecastRoute) throw new Error(`Passenger demand forecast could not find route "${activeAnalyticsRouteId}".`);
    const barsContainer = screen.querySelector("#analytics-bars-container");
    const previousHeights = new Map();
    barsContainer?.querySelectorAll(".chart-bar-fill").forEach((bar) => {
      const periodId = bar.closest("[data-chart-period]")?.dataset.chartPeriod;
      if (periodId) previousHeights.set(periodId, Number.parseFloat(window.getComputedStyle(bar).height));
    });
    updatePredictiveForecastData();
    if (barsContainer) {
      barsContainer.innerHTML = renderForecastBars(previousHeights);
      window.requestAnimationFrame(() => {
        barsContainer.querySelectorAll(".chart-bar-fill").forEach((bar) => {
          bar.style.removeProperty("transform");
        });
      });
    }
    const metricsContainer = screen.querySelector("#analytics-metrics-container");
    if (metricsContainer) metricsContainer.innerHTML = renderPredictiveStats();
    const yAxis = screen.querySelector(".chart-y-axis");
    if (yAxis) yAxis.innerHTML = renderPredictiveYAxis();
    const forecastBadge = screen.querySelector(".analytics-range-badge");
    if (forecastBadge) forecastBadge.textContent = `${selectedForecastRoute.label} · ${getPredictivePeriod().label} passenger demand`;
    const demandLegend = screen.querySelector(".analytics-legend > span:first-child");
    if (demandLegend) demandLegend.textContent = `${getPredictivePeriod().label} passenger demand levels:`;
  };

  const adminFleetData = [
    {
      id: "bus-01",
      busNo: "Bus 01",
      driver: "Jocky King Garcia",
      dispatcher: "Klintroy Suerte Felipe",
      routeId: activeRoute.id,
      route: activeRoute.label,
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
      routeId: activeRoute.id,
      route: activeRoute.label,
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
      routeId: activeRoute.id,
      route: activeRoute.label,
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
      routeId: activeRoute.id,
      route: activeRoute.label,
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
      routeId: activeRoute.id,
      route: activeRoute.label,
      fuel: "62% Fuel",
      fuelType: "cyan",
      speed: "38 km/h",
      rate: "$4.5 / 5h",
      status: "On Duty",
      statusClass: "on-duty",
      dot: "green",
      filterCategory: "on-duty",
      telemetry: { speed: "38 km/h", fuel: "62%",       gps: "14.6540° N, 121.0330° E (Trinoma)", tire: "34 PSI", temp: "87°C", passengers: "16 / 24", oil: "Optimal" }
    },
    {
      id: "bus-06",
      busNo: "Bus 06",
      driver: "Joshua Garcia",
      dispatcher: "Piolo Pascual",
      routeId: activeRoute.id,
      route: activeRoute.label,
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

  const isBusOffDuty = (bus) => bus.status.trim().toLowerCase() === "off duty";
  const isBusAvailableForAssignment = (bus) => bus.filterCategory !== "on-duty" && !isBusOffDuty(bus);
  const renderAssignableBusOptions = () => {
    const availableBuses = adminFleetData.filter(isBusAvailableForAssignment);
    if (availableBuses.length === 0) return `<option value="" selected disabled>No available buses</option>`;
    return `
      <option value="" selected disabled>Select an available bus</option>
      ${availableBuses.map((bus) => `
        <option value="${escapeHtml(bus.id)}">${escapeHtml(bus.busNo)} · ${escapeHtml(bus.status)}${bus.driver !== "Unassigned" ? ` · ${escapeHtml(bus.driver)}` : ""}</option>
      `).join("")}
    `;
  };

  const BUS_TOTAL_SEAT_CAPACITY = 15;
  const EMPLOYEE_RESERVED_SEATS = [
    { id: "1A", role: "Driver" }
  ];
  const PASSENGER_SEAT_CAPACITY = BUS_TOTAL_SEAT_CAPACITY - EMPLOYEE_RESERVED_SEATS.length;
  const supportsSeatManagement = (bus) => (
    new RegExp(`^\\d+\\s*\\/\\s*${PASSENGER_SEAT_CAPACITY}\\s*passenger seats$`, "i").test(bus.occupancySeats)
  );
  const assertSeatMapEditable = (bus) => {
    if (bus.tripFinished) {
      throw new Error(`Seat assignments for Bus ${bus.busNo} are locked because its trip is finished.`);
    }
  };

  const getSeatCounts = (bus) => {
    const match = /^(\d+)\s*\/\s*(\d+)\s*passenger seats$/i.exec(bus.occupancySeats);
    if (!match) throw new Error(`USAD seat management could not read passenger capacity for ${bus.busNo}.`);
    const passengerCapacity = Number(match[2]);
    if (passengerCapacity !== PASSENGER_SEAT_CAPACITY) {
      throw new Error(`USAD seat management received invalid occupancy data for ${bus.busNo}.`);
    }
    if (!Number.isInteger(bus.sampleOccupiedSeats)) bus.sampleOccupiedSeats = Number(match[1]);
    if (!Array.isArray(bus.walkInBookings)) bus.walkInBookings = [];
    if (!Array.isArray(bus.releasedSampleSeatIds)) bus.releasedSampleSeatIds = [];
    const occupied = bus.sampleOccupiedSeats - bus.releasedSampleSeatIds.length + bus.walkInBookings.length;
    if (occupied > passengerCapacity) {
      throw new Error(`USAD seat management received invalid occupancy data for ${bus.busNo}.`);
    }
    return {
      occupied,
      passengerCapacity,
      reserved: EMPLOYEE_RESERVED_SEATS.length,
      totalCapacity: BUS_TOTAL_SEAT_CAPACITY,
      available: passengerCapacity - occupied,
      occupancy: Math.floor((occupied / passengerCapacity) * 100)
    };
  };

  const getSampleSeatBooking = (bus, passengerSeatIndex) => {
    const busCode = bus.busNo.replace(/\D/g, "").padStart(2, "0").slice(-2);
    const bookingNumber = `${busCode}${String(passengerSeatIndex + 1).padStart(2, "0")}`;
    const bookedAt = new Date(Date.UTC(2026, 9, 25, 6) + (Number(busCode) * 7 + passengerSeatIndex * 11) * 60 * 1000);
    const formattedBookedAt = new Intl.DateTimeFormat("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Manila"
    }).format(bookedAt);

    return {
      reference: `BK-••••-${bookingNumber}`,
      bookedAt: `${formattedBookedAt} PHT`
    };
  };

  const getPassengerSeatIndex = (seatId) => {
    const match = /^(\d+)([AB])$/.exec(seatId);
    if (!match) return -1;
    const seatIndex = (Number(match[1]) - 1) * 2 + (match[2] === "B" ? 1 : 0);
    const passengerSeatIndex = seatIndex - EMPLOYEE_RESERVED_SEATS.length;
    return passengerSeatIndex >= 0 && passengerSeatIndex < PASSENGER_SEAT_CAPACITY ? passengerSeatIndex : -1;
  };

  const getBookingForSeat = (bus, seatId) => {
    const passengerSeatIndex = getPassengerSeatIndex(seatId);
    if (passengerSeatIndex < 0) return null;
    const walkInBooking = (bus.walkInBookings || []).find((booking) => booking.seatId === seatId);
    if (walkInBooking) return walkInBooking;
    if ((bus.releasedSampleSeatIds || []).includes(seatId)) return null;
    return passengerSeatIndex < bus.sampleOccupiedSeats
      ? { seatId, ...getSampleSeatBooking(bus, passengerSeatIndex), walkIn: false }
      : null;
  };

  const createWalkInBooking = (bus, seatId) => {
    const busCode = bus.busNo.replace(/\D/g, "").padStart(2, "0").slice(-2);
    const timestamp = new Date();
    const formattedBookedAt = new Intl.DateTimeFormat("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Manila"
    }).format(timestamp);

    return {
      seatId,
      reference: `BK-••••-${busCode}${String(nextWalkInBookingNumber++).padStart(4, "0")}`,
      bookedAt: `${formattedBookedAt} PHT`,
      walkIn: true
    };
  };

  const updateFleetOccupancyDisplay = (bus) => {
    const { occupied, passengerCapacity, occupancy } = getSeatCounts(bus);
    bus.occupancyPct = occupancy;
    bus.occupancySeats = `${occupied}/${passengerCapacity} passenger seats`;
    bus.occupancyPassengers = `${occupancy}% (${occupied} / ${passengerCapacity} passenger seats)`;
  };

  const renderDispatchSeatBookingDetails = (bus) => {
    if (bus.tripFinished) {
      return `<p class="dispatch-seat-release-success">Trip finished. Seat assignments are locked.</p>`;
    }

    if (!selectedDispatchSeatBooking) {
      return `<p>Select an available seat to book a walk-in customer, or an occupied seat to view its booking.</p>`;
    }

    if (selectedDispatchSeatBooking.type === "available") {
      return `
        <div class="dispatch-seat-booking-heading">
          <span>Seat ${escapeHtml(selectedDispatchSeatBooking.seatId)} is available</span>
        </div>
        <p>No passenger details are required for this walk-in booking.</p>
        <button class="dispatch-seat-book-button" type="button" data-book-walk-in-seat="${escapeHtml(selectedDispatchSeatBooking.seatId)}">
          Book walk-in customer
        </button>
      `;
    }

    if (selectedDispatchSeatBooking.type === "released") {
      return `<p class="dispatch-seat-release-success">Seat ${escapeHtml(selectedDispatchSeatBooking.seatId)} is available again. Customer departure recorded.</p>`;
    }

    if (selectedDispatchSeatBooking.busId !== bus.id) {
      return `<p>Select an available seat to book a walk-in customer, or an occupied seat to view its booking.</p>`;
    }

    if (selectedDispatchSeatBooking.confirmingRelease) {
      return `
        <div class="dispatch-seat-release-confirmation" role="group" aria-label="Confirm customer departure">
          <p>Confirm that the customer has reached their destination and left the bus before releasing this seat.</p>
          <div>
            <button class="dispatch-seat-release-confirm" type="button" data-confirm-seat-release="${escapeHtml(selectedDispatchSeatBooking.seatId)}">Confirm customer left</button>
            <button class="dispatch-seat-release-cancel" type="button" data-cancel-seat-release>Keep seat booked</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="dispatch-seat-booking-heading">
        <span>Seat ${escapeHtml(selectedDispatchSeatBooking.seatId)} booking${selectedDispatchSeatBooking.walkIn ? " · Walk-in" : ""}</span>
      </div>
      <dl>
        <div><dt>Booking ID</dt><dd>${escapeHtml(selectedDispatchSeatBooking.reference)}</dd></div>
        <div><dt>Date &amp; time booked</dt><dd>${escapeHtml(selectedDispatchSeatBooking.bookedAt)}</dd></div>
      </dl>
      <button class="dispatch-seat-release-button" type="button" data-start-seat-release="${escapeHtml(selectedDispatchSeatBooking.seatId)}">Customer left bus</button>
    `;
  };

  const renderAdminSeatLayout = ({ occupied }, bookingLookupBus) => {
    const isReadOnly = bookingLookupBus?.tripFinished === true;
    const seatLetters = ["A", "B"];
    const rowCount = Math.ceil(BUS_TOTAL_SEAT_CAPACITY / seatLetters.length);
    return Array.from({ length: rowCount }, (_, rowIndex) => {
      const rowSeats = seatLetters.map((letter, seatIndex) => {
        const seatIndexInBus = rowIndex * seatLetters.length + seatIndex;
        if (seatIndexInBus >= BUS_TOTAL_SEAT_CAPACITY) return `<span aria-hidden="true"></span>`;
        const seatId = `${rowIndex + 1}${letter}`;
        const reservedSeat = EMPLOYEE_RESERVED_SEATS.find((seat) => seat.id === seatId);
        if (reservedSeat) {
          const seatLabel = reservedSeat.role === "Driver" ? `${seatId} · Driver` : seatId;
          const seatDescription = reservedSeat.role === "Driver" ? `Seat ${seatId}, reserved for driver` : `Seat ${seatId}, reserved for staff`;
          return `<span class="admin-seat is-reserved" title="Reserved employee seat" aria-label="${seatDescription}">${seatLabel}</span>`;
        }
        const existingBooking = bookingLookupBus ? getBookingForSeat(bookingLookupBus, seatId) : null;
        const seatState = existingBooking ? "is-occupied" : "is-available";
        if (isReadOnly) {
          return `<span class="admin-seat ${seatState}" aria-label="Seat ${seatId}, ${seatState === "is-occupied" ? "occupied" : "available"}; trip finished">${seatId}</span>`;
        }
        if (seatState === "is-occupied" && bookingLookupBus) {
          const booking = existingBooking;
          const isBookingSelected = selectedDispatchSeatBooking?.seatId === seatId;
          return `<button class="admin-seat ${seatState}${isBookingSelected ? " is-selected" : ""}" type="button" data-dispatch-booking-seat="${seatId}" aria-pressed="${isBookingSelected}" aria-label="Seat ${seatId}, occupied. View masked booking details">${seatId}</button>`;
        }
        if (bookingLookupBus) {
          const isSeatSelected = selectedDispatchSeatBooking?.type === "available" && selectedDispatchSeatBooking.seatId === seatId;
          return `<button class="admin-seat ${seatState}${isSeatSelected ? " is-selected" : ""}" type="button" data-dispatch-available-seat="${seatId}" aria-pressed="${isSeatSelected}" aria-label="Seat ${seatId}, available. Select to book a walk-in customer">${seatId}</button>`;
        }
        return `<span class="admin-seat ${seatState}" aria-label="Seat ${seatId}, ${seatState === "is-occupied" ? "occupied" : "available"}">${seatId}</span>`;
      });
      return `<div class="admin-seat-row">${rowSeats[0]}<span class="admin-seat-aisle" aria-hidden="true"></span>${rowSeats[1]}</div>`;
    }).join("");
  };

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
      text: `Heavy congestion near ${activeRoute.destinationShort} - rerouting Bus 04 within the active route.`
    },
    {
      author: "Robert Watkins",
      tag: "#160312",
      tagColor: "gold",
      time: "3 hours ago",
      text: `Heavy congestion near ${activeRoute.destinationShort} - rerouting Bus 04 within the active route.`
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
      if (item.routeId !== activeCorridorFilter) return false;
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
          <div class="admin-row-actions">
            <button class="btn-telemetry" type="button" data-admin-telemetry="${bus.id}">View Details</button>
            <button class="btn-row-actions" type="button" data-fleet-actions="${bus.id}" aria-label="More actions for ${bus.busNo}">Actions</button>
          </div>
        </td>
      </tr>
    `).join("");
  };

  const adminLiveOperationsView = () => {
    const dispatchSnapshot = getDispatchSnapshot();
    const onTimeUnits = dispatchSnapshot.movingUnits.filter((unit) => unit.statusType === "on-time");
    const delayedUnitsSummary = dispatchSnapshot.delayedUnits.map((unit) => `Bus ${unit.busNo} · ${unit.statusText.replace("Delayed ", "")}`).join(", ") || "No delayed units in the sample";
    const nearFullUnitsSummary = dispatchSnapshot.nearFullUnits.map((unit) => `Bus ${unit.busNo} · ${unit.occupancyPct}% full · ${unit.occupancySeats}`).join(", ") || "No near-full buses in the sample";
    const rosterCount = (category) => adminFleetData.filter((bus) => bus.filterCategory === category).length;
    return `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Live Operations</h1>
      </div>

      <div class="admin-header-actions">
        <select class="admin-select-corridor" data-admin-corridor aria-label="Select Route">
          ${renderRouteOptions(activeCorridorFilter)}
        </select>
        <button class="admin-btn-assign" type="button" data-admin-action="open-assign">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Assign a Bus</span>
        </button>
      </div>
    </header>

    <p class="admin-kpi-context">Sample operational snapshot · Vehicle positions, occupancy and revenue are illustrative, not live.</p>
    <section class="admin-metrics-grid" aria-label="Live operations key performance indicators">
      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Units on route</span>
          <span class="admin-pill-badge badge-registered">${adminFleetSize} fleet units</span>
        </div>
        <div class="bento-metric-figure green">${dispatchSnapshot.movingUnits.length} / ${adminFleetSize}</div>
        <span class="bento-metric-sublabel">${onTimeUnits.length} on time · ${dispatchSnapshot.delayedUnits.length} delayed · ${dispatchSnapshot.terminalUnits.length} at terminal</span>
      </article>

      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Delayed units</span>
          <span class="admin-pill-badge badge-cost">Needs attention</span>
        </div>
        <div class="bento-metric-figure${dispatchSnapshot.delayedUnits.length ? " red" : " green"}">${dispatchSnapshot.delayedUnits.length}</div>
        <span class="bento-metric-sublabel">${delayedUnitsSummary}</span>
      </article>

      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Near-full buses</span>
          <span class="admin-pill-badge badge-cost">≥90% occupancy</span>
        </div>
        <div class="bento-metric-figure${dispatchSnapshot.nearFullUnits.length ? " red" : " green"}">${dispatchSnapshot.nearFullUnits.length}</div>
        <span class="bento-metric-sublabel">${nearFullUnitsSummary}</span>
      </article>

      <article class="admin-metric-card">
        <div class="admin-metric-header">
          <span class="admin-metric-label">Fare revenue run rate</span>
          <span class="admin-pill-badge badge-total">MTD avg / day</span>
        </div>
        <div class="bento-metric-figure">${formatPhp(dailyRevenue.total)}</div>
        <span class="bento-metric-sublabel">From ${formatPhp(reportingSummary.revenueMonthToDate)} fare revenue over ${reportingSummary.revenueDaysElapsed} days</span>
        <span class="admin-shift-corridors">88% shift coverage · 6 of 6 key routes</span>
      </article>
    </section>

    <!-- Active Fleet Vehicles & Dispatch Directory -->
    <section class="admin-directory-panel">
      <div class="admin-directory-header">
        <h2 class="admin-directory-title">Buses &amp; Assignments</h2>
        <div class="admin-directory-tabs" role="tablist">
          <button class="admin-filter-pill${activeFleetFilter === "all" ? " is-active" : ""}" type="button" data-admin-fleet-filter="all">All Units (${adminFleetData.length})</button>
          <button class="admin-filter-pill${activeFleetFilter === "on-duty" ? " is-active" : ""}" type="button" data-admin-fleet-filter="on-duty">On Duty (${rosterCount("on-duty")})</button>
          <button class="admin-filter-pill${activeFleetFilter === "on-break" ? " is-active" : ""}" type="button" data-admin-fleet-filter="on-break">On Break (${rosterCount("on-break")})</button>
          <button class="admin-filter-pill${activeFleetFilter === "standby" ? " is-active" : ""}" type="button" data-admin-fleet-filter="standby">Standby (${rosterCount("standby")})</button>
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
    <section class="admin-bottom-grid" hidden>
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
        <div class="admin-map-container" aria-label="Illustrative route map from ${escapeHtml(activeRoute.origin)} to ${escapeHtml(activeRoute.destination)}">
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

            <!-- Active route -->
            <path d="M 125 78 Q 155 100, 185 130 T 260 178" stroke="#3b82f6" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M 125 78 Q 155 100, 185 130 T 260 178" stroke="#93c5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

            <!-- Route endpoints -->
            <text x="138" y="68" font-size="10.5" font-weight="700" fill="#1e293b" font-family="sans-serif">${escapeHtml(activeRoute.originShort)}</text>
            <text x="272" y="174" font-size="11" font-weight="700" fill="#0f172a" font-family="sans-serif">${escapeHtml(activeRoute.destinationShort)}</text>

            <!-- Origin marker -->
            <circle cx="125" cy="74" r="9" fill="#dc2626"/>
            <text x="125" y="78" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">B</text>

            <!-- Destination marker -->
            <circle cx="260" cy="178" r="9" fill="#dc2626"/>
            <text x="260" y="182" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>
          </svg>
        </div>
      </article>
    </section>
  `;
  };

  const adminPredictiveAnalyticsView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Passenger Demand</h1>
      </div>

      <div class="admin-header-actions">
        <select class="admin-select-corridor" data-analytics-route aria-label="Select Route">
          ${renderRouteOptions(activeAnalyticsRouteId)}
        </select>
        <select class="admin-select-corridor" data-analytics-range aria-label="Select Forecast Period">
          <option value="daily"${activePredictivePeriod === "daily" ? " selected" : ""}>Daily</option>
          <option value="weekly"${activePredictivePeriod === "weekly" ? " selected" : ""}>Weekly</option>
          <option value="monthly"${activePredictivePeriod === "monthly" ? " selected" : ""}>Monthly</option>
        </select>
        <span class="analytics-range-badge">${escapeHtml(activeRoute.label)} · ${escapeHtml(getPredictivePeriod().label)} passenger demand</span>
        <button class="admin-btn-assign" type="button" data-admin-action="export-surge" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-weight: 700;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Export Demand Report</span>
        </button>
      </div>
    </header>

    <!-- Main Demand & Forecast Card -->
    <section class="admin-analytics-card">
      <div class="analytics-card-header">
        <div class="analytics-legend">
          <span style="color: #64748b; font-size: 11.5px; font-weight: 600;">${escapeHtml(getPredictivePeriod().label)} passenger demand levels:</span>
          <span class="legend-item"><span class="legend-dot red"></span><span style="color: #ef4444;">Peak / Surge</span></span>
          <span class="legend-item"><span class="legend-dot blue"></span><span style="color: #93c5fd;">Normal</span></span>
          <span class="legend-item"><span class="legend-dot green"></span><span style="color: #6ee7b7;">Low</span></span>
        </div>
      </div>

      <!-- Chart Wrap -->
      <div class="analytics-chart-wrap">
        <div class="chart-y-axis">${renderPredictiveYAxis()}</div>

        <div class="chart-plot-container" style="height: ${PREDICTIVE_CHART_AXIS_HEIGHT}px;">
          <!-- Threshold lines -->
          <div class="chart-threshold-line line-peak" style="bottom: ${getPredictiveThresholdBottom(1.1)}px;"></div>
          <span class="threshold-label threshold-label-peak text-red" style="bottom: ${getPredictiveThresholdBottom(1.1)}px;">Peak demand</span>
          <div class="chart-threshold-line line-normal" style="bottom: ${getPredictiveThresholdBottom(0.9)}px;"></div>
          <span class="threshold-label threshold-label-normal text-blue" style="bottom: ${getPredictiveThresholdBottom(0.9)}px;">Normal demand</span>

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
            <option value="Standard Service" ${predictiveOperatingProfile === "Standard Service" ? "selected" : ""}>Standard Service</option>
            <option value="Peak Service" ${predictiveOperatingProfile === "Peak Service" ? "selected" : ""}>Peak Service</option>
            <option value="Reduced Service" ${predictiveOperatingProfile === "Reduced Service" ? "selected" : ""}>Reduced Service</option>
          </select>
        </div>

        <div class="analytics-ctrl-col slider-col">
          <div class="slider-label-row">
            <span class="ctrl-label">Transit load scale</span>
            <span class="scale-val" id="scale-val-display">${predictiveTransitLoadScale}%</span>
          </div>
          <input type="range" class="analytics-slider" min="50" max="150" step="5" value="${predictiveTransitLoadScale}" data-analytics-scale aria-label="Transit load scale">
        </div>

      </div>
    </section>

    <!-- Dispatch recommendation -->
    <section class="analytics-bottom-grid">
      <!-- AI Dispatch Recommendation -->
      <article class="analytics-bottom-card">
        <div class="admin-card-header">
          <div class="admin-card-header-left">
            <div class="card-icon-badge mint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #f8fafc;">Suggested Bus Changes</div>
          </div>
        </div>

        <div class="bento-denested-content">
          <ul class="recommendation-list">
            <li>• Inject <strong>+3 standby buses</strong> on ${escapeHtml(activeRoute.label)}</li>
            <li>• Reduce the time between evening buses from <strong>12m to 5m</strong></li>
            <li>• Deploy <strong>2 available coaches</strong> from ${escapeHtml(activeRoute.origin)} depot</li>
          </ul>
        </div>

        <div class="bento-divider-line"></div>

        <div class="analytics-action-row">
          <button class="btn-approve-fleet" type="button" data-admin-action="approve-redistribution">Apply Bus Changes</button>
          <button class="btn-simulate-surge" type="button" data-admin-action="simulate-surge">Preview Estimate</button>
        </div>
      </article>
    </section>
  `;

  fleetDispatchTelemetryUnits = [
    {
      id: "bus-01",
      unitCode: "UNIT #01",
      busNo: "01",
      category: "delayed",
      tripName: "Northbound Bus",
      routeId: activeRoute.id,
      routeCorridor: `${activeRoute.destinationShort} to ${activeRoute.originShort}`,
      statusText: "Delayed (+8m)",
      statusType: "delayed",
      headwayAlert: "8 minutes behind schedule",
      nextStop: activeRoute.origin,
      etaText: "23 min ETA (15:08 PHT)",
      occupancyPct: 86,
      occupancySeats: "12/14 passenger seats",
      occupancyPassengers: "86% (12 / 14 passenger seats)",
      driverName: "Dela Cruz, J.",
      driverId: "#DR-4819",
      dispatcherName: "Klintroy Suerte Felipe",
      gpsLocation: `${activeRoute.via} Northbound`,
      scheduledStop: `${activeRoute.origin} (ETA 15:08 PHT)`,
      progressClass: "amber",
      dotClass: "amber"
    },
    {
      id: "bus-02",
      unitCode: "UNIT #02",
      busNo: "02",
      category: "deployed",
      tripName: "Northbound Bus",
      routeId: activeRoute.id,
      routeCorridor: `${activeRoute.destinationShort} to ${activeRoute.originShort}`,
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "On schedule",
      nextStop: activeRoute.origin,
      etaText: "7 min ETA (14:55 PHT)",
      occupancyPct: 86,
      occupancySeats: "12/14 passenger seats",
      occupancyPassengers: "86% (12 / 14 passenger seats)",
      driverName: "Rogers, S.",
      driverId: "#DR-9204",
      dispatcherName: "Ross Anthony Jobs",
      gpsLocation: activeRoute.via,
      scheduledStop: `${activeRoute.origin} (ETA 14:55 PHT)`,
      progressClass: "mint",
      dotClass: "mint"
    },
    {
      id: "bus-14",
      unitCode: "UNIT #14",
      busNo: "14",
      category: "terminal",
      tripName: "Southbound Bus",
      routeId: activeRoute.id,
      routeCorridor: `${activeRoute.originShort} to ${activeRoute.destinationShort}`,
      statusText: "At Terminal",
      statusType: "terminal",
      headwayAlert: "At the terminal. Leaves in 19 minutes.",
      nextStop: activeRoute.origin,
      etaText: "Departing in 19 min",
      occupancyPct: 86,
      occupancySeats: "12/14 passenger seats",
      occupancyPassengers: "86% (12 / 14 passenger seats)",
      driverName: "Dela Cruz, J.",
      driverId: "#DR-4819",
      dispatcherName: "Unassigned",
      gpsLocation: activeRoute.destination,
      scheduledStop: `${activeRoute.origin} (ETA 16:30 PHT)`,
      progressClass: "purple",
      dotClass: "purple"
    },
    {
      id: "bus-08",
      unitCode: "UNIT #08",
      busNo: "08",
      category: "deployed",
      tripName: "Northbound Bus",
      routeId: activeRoute.id,
      routeCorridor: `${activeRoute.destinationShort} to ${activeRoute.originShort}`,
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "1 minute ahead of schedule",
      nextStop: activeRoute.origin,
      etaText: "12 min ETA (15:00 PHT)",
      occupancyPct: 43,
      occupancySeats: "6/14 passenger seats",
      occupancyPassengers: "43% (6 / 14 passenger seats)",
      driverName: "Bautista, M.",
      driverId: "#DR-7711",
      dispatcherName: "Unassigned",
      gpsLocation: activeRoute.via,
      scheduledStop: `${activeRoute.origin} (ETA 15:00 PHT)`,
      progressClass: "mint",
      dotClass: "mint"
    },
    {
      id: "bus-23",
      unitCode: "UNIT #23",
      busNo: "23",
      badge: "",
      category: "deployed",
      tripName: "Southbound Bus",
      routeId: activeRoute.id,
      routeCorridor: `${activeRoute.originShort} to ${activeRoute.destinationShort}`,
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "Busy bus. Running on schedule.",
      nextStop: activeRoute.destination,
      etaText: "16 min ETA (15:04 PHT)",
      occupancyPct: 93,
      occupancySeats: "13/14 passenger seats",
      occupancyPassengers: "93% (13 / 14 passenger seats)",
      driverName: "Alcantara, R.",
      driverId: "#DR-3108",
      dispatcherName: "Unassigned",
      gpsLocation: activeRoute.via,
      scheduledStop: `${activeRoute.destination} (ETA 15:04 PHT)`,
      progressClass: "amber",
      dotClass: "mint"
    },
    {
      id: "bus-06",
      unitCode: "UNIT #06",
      busNo: "06",
      category: "deployed",
      tripName: "Southbound Bus",
      routeCorridor: `${activeRoute.originShort} to ${activeRoute.destinationShort}`,
      statusText: "On Time",
      statusType: "on-time",
      headwayAlert: "Nominal Headway: On schedule",
      nextStop: "Bocaue Interchange",
      etaText: "11 min ETA (15:02 PHT)",
      occupancyPct: 64,
      occupancySeats: "45/70 seats",
      occupancyPassengers: "64% (45 / 70 Passengers)",
      driverName: "Santos, A.",
      driverId: "#DR-6206",
      dispatcherName: "Piolo Pascual",
      gpsLocation: "Malolos Central Loop",
      scheduledStop: "Bocaue Interchange (ETA 15:02 PHT)",
      corridor: "malolos",
      progressClass: "mint",
      dotClass: "mint"
    }
  ];

  const renderFleetTelemetryRows = () => {
    const list = fleetDispatchTelemetryUnits.filter((u) => {
      if (dispatchTelemetryFilter === "deployed") return u.category === "deployed";
      if (dispatchTelemetryFilter === "delayed") return u.category === "delayed";
      if (dispatchTelemetryFilter === "terminal") return u.category === "terminal";
      return true;
    }).sort((a, b) => Number(a.busNo) - Number(b.busNo));

    if (list.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #64748b;">No fleet vehicles in this category.</td></tr>`;
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
          <td>
            <div class="dispatch-row-actions">
              ${bus.category === "terminal"
                ? '<span class="dispatch-row-unavailable">Not in service</span>'
                : `<button class="dispatch-row-manage" type="button" data-manage-trip="${bus.id}">${bus.tripFinished ? "View trip" : "Manage trip"}</button>`}
              <button class="dispatch-row-delete" type="button" data-telemetry-delete="${bus.id}" aria-label="Delete telemetry for Bus ${escapeHtml(bus.busNo)}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  };

  const renderDispatchControlPanel = () => {
    const unit = fleetDispatchTelemetryUnits.find((u) => u.id === selectedDispatchBusId) || fleetDispatchTelemetryUnits[0];
    const seatCounts = supportsSeatManagement(unit) ? getSeatCounts(unit) : null;
    return `
      <div class="dispatch-panel-shell">
      <button class="dispatch-panel-close" type="button" data-close-dispatch-panel aria-label="Close trip management">×</button>
      <section class="dispatch-control-panel-card dispatch-assignment-panel">
        <header class="dispatch-panel-header">
          <div class="dispatch-panel-title-wrap">
            <h2 class="dispatch-panel-title">Bus ${unit.busNo}</h2>
          </div>
        </header>

        <div class="dispatch-assignment-panel-content" id="dispatch-assignment-content">
        <!-- Active Selection Box -->
        <div class="dispatch-assignment-overview">
        <div class="dispatch-active-selection-box">
          <span class="selection-box-label">Selected Bus</span>
          <div class="selection-box-title-row">
            <h3 class="selection-bus-heading">Bus No. ${unit.busNo} — ${unit.tripName}</h3>
            <button class="selection-clock-btn" type="button" title="View Bus Schedule">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 15px; height: 15px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </button>
          </div>
          <div class="selection-alert-subtext">
            <span class="${unit.tripFinished ? "alert-dot-mint" : "alert-dot-amber"}"></span>
            <span>${unit.tripFinished ? "Trip finished · remittance recorded" : unit.headwayAlert}</span>
          </div>
        </div>

        <!-- Meta Specification Rows -->
        <div class="dispatch-specs-list">
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Bus Number</span>
            <span class="spec-val-content">${unit.busNo}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Route</span>
            <span class="spec-val-content">${unit.routeCorridor.replace(" Corridor", "").replace(" Loop", "")}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Current Status</span>
            <span class="spec-val-content">
              <span class="status-pill-telemetry ${unit.statusType}"><span class="status-dot"></span>${unit.statusText}</span>
            </span>
          </div>
          ${seatCounts ? `<details class="dispatch-seat-dropdown dispatch-spec-row"${selectedDispatchSeatBooking?.busId === unit.id ? " open" : ""}>
            <summary class="dispatch-seat-dropdown-trigger">
              <span class="spec-key-label">Seats Filled</span>
              <span class="dispatch-seat-trigger-value">
                <span class="spec-val-content">${unit.occupancyPassengers}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>
              </span>
            </summary>
            <div class="dispatch-seat-dropdown-content">
              <div class="admin-seat-map dispatch-seat-map" aria-label="Seat layout for Bus ${escapeHtml(unit.busNo)}">
                <div class="admin-seat-driver">FRONT <span>Driver</span></div>
                <div class="admin-seat-grid" role="group" aria-label="Seats on Bus ${escapeHtml(unit.busNo)}">
                  ${renderAdminSeatLayout(seatCounts, unit)}
                </div>
              </div>
              <div class="dispatch-seat-booking-details${selectedDispatchSeatBooking ? " has-selection" : ""}" data-dispatch-seat-booking-details aria-live="polite">
                ${renderDispatchSeatBookingDetails(unit)}
              </div>
              <div class="dispatch-seat-dropdown-footer">
                <span>${unit.tripFinished ? "Trip finished · seat map locked" : `${seatCounts.available} passenger seat${seatCounts.available === 1 ? "" : "s"} available`}</span>
                <span>1A Driver · 1B Passenger</span>
              </div>
            </div>
          </details>` : `<div class="dispatch-spec-row">
            <span class="spec-key-label">Seats Filled</span>
            <span class="spec-val-content">${escapeHtml(unit.occupancyPassengers)}</span>
          </div>`}
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Assigned Driver</span>
            <span class="spec-val-content">${unit.driverName}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Assigned Dispatcher</span>
            <span class="spec-val-content">${unit.dispatcherName}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Current Location</span>
            <span class="spec-val-content">${unit.gpsLocation}</span>
          </div>
          <div class="dispatch-spec-row">
            <span class="spec-key-label">Next Stop</span>
            <span class="spec-val-content" style="color: #2fd9a8;">${unit.scheduledStop}</span>
          </div>
        </div>
        </div>

        <!-- 2x2 Dispatcher Interventions -->
        <div class="dispatch-assignment-actions">
        <div class="dispatch-interventions-section">
          <span class="interventions-label">Available Actions</span>
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
          <label class="dispatch-note-label">Assignment note (optional)</label>
          <textarea class="dispatch-note-textarea" placeholder="Add a route change, schedule note, or maintenance alert..." data-dispatch-note>${escapeHtml(dispatchNoteInput)}</textarea>
        </div>

        <!-- Main Send Action Button -->
        <button class="btn-send-dispatch-order" type="button" data-dispatch-action="send-order">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px;"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          <span>Save Assignment</span>
        </button>
        ${unit.tripFinished
          ? '<div class="dispatch-finished-note" role="status">Trip completed. Remittance is recorded in the dashboard below.</div>'
          : `<button class="dispatch-finish-trip-button" type="button" data-dispatch-action="finish-trip">Mark trip finished</button>`}
        </div>
        </div>
      </section>
      </div>
    `;
  };

  const renderRadarMapSvg = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fallbackPositions = {
      "bus-01": { x: 448, y: 158 },
      "bus-02": { x: 525, y: 124 },
      "bus-06": { x: 140, y: 214 },
      "bus-14": { x: 674, y: 79 },
      "bus-08": { x: 365, y: 180 },
      "bus-23": { x: 278, y: 195 },
    };
    const motionStartSeconds = {
      "bus-01": 8,
      "bus-02": 17,
      "bus-06": 23,
      "bus-08": 2,
      "bus-23": 12,
    };
    const statusColors = {
      delayed: "#f59e0b",
      deployed: "#2fd9a8",
      terminal: "#a78bfa",
      completed: "#94a3b8",
    };
    const mapMarkers = fleetDispatchTelemetryUnits.map((unit) => {
      const position = fallbackPositions[unit.id];
      const color = statusColors[unit.category];
      const shouldAnimate = unit.category !== "terminal" && !unit.tripFinished && !reducedMotion;
      if (!position || !color || (shouldAnimate && (motionStartSeconds[unit.id] === undefined ||
        !["Northbound Bus", "Southbound Bus"].includes(unit.tripName)))) {
        throw new Error(`USAD could not display Bus ${unit.busNo} on the fleet map: its sample position, status color, or route direction is missing.`);
      }
      const isSelected = unit.id === selectedDispatchBusId;
      const labelWidth = 64;
      const labelX = -labelWidth / 2;
      const labelY = -31;
      const markerTransform = shouldAnimate ? "" : ` transform="translate(${position.x} ${position.y})"`;
      const motionPath = unit.tripName === "Northbound Bus"
        ? "M 677 80 C 478 146 393 177 304 197 C 215 217 145 248 64 287"
        : "M 64 287 C 145 248 215 217 304 197 S 478 146 677 80";
      const motion = shouldAnimate
        ? `<animateMotion dur="34s" begin="-${motionStartSeconds[unit.id]}s" repeatCount="indefinite" calcMode="linear" rotate="auto" path="${motionPath}"/>`
        : "";
      return `
        <g class="bus-map-marker${isSelected ? " is-selected" : ""}" data-map-bus="${escapeHtml(unit.id)}"${markerTransform}>
          ${shouldAnimate ? `<circle class="bus-map-live-pulse" cx="0" cy="0" r="15" stroke="${color}"/>` : ""}
          ${isSelected ? '<circle cx="0" cy="0" r="24" fill="' + color + '" opacity="0.14"/><circle cx="0" cy="0" r="18" fill="none" stroke="' + color + '" stroke-opacity="0.6" stroke-width="1.5"/>' : ""}
          <circle cx="0" cy="0" r="11" fill="#101a24" stroke="${color}" stroke-width="2.5"/>
          <path d="M -5 -3 h 10 v 8 h -10 z M -3 -6 h 6 l 3 3 h -12 z" fill="${color}"/>
          <circle cx="-2.5" cy="6" r="1.2" fill="#101a24"/>
          <circle cx="2.5" cy="6" r="1.2" fill="#101a24"/>
          <rect x="${labelX}" y="${labelY}" width="${labelWidth}" height="18" rx="9" fill="#101a24" stroke="${isSelected ? color : "#344353"}" stroke-width="${isSelected ? 1.5 : 1}"/>
          <text x="0" y="${labelY + 12}" fill="#f8fafc" font-size="9" font-weight="700" text-anchor="middle">BUS ${escapeHtml(unit.busNo)}</text>
          ${motion}
        </g>
      `;
    }).join("");

    return `
      <svg class="radar-map-svg" viewBox="0 0 740 300" preserveAspectRatio="xMidYMid meet" style="transform: scale(${dispatchMapZoom}); transition: transform 0.25s ease;" role="img" aria-label="Illustrative fleet map showing bus locations between Malolos and Trinoma">
        <defs>
          <pattern id="fleet-map-blocks" width="74" height="58" patternUnits="userSpaceOnUse">
            <rect x="7" y="7" width="24" height="15" rx="2" fill="#182532" stroke="#223342" stroke-width="1"/>
            <rect x="38" y="7" width="28" height="15" rx="2" fill="#182532" stroke="#223342" stroke-width="1"/>
            <rect x="7" y="31" width="20" height="18" rx="2" fill="#182532" stroke="#223342" stroke-width="1"/>
            <rect x="34" y="31" width="32" height="18" rx="2" fill="#182532" stroke="#223342" stroke-width="1"/>
          </pattern>
        </defs>

        <rect width="740" height="300" fill="#101a24"/>
        <rect width="740" height="300" fill="url(#fleet-map-blocks)" opacity="0.88"/>

        <path d="M -30 78 C 115 92 165 46 285 66 S 500 102 770 50" fill="none" stroke="#1a2936" stroke-width="17" stroke-linecap="round"/>
        <path d="M -30 78 C 115 92 165 46 285 66 S 500 102 770 50" fill="none" stroke="#314657" stroke-width="1.4" stroke-dasharray="5 7"/>
        <path d="M 24 275 C 160 224 214 254 334 216 S 550 205 748 259" fill="none" stroke="#1a2936" stroke-width="15" stroke-linecap="round"/>
        <path d="M 24 275 C 160 224 214 254 334 216 S 550 205 748 259" fill="none" stroke="#314657" stroke-width="1.2" stroke-dasharray="5 7"/>

        <path d="M 64 287 C 145 248 215 217 304 197 S 478 146 677 80" fill="none" stroke="#263747" stroke-width="24" stroke-linecap="round"/>
        <path d="M 64 287 C 145 248 215 217 304 197 S 478 146 677 80" fill="none" stroke="#40586b" stroke-width="1.5" stroke-dasharray="7 8"/>
        <path d="M 64 287 C 145 248 215 217 304 197 S 478 146 677 80" fill="none" stroke="#2fd9a8" stroke-width="2.5" stroke-linecap="round" opacity="0.72"/>

        <path d="M 104 0 L 138 300 M 221 0 L 240 300 M 572 0 L 541 300 M 0 129 L 740 140" fill="none" stroke="#253544" stroke-width="4"/>
        <path d="M 104 0 L 138 300 M 221 0 L 240 300 M 572 0 L 541 300 M 0 129 L 740 140" fill="none" stroke="#35495b" stroke-width="1" stroke-dasharray="3 5"/>

        <text x="44" y="37" fill="#7f93a5" font-size="10" font-weight="700" letter-spacing="1.4">BULACAN</text>
        <text x="82" y="193" fill="#cbd5e1" font-size="11" font-weight="600">MALOLOS</text>
        <text x="211" y="169" fill="#8fa3b5" font-size="9">GUIGUINTO</text>
        <text x="316" y="166" fill="#8fa3b5" font-size="9">BOCAUE</text>
        <text x="404" y="128" fill="#8fa3b5" font-size="9">MARILAO</text>
        <text x="498" y="102" fill="#8fa3b5" font-size="9">MEYCAUAYAN</text>
        <text x="596" y="62" fill="#cbd5e1" font-size="10" font-weight="600">TRINOMA</text>
        <text x="432" y="228" fill="#7890a3" font-size="9" font-weight="600" letter-spacing="1">NORTH LUZON EXPRESSWAY</text>

        <circle cx="674" cy="79" r="4" fill="#64748b"/>
        ${mapMarkers}
      </svg>
    `;
  };

  const renderPeakDispatchReadiness = () => {
    const readyCount = peakDispatchQueue.filter((bus) => bus.status === "ready").length;
    return `
      <section class="peak-readiness-card" id="peak-readiness-container" aria-labelledby="peak-readiness-title">
        <div class="peak-readiness-header">
          <div>
            <p class="peak-readiness-eyebrow">PRE-SERVICE STAGING</p>
            <h2 id="peak-readiness-title">Pre-booking dispatch queue</h2>
            <p class="peak-readiness-description">Buses are staged and checked before customers book. Dispatch one right away when service is needed.</p>
          </div>
          <div class="peak-readiness-summary" aria-label="${readyCount} buses ready to dispatch">
            <strong>${readyCount}</strong>
            <span>Buses Ready</span>
          </div>
        </div>
        <div class="peak-readiness-checks" aria-label="Readiness checks">
          <span><i aria-hidden="true">✓</i> Crew assigned</span>
          <span><i aria-hidden="true">✓</i> Fuel checked</span>
          <span><i aria-hidden="true">✓</i> Vehicle inspection complete</span>
        </div>
        <div class="peak-ready-bus-list">
          ${peakDispatchQueue.map((bus) => `
            <article class="peak-ready-bus${bus.status === "dispatched" ? " is-dispatched" : ""}">
              <div class="peak-ready-bus-identity">
                <span class="peak-ready-bus-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14l1-7-2-5H6l-2 5 1 7Z"/><path d="M6 10h12M7 17v2m10-2v2M7 14h.01M17 14h.01"/></svg>
                </span>
                <div>
                  <strong>Bus ${escapeHtml(bus.busNo)}</strong>
                  <span>${escapeHtml(bus.route)} · ${escapeHtml(bus.terminal)}</span>
                </div>
              </div>
              <div class="peak-ready-bus-meta">
                <span>${escapeHtml(bus.driver)}</span>
                <span>${escapeHtml(bus.fuel)} fuel</span>
              </div>
              <span class="peak-ready-status${bus.status === "dispatched" ? " is-dispatched" : ""}">${bus.status === "ready" ? "Ready" : "Dispatched"}</span>
              <button class="peak-dispatch-button" type="button" data-peak-dispatch="${escapeHtml(bus.id)}"${bus.status === "dispatched" ? " disabled" : ""}>
                ${bus.status === "ready" ? "Dispatch right away" : "Dispatched"}
              </button>
            </article>
          `).join("")}
        </div>
        <div class="peak-readiness-footer">
          <span class="peak-readiness-note">Illustrative staging data only; dispatch does not connect to live vehicles or commuter access.</span>
          ${readyCount < peakDispatchQueue.length ? '<button class="peak-reset-button" type="button" data-peak-dispatch-reset>Reset demo queue</button>' : ""}
        </div>
        <p class="peak-readiness-announcement" role="status" aria-live="polite">${escapeHtml(peakDispatchAnnouncement)}</p>
      </section>
    `;
  };

  const renderDispatchRemittances = () => `
    <section class="dispatch-remittances-card" id="dispatch-remittances-container" aria-labelledby="dispatch-remittances-title">
      <header class="dispatch-remittances-header">
        <div>
          <p class="peak-readiness-eyebrow">TRIP CLOSEOUT</p>
          <h2 id="dispatch-remittances-title">Trip remittances</h2>
        </div>
        <span class="dispatch-remittances-count">${dispatchRemittances.length} recorded</span>
      </header>
      <p class="dispatch-remittances-note">Remittances are added when a dispatcher marks a trip finished. Demo totals use a sample fare of ${formatPeso(sampleFarePerPassenger)} per passenger.</p>
      ${dispatchRemittances.length
        ? `<div class="dispatch-remittances-table-wrap">
            <table class="dispatch-remittances-table">
              <thead><tr><th>TRIP / BUS</th><th>PASSENGERS</th><th>FARE</th><th>REMITTANCE</th><th>FINISHED</th></tr></thead>
              <tbody>${dispatchRemittances.map((remittance) => `
                <tr>
                  <td><strong>${escapeHtml(remittance.route)}</strong><span>Bus ${escapeHtml(remittance.busNo)} · ${escapeHtml(remittance.id)}</span></td>
                  <td>${remittance.passengers}</td>
                  <td>${formatPeso(remittance.farePerPassenger)} / pax</td>
                  <td><strong class="dispatch-remittance-amount">${formatPeso(remittance.amount)}</strong></td>
                  <td>${escapeHtml(remittance.finishedAt)}</td>
                </tr>
              `).join("")}</tbody>
            </table>
          </div>`
        : '<p class="dispatch-remittances-empty">No finished trips yet. Completed trip remittances will appear here automatically.</p>'}
    </section>
  `;

  const adminFleetDispatchView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Fleet Management</h1>
      </div>

      <div class="admin-header-actions">
        <button class="admin-btn-assign" type="button" data-admin-action="open-assign">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Assign a Bus</span>
        </button>
      </div>
    </header>

    ${renderPeakDispatchReadiness()}

    <!-- Illustrative vehicle positions are shown on the fleet map. -->
    <section class="admin-radar-map-card">
      <div class="radar-map-toolbar">
        <div class="corridor-filter-group">
          <div>
            <h2 class="fleet-map-title">Bus Monitoring Map</h2>
            <p class="fleet-map-subtitle">${escapeHtml(activeRoute.originShort)} to ${escapeHtml(activeRoute.destinationShort)} via NLEX</p>
          </div>
        </div>

        <div class="map-viewport-tools">
          <button class="map-tool-btn" type="button" data-map-zoom="in" title="Zoom In">+</button>
          <div class="map-tool-divider"></div>
          <button class="map-tool-btn" type="button" data-map-zoom="out" title="Zoom Out">-</button>
        </div>
      </div>

      <div class="radar-map-viewport" id="radar-viewport-container">
        ${renderRadarMapSvg()}
      </div>

      <div class="radar-map-legend">
        <span class="legend-item"><span class="legend-dot-circle mint"></span> On time</span>
        <span class="legend-item"><span class="legend-dot-circle amber"></span> Delayed</span>
        <span class="legend-item"><span class="legend-dot-circle purple"></span> At terminal</span>
        <span class="fleet-map-note"><span class="fleet-map-gps-dot" aria-hidden="true"></span>GPS preview</span>
      </div>
    </section>

    <!-- Main 2-Column Operational Grid -->
  <div class="fleet-dispatch-grid${dispatchPanelOpen ? " is-assignment-expanded" : " is-panel-closed"}">
      <!-- Left Column: Bus Status Table -->
      <div class="fleet-dispatch-left-col">
        <!-- Bus Status Table -->
        <section class="admin-telemetry-table-card">
          <div class="telemetry-table-header-row">
            <div class="telemetry-card-title-wrap">
              <h2 class="telemetry-card-title">Bus Status</h2>
            </div>

            <div class="telemetry-filter-tabs">
              <button class="telemetry-tab-pill${dispatchTelemetryFilter === "all" ? " is-active" : ""}" type="button" data-telemetry-tab="all">Tracked Sample (${fleetDispatchTelemetryUnits.length})</button>
              <button class="telemetry-tab-pill${dispatchTelemetryFilter === "deployed" ? " is-active" : ""}" type="button" data-telemetry-tab="deployed">Deployed (${fleetDispatchTelemetryUnits.filter((unit) => unit.category === "deployed").length})</button>
              <button class="telemetry-tab-pill pill-amber${dispatchTelemetryFilter === "delayed" ? " is-active" : ""}" type="button" data-telemetry-tab="delayed">Delayed (${fleetDispatchTelemetryUnits.filter((unit) => unit.category === "delayed").length})</button>
              <button class="telemetry-tab-pill pill-purple${dispatchTelemetryFilter === "terminal" ? " is-active" : ""}" type="button" data-telemetry-tab="terminal">At Terminal (${fleetDispatchTelemetryUnits.filter((unit) => unit.category === "terminal").length})</button>
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
                  <th>ACTIONS</th>
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
        ${dispatchPanelOpen ? renderDispatchControlPanel() : ""}
      </div>
    </div>
    ${renderDispatchRemittances()}
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

  const isStaffOffDuty = (staff) => {
    const status = String(staff.statusKey || staff.status || "").trim().toLowerCase().replace(/[\s_]+/g, "-");
    return status === "off" || status === "off-duty";
  };

  const getAssignableStaffDrivers = () => adminStaffMembersData.filter((member) => (
    member.roleKey === "driver" && !isStaffOffDuty(member)
  ));

  const renderStaffDriverOptions = (selectedDriverId = "") => `
    <option value=""${selectedDriverId ? "" : " selected"}>Select an available driver</option>
    ${getAssignableStaffDrivers().map((driver) => `
      <option value="${escapeHtml(driver.id)}"${driver.id === selectedDriverId ? " selected" : ""}>${escapeHtml(driver.name)} · ${escapeHtml(driver.status)}</option>
    `).join("")}
  `;

  const generatedStaffFirstNames = [
    "Alex", "Bea", "Carlo", "Dana", "Emil", "Faith", "Gabriel", "Hazel", "Ian", "Jessa",
    "Kevin", "Lara", "Marco", "Nina", "Oscar", "Paolo", "Queenie", "Rafael", "Sofia", "Tomas",
    "Ulysses", "Vina", "Warren", "Yana", "Zandro", "Althea", "Bryan", "Celine", "Diego", "Erika",
    "Francis", "Grace", "Harvey", "Isabel", "Joaquin", "Kyla", "Lorenzo", "Mika", "Nathan", "Olivia",
    "Patrick", "Rina"
  ];
  const generatedStaffLastNames = [
    "Abad", "Bautista", "Castillo", "Dizon", "Enriquez", "Flores", "Garcia", "Hernandez", "Ignacio", "Jimenez",
    "Lazaro", "Mendoza", "Navarro", "Ocampo", "Pascual", "Quizon", "Ramos", "Santiago", "Torres", "Uy",
    "Velasco", "Yap", "Zamora", "Aguilar", "Bernardo", "Cruz", "Domingo", "Estrada", "Fernandez", "Gonzales",
    "Luna", "Manalo", "Reyes", "Salazar", "Villanueva", "Aquino", "Balagtas", "Cabrera", "David", "Evangelista",
    "Francisco", "Gutierrez"
  ];
  const generatedStaffRoleKeys = [
    ...Array(26).fill("driver"),
    ...Array(6).fill("dispatcher"),
    ...Array(10).fill("maintenance")
  ];
  generatedStaffRoleKeys.forEach((roleKey, index) => {
    const staffNumber = index + 9;
    const firstName = generatedStaffFirstNames[index];
    const lastName = generatedStaffLastNames[index];
    if (!firstName || !lastName) {
      throw new Error(`USAD could not create sample staff record ${staffNumber}: a sample name is missing.`);
    }
    const role = roleKey === "driver" ? "Driver" : roleKey === "dispatcher" ? "Dispatcher" : "Maintenance";
    const roleCode = roleKey === "driver" ? "DRV" : roleKey === "dispatcher" ? "DSP" : "MNT";
    const depot = index % 2 === 0 ? "Trinoma Hub" : "Malolos Hub";
    const status = index % 5 === 0 ? "On Break" : index % 7 === 0 ? "Off" : "On Duty";
    adminStaffMembersData.push({
      id: `staff-${String(staffNumber).padStart(2, "0")}`,
      name: `${firstName} ${lastName}`,
      staffId: `A${String((index % 8) + 1).padStart(2, "0")}OPS${String(100 + staffNumber)} • ${roleCode}`,
      initials: `${firstName[0]}${lastName[0]}`,
      avatarClass: "",
      role,
      roleKey,
      busNo: "-",
      depot,
      rate: roleKey === "driver" ? "$4.50" : roleKey === "dispatcher" ? "$3.00" : "$3.50",
      maxHours: roleKey === "driver" ? "10 hrs" : roleKey === "dispatcher" ? "8 hrs" : "8 hrs",
      status,
      statusKey: status.toLowerCase().replace(" ", "-"),
      statusClass: status === "On Duty" ? "on-duty" : status === "On Break" ? "on-break" : "off"
    });
  });

  const getFilteredStaffMembers = () => {
    const query = staffSearchQuery.toLowerCase().trim();
    const roleFilterKeys = {
      drivers: "driver",
      dispatchers: "dispatcher",
      maintenance: "maintenance"
    };
    return adminStaffMembersData.filter((member) => {
      if (activeStaffRoleFilter !== "all" && member.roleKey !== roleFilterKeys[activeStaffRoleFilter]) return false;
      if (staffDepotFilter !== "all" && !member.depot.toLowerCase().includes(staffDepotFilter.toLowerCase())) return false;
      if (!query) return true;
      return (
        member.name.toLowerCase().includes(query) ||
        member.staffId.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.depot.toLowerCase().includes(query) ||
        member.busNo.toLowerCase().includes(query)
      );
    });
  };

  const renderStaffRoleTabs = () => {
    const roles = [
      { filter: "all", label: "All Staff", roleKey: null },
      { filter: "drivers", label: "Drivers", roleKey: "driver" },
      { filter: "dispatchers", label: "Dispatchers", roleKey: "dispatcher" },
      { filter: "maintenance", label: "Maintenance", roleKey: "maintenance" }
    ];
    return roles.map(({ filter, label, roleKey }) => {
      const count = roleKey
        ? adminStaffMembersData.filter((member) => member.roleKey === roleKey).length
        : adminStaffMembersData.length;
      return `<button class="staff-role-pill${activeStaffRoleFilter === filter ? " is-active" : ""}" type="button" data-staff-role-filter="${filter}">${label} (${count})</button>`;
    }).join("");
  };

  const renderStaffPagination = (filteredCount) => {
    const pageCount = Math.ceil(filteredCount / staffPageSize);
    if (pageCount === 0) return "";
    const pageButtons = Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      return `<button class="staff-page-btn${staffCurrentPage === page ? " is-active" : ""}" type="button" data-staff-page="${page}" aria-current="${staffCurrentPage === page ? "page" : "false"}">${page}</button>`;
    }).join("");
    return `
      <button class="staff-page-btn" type="button" data-staff-page="prev" aria-label="Previous page"${staffCurrentPage === 1 ? " disabled" : ""}>&lt;</button>
      ${pageButtons}
      <button class="staff-page-btn" type="button" data-staff-page="next" aria-label="Next page"${staffCurrentPage === pageCount ? " disabled" : ""}>&gt;</button>
    `;
  };

  const updateStaffDirectory = () => {
    const filtered = getFilteredStaffMembers();
    const pageCount = Math.ceil(filtered.length / staffPageSize);
    staffCurrentPage = Math.min(Math.max(staffCurrentPage, 1), Math.max(pageCount, 1));
    const start = filtered.length === 0 ? 0 : (staffCurrentPage - 1) * staffPageSize + 1;
    const end = Math.min(staffCurrentPage * staffPageSize, filtered.length);
    const rangeText = `Showing ${start}-${end} of ${filtered.length} staff`;
    const visibleCount = filtered.length === 0 ? 0 : end - start + 1;
    const tableBody = screen.querySelector("#staff-table-tbody");
    if (tableBody) tableBody.innerHTML = renderStaffTableRows();
    const tabs = screen.querySelector(".staff-role-tabs");
    if (tabs) tabs.innerHTML = renderStaffRoleTabs();
    screen.querySelectorAll("[data-staff-count-summary]").forEach((summary) => {
      summary.innerHTML = `Showing <strong>${visibleCount}</strong> of <strong>${filtered.length}</strong> matching staff`;
    });
    const pagination = screen.querySelector("#staff-pagination-nav");
    if (pagination) pagination.innerHTML = renderStaffPagination(filtered.length);
    const paginationCount = screen.querySelector("#staff-pagination-count");
    if (paginationCount) paginationCount.textContent = rangeText;
    updateStaffSelectionControls();
  };

  const renderStaffTableRows = () => {
    const filtered = getFilteredStaffMembers();
    const pageCount = Math.ceil(filtered.length / staffPageSize);
    staffCurrentPage = Math.min(Math.max(staffCurrentPage, 1), Math.max(pageCount, 1));
    const pageRows = filtered.slice((staffCurrentPage - 1) * staffPageSize, staffCurrentPage * staffPageSize);

    if (filtered.length === 0) {
      return `<tr><td colspan="8" style="text-align: center; padding: 32px; color: #64748b;">No matching personnel found in directory.</td></tr>`;
    }

    return pageRows.map((staff) => {
      let statusDot = `<span class="status-dot-mint"></span>`;
      if (staff.statusKey === "on-break") statusDot = `<span class="status-dot-amber"></span>`;
      else if (staff.statusKey === "off") statusDot = `<span class="status-dot-gray"></span>`;

      return `
        <tr data-staff-row="${staff.id}" class="${staffSelectedRows.has(staff.id) ? "is-selected" : ""}">
          <td style="width: 32px;">
            <input type="checkbox" class="staff-checkbox" data-staff-checkbox="${staff.id}" aria-label="Select ${escapeHtml(staff.name)}"${staffSelectedRows.has(staff.id) ? " checked" : ""}>
          </td>
          <td>
            <div class="staff-member-cell">
              <div class="staff-avatar ${staff.avatarClass}">${staff.initials}</div>
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

  const updateStaffSelectionControls = () => {
    staffSelectedRows.forEach((id) => {
      if (!adminStaffMembersData.some((member) => member.id === id)) staffSelectedRows.delete(id);
    });
    const selectedCount = staffSelectedRows.size;
    const deleteButton = screen.querySelector("[data-staff-bulk-delete]");
    if (deleteButton) {
      deleteButton.disabled = selectedCount === 0;
      deleteButton.textContent = `Delete selected (${selectedCount})`;
    }
    const checkAll = screen.querySelector("[data-staff-check-all]");
    if (checkAll) {
      checkAll.checked = adminStaffMembersData.length > 0 && adminStaffMembersData.every((member) => staffSelectedRows.has(member.id));
    }
  };

  const normalizeStaffBusNo = (busNo) => {
    const digits = String(busNo ?? "").replace(/\D/g, "");
    return digits ? digits.padStart(2, "0") : "";
  };

  const getAvailableStaffBuses = (staff) => {
    const currentBusNo = normalizeStaffBusNo(staff.busNo);
    return adminFleetData.filter((bus) => {
      const busNo = normalizeStaffBusNo(bus.busNo);
      if (!busNo) return false;
      if (busNo === currentBusNo) return true;

      const assignedToAnotherStaff = adminStaffMembersData.some((member) =>
        member.id !== staff.id && normalizeStaffBusNo(member.busNo) === busNo
      );
      const driver = bus.driver.trim();
      const hasAssignedDriver = driver !== "" && driver.toLowerCase() !== "unassigned" && driver !== staff.name;
      return !assignedToAnotherStaff && !hasAssignedDriver;
    });
  };

  const renderStaffBusOptions = (staff) => `
    <option value="-"${!normalizeStaffBusNo(staff.busNo) ? " selected" : ""}>No bus assigned</option>
    ${getAvailableStaffBuses(staff).map((bus) => {
      const busNo = normalizeStaffBusNo(bus.busNo);
      return `<option value="${escapeHtml(busNo)}"${busNo === normalizeStaffBusNo(staff.busNo) ? " selected" : ""}>${escapeHtml(bus.busNo)}</option>`;
    }).join("")}
  `;

  const adminStaffResourcesView = () => `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row">
      <div class="admin-header-title-box">
        <h1 class="admin-header-title">Staff Management</h1>
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
            ${renderStaffRoleTabs()}
          </div>
        </div>

        <div class="staff-directory-tools-right">
          <span class="staff-count-summary" data-staff-count-summary>Showing <strong>${Math.min(staffPageSize, getFilteredStaffMembers().length)}</strong> of <strong>${getFilteredStaffMembers().length}</strong> matching staff</span>
          <button class="staff-bulk-delete-btn" type="button" data-staff-bulk-delete disabled>Delete selected (0)</button>
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
        <div class="staff-pagination-nav" id="staff-pagination-nav">${renderStaffPagination(getFilteredStaffMembers().length)}</div>
        <span class="staff-pagination-count" id="staff-pagination-count">Showing 1-${Math.min(staffPageSize, getFilteredStaffMembers().length)} of ${getFilteredStaffMembers().length} staff</span>
      </div>
    </section>
  `;

  const adminCameraFeedsData = [
    {
      id: "cam-01",
      code: "CAM 3.1/ws",
      title: "Trinoma Platform Bay 1",
      location: "trinoma",
      locationLabel: "Trinoma",
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
      location: "fleet",
      locationLabel: "On Buses",
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
      title: "NLEX Balintawak",
      location: "nlex",
      locationLabel: "Along NLEX",
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
      location: "depot",
      locationLabel: "Malolos Depot",
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
      location: "fleet",
      locationLabel: "On Buses",
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
      location: "trinoma",
      locationLabel: "Trinoma",
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
    if (activeCameraLocationFilter !== "all") {
      feeds = feeds.filter((f) => f.location === activeCameraLocationFilter);
    }
    if (cameraSearchQuery.trim()) {
      const q = cameraSearchQuery.toLowerCase().trim();
      feeds = feeds.filter((f) => f.title.toLowerCase().includes(q) || f.code.toLowerCase().includes(q) || f.locationLabel.toLowerCase().includes(q));
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

  const getCameraLocationCount = (location) => adminCameraFeedsData.filter((camera) => camera.location === location).length;

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
        <h1 class="admin-header-title">Cameras &amp; Devices</h1>
      </div>

      <div class="admin-header-actions">
        <!-- Search Feeds -->
        <div class="staff-header-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" class="staff-header-search-input" placeholder="Search cameras or ID..." value="${escapeHtml(cameraSearchQuery)}" data-cctv-search aria-label="Search camera feeds">
        </div>

        <!-- Camera Location Filter -->
        <select class="admin-select-corridor" data-cctv-filter aria-label="Filter cameras by location">
          <option value="all"${activeCameraLocationFilter === "all" ? " selected" : ""}>All Camera Locations (${adminCameraFeedsData.length})</option>
          <option value="trinoma"${activeCameraLocationFilter === "trinoma" ? " selected" : ""}>Trinoma (${getCameraLocationCount("trinoma")})</option>
          <option value="fleet"${activeCameraLocationFilter === "fleet" ? " selected" : ""}>On Buses (${getCameraLocationCount("fleet")})</option>
          <option value="nlex"${activeCameraLocationFilter === "nlex" ? " selected" : ""}>Along NLEX (${getCameraLocationCount("nlex")})</option>
          <option value="depot"${activeCameraLocationFilter === "depot" ? " selected" : ""}>Malolos Depot (${getCameraLocationCount("depot")})</option>
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
          <button class="cctv-btn-settings${cctvSettingsPopupOpen ? " is-active" : ""}" type="button" data-cctv-action="toggle-settings-popup" title="Camera Settings" aria-expanded="${cctvSettingsPopupOpen}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Camera Settings</span>
          </button>

          ${cctvSettingsPopupOpen ? `
            <div class="cctv-settings-popup" id="cctv-settings-popup" role="dialog" aria-label="Camera Options">
              <div class="cctv-popup-header">
                <span class="cctv-popup-title">Camera Display Options</span>
                <button class="cctv-popup-close-btn" type="button" data-cctv-action="close-settings-popup" aria-label="Close settings popup">✕</button>
              </div>

              <div class="cctv-popup-items">
                <!-- AI HUD Toggle Row -->
                <div class="cctv-toggle-row">
                  <div class="cctv-toggle-info">
                    <span class="cctv-toggle-label">Passenger Count Overlay</span>
                    <span class="cctv-toggle-desc">Show sample passenger counts on the camera view</span>
                  </div>
                  <button class="admin-toggle-switch${cameraAiDetectionEnabled ? " is-on" : ""}" type="button" data-cctv-toggle="ai" role="switch" aria-checked="${cameraAiDetectionEnabled}" aria-label="Toggle AI Detection HUD">
                    <span class="admin-toggle-thumb"></span>
                  </button>
                </div>

                <!-- CRT Scanlines Toggle Row -->
                <div class="cctv-toggle-row">
                  <div class="cctv-toggle-info">
                    <span class="cctv-toggle-label">Camera Guide Lines</span>
                    <span class="cctv-toggle-desc">Show guide lines on the camera view</span>
                  </div>
                  <button class="admin-toggle-switch${cameraScanlinesEnabled ? " is-on" : ""}" type="button" data-cctv-toggle="scanlines" role="switch" aria-checked="${cameraScanlinesEnabled}" aria-label="Toggle Scanlines">
                    <span class="admin-toggle-thumb"></span>
                  </button>
                </div>

                <!-- Live OSD Bar Toggle Row -->
                <div class="cctv-toggle-row">
                  <div class="cctv-toggle-info">
                    <span class="cctv-toggle-label">Camera Details</span>
                    <span class="cctv-toggle-desc">Show image quality and connection details</span>
                  </div>
                  <button class="admin-toggle-switch${cameraOsdEnabled ? " is-on" : ""}" type="button" data-cctv-toggle="osd" role="switch" aria-checked="${cameraOsdEnabled}" aria-label="Toggle camera details">
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
          <span>Add Camera</span>
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
              <span class="cctv-k">Response time</span>
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
              <span class="cctv-k">Connection</span>
              <span class="cctv-v">Connected</span>
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
              <span class="cctv-k">Sensor storage</span>
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
            <button class="cctv-tab-btn${cameraWaveformTab === "ai" ? " is-active" : ""}" type="button" data-cctv-waveform-tab="ai">Passenger Counts</button>
            <button class="cctv-tab-btn${cameraWaveformTab === "debug" ? " is-active" : ""}" type="button" data-cctv-waveform-tab="debug">Device Status</button>
          </div>
          <button class="cctv-btn-calibrate" type="button" data-cctv-action="calibrate" title="Check camera and sensor settings">
            <span>Check Settings</span>
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
      routeId: activeRoute.id,
      corridorLabel: activeRoute.label,
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
      title: "Bus Schedule and On-Time Performance",
      category: "otp",
      categoryLabel: "Bus Schedules",
      dateRange: "Oct 14 - Oct 20, 2026",
      summaryMetric: "93.4% OTP",
      secondaryMetric: "Average schedule gap: +2.1 min",
      author: "Dispatch Control (Shift A)",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "PDF",
      fileSize: "2.1 MB",
      routeId: activeRoute.id,
      corridorLabel: activeRoute.label,
      details: {
        tripsScheduled: 840,
        tripsCompleted: 836,
        tripsDelayed: 52,
        cancellations: 4,
        auditorNote: "Peak afternoon rain on Oct 18 caused an +8 minute delay near Balintawak on NLEX."
      }
    },
    {
      id: "REP-2026-1046",
      title: "Driver Shift Hours & Safety Compliance Audit",
      category: "crew",
      categoryLabel: "Staff",
      dateRange: "Oct 01 - Oct 15, 2026",
      summaryMetric: "1,840 Hours Logged",
      secondaryMetric: "98.8% Rest Rule Compliance",
      author: "Jocky King Cabataña (Admin)",
      status: "Pending Review",
      statusClass: "pending",
      fileFormat: "CSV",
      fileSize: "840 KB",
      routeId: activeRoute.id,
      corridorLabel: activeRoute.label,
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
      routeId: activeRoute.id,
      corridorLabel: activeRoute.label,
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
      title: "Passenger Demand and Stop Times",
      category: "otp",
      categoryLabel: "Bus Schedules",
      dateRange: "Oct 16 - Oct 19, 2026",
      summaryMetric: "28,450 Commuters",
      secondaryMetric: "Avg Platform Dwell: 1m 45s",
      author: "Demand Estimate",
      status: "Audited",
      statusClass: "audited",
      fileFormat: "PDF",
      fileSize: "1.8 MB",
      routeId: activeRoute.id,
      corridorLabel: activeRoute.label,
      details: {
        peakWindow: "17:00 - 19:30 PHT",
        maxLoadCorridor: "Trinoma Landmark Bus Bay (98% capacity)",
        dwellExceedances: 8,
        auditorNote: "Three standby coaches on the active route recovered passenger queues within 18 minutes."
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
      routeId: activeRoute.id,
      corridorLabel: activeRoute.label,
      details: {
        conductorsAudited: 48,
        inspectedPOSReceipts: 34200,
        unsettledDiscrepancies: "None",
        auditorNote: "All conductor handheld POS validator logs reconciled with Treasury vault deposits."
      }
    }
  ];

  const getTripLogDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return getDateInputValue(date);
  };
  const tripLogData = [
    { busNo: "Bus 01", routeId: "malolos-trinoma", departure: "05:40 AM", arrival: "07:18 AM", driver: "Jocky King Garcia", dispatcher: "Klintroy Suerte Felipe", regularPassengers: 31, studentPassengers: 12, daysAgo: 0 },
    { busNo: "Bus 02", routeId: "trinoma-malolos", departure: "06:05 AM", arrival: "07:42 AM", driver: "Juan Dela Cruz", dispatcher: "Ross Anthony Jobs", regularPassengers: 27, studentPassengers: 16, daysAgo: 0 },
    { busNo: "Bus 03", routeId: "malolos-trinoma", departure: "06:30 AM", arrival: "08:11 AM", driver: "Cyrhyl Naval", dispatcher: "Klintroy Suerte Felipe", regularPassengers: 35, studentPassengers: 9, daysAgo: 0 },
    { busNo: "Bus 04", routeId: "trinoma-malolos", departure: "07:00 AM", arrival: "08:39 AM", driver: "Royce Zaldivar", dispatcher: "Ross Anthony Jobs", regularPassengers: 24, studentPassengers: 21, daysAgo: 0 },
    { busNo: "Bus 05", routeId: "malolos-trinoma", departure: "07:25 AM", arrival: "09:06 AM", driver: "Jericho Rosales", dispatcher: "Klintroy Suerte Felipe", regularPassengers: 32, studentPassengers: 14, daysAgo: 0 },
    { busNo: "Bus 06", routeId: "trinoma-malolos", departure: "08:10 AM", arrival: "09:49 AM", driver: "Joshua Garcia", dispatcher: "Ross Anthony Jobs", regularPassengers: 29, studentPassengers: 18, daysAgo: 0 },
    { busNo: "Bus 07", routeId: "malolos-trinoma", departure: "09:00 AM", arrival: "10:43 AM", driver: "Mark Anthony Reyes", dispatcher: "Klintroy Suerte Felipe", regularPassengers: 38, studentPassengers: 11, daysAgo: 0 },
    { busNo: "Bus 08", routeId: "trinoma-malolos", departure: "09:35 AM", arrival: "11:13 AM", driver: "Paolo Mendoza", dispatcher: "Ross Anthony Jobs", regularPassengers: 26, studentPassengers: 20, daysAgo: 0 },
    { busNo: "Bus 01", routeId: "trinoma-malolos", departure: "05:45 AM", arrival: "07:25 AM", driver: "Jocky King Garcia", dispatcher: "Klintroy Suerte Felipe", regularPassengers: 30, studentPassengers: 13, daysAgo: 1 },
    { busNo: "Bus 03", routeId: "trinoma-malolos", departure: "06:20 AM", arrival: "08:02 AM", driver: "Cyrhyl Naval", dispatcher: "Ross Anthony Jobs", regularPassengers: 33, studentPassengers: 17, daysAgo: 2 },
    { busNo: "Bus 05", routeId: "trinoma-malolos", departure: "07:10 AM", arrival: "08:52 AM", driver: "Jericho Rosales", dispatcher: "Klintroy Suerte Felipe", regularPassengers: 28, studentPassengers: 15, daysAgo: 3 },
    { busNo: "Bus 07", routeId: "trinoma-malolos", departure: "08:00 AM", arrival: "09:41 AM", driver: "Mark Anthony Reyes", dispatcher: "Ross Anthony Jobs", regularPassengers: 36, studentPassengers: 10, daysAgo: 5 }
  ].map((trip, index) => ({
    ...trip,
    id: `TRIP-${String(index + 1).padStart(3, "0")}`,
    date: getTripLogDate(trip.daysAgo)
  }));

  const renderReportsTableRows = () => {
    let list = tripLogData;
    if (!showAllTripLogs) {
      list = list.filter((trip) => trip.date === activeTripLogDate);
    }
    if (reportsSearchQuery.trim()) {
      const q = reportsSearchQuery.toLowerCase().trim();
      list = list.filter((trip) => [trip.busNo, trip.driver, trip.dispatcher, routes.find((route) => route.id === trip.routeId)?.label ?? ""]
        .some((value) => value.toLowerCase().includes(q)));
    }

    if (list.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; padding: 28px; color: #94a3b8;">${showAllTripLogs ? "No trip logs match your search." : `No bus trips found for ${escapeHtml(activeTripLogDate)}. Choose another date or show all trips.`}</td></tr>`;
    }

    return list.map((trip) => {
      const route = routes.find((item) => item.id === trip.routeId);
      if (!route) throw new Error(`Trip log ${trip.id} references an unknown route "${trip.routeId}".`);
      const passengerCount = trip.regularPassengers + trip.studentPassengers;
      const revenue = trip.regularPassengers * 120 + trip.studentPassengers * 100;
      const displayDate = new Date(`${trip.date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      return `
      <tr class="reports-table-row">
        <td>
          <span class="reports-period-text">${displayDate}</span>
        </td>
        <td>
          <div class="reports-title-cell">
            <strong class="reports-item-title">${escapeHtml(trip.busNo)}</strong>
            <span class="reports-item-corridor">${escapeHtml(route.label)}</span>
          </div>
        </td>
        <td>
          <div class="reports-metric-cell">
            <span class="reports-metric-primary">${trip.departure}</span>
            <span class="reports-metric-secondary">Arrived ${trip.arrival}</span>
          </div>
        </td>
        <td>
          <span>${escapeHtml(trip.driver)}</span>
        </td>
        <td>
          <div class="reports-metric-cell">
            <span class="reports-metric-primary">${passengerCount} passengers</span>
            <span class="reports-metric-secondary">${trip.regularPassengers} regular · ${trip.studentPassengers} student</span>
          </div>
        </td>
        <td>
          <span>${escapeHtml(trip.dispatcher)}</span>
        </td>
        <td>
          <div class="reports-metric-cell">
            <strong class="reports-metric-primary">${formatPhp(revenue)}</strong>
            <span class="reports-metric-secondary">Regular ₱120 · Student ₱100</span>
          </div>
        </td>
      </tr>
    `;
    }).join("");
  };

  const reportsTrendData = {
    weekly: {
      periodLabel: "Last 7 days",
      revenueLabel: "Daily revenue",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: [138000, 154500, 149800, 171200, 168900, 190400, 176350],
      passengers: [4210, 4480, 4390, 4760, 4680, 5180, 4920]
    },
    monthly: {
      periodLabel: "October 2026 · month to date",
      revenueLabel: "Weekly revenue",
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      revenue: [291000, 304500, 317800, 335350],
      passengers: [33100, 34750, 36600, 38430]
    },
    annual: {
      periodLabel: "January–October 2026 · year to date",
      revenueLabel: "Monthly revenue",
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      revenue: [1080000, 1125000, 1050000, 1180000, 1195000, 1160000, 1220000, 1240000, 1175000, 1248650],
      passengers: [126400, 130200, 124800, 135100, 137500, 132600, 140300, 143200, 136900, 142880]
    }
  };

  const formatChartValue = (value, type) => {
    if (type === "revenue") return value >= 1000000 ? `₱${(value / 1000000).toFixed(1)}m` : `₱${Math.round(value / 1000)}k`;
    return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : String(value);
  };

  const renderReportsTrendBars = (values, labels, type) => {
    const maxValue = Math.max(...values);
    return values.map((value, index) => `
      <div class="reports-trend-column" tabindex="0" aria-label="${labels[index]}: ${type === "revenue" ? formatPhp(value) : `${value.toLocaleString()} passengers`}" aria-describedby="reports-${type}-${index}-tooltip">
        <span class="reports-trend-value">${formatChartValue(value, type)}</span>
        <div class="reports-trend-track" style="--bar-height: ${Math.max(8, value / maxValue * 100)}%">
          <span class="reports-trend-bar${type === "passengers" ? " passengers" : ""}"></span>
          <span class="reports-chart-tooltip" id="reports-${type}-${index}-tooltip" role="tooltip">${labels[index]} · ${type === "revenue" ? formatPhp(value) : `${value.toLocaleString()} passengers`}</span>
        </div>
        <span class="reports-trend-label">${labels[index]}</span>
      </div>
    `).join("");
  };

  const renderReportsRevenueLine = (values, labels) => {
    const maxValue = Math.max(...values) * 1.12;
    const points = values.map((value, index) => ({
      x: values.length === 1 ? 500 : 36 + index * 928 / (values.length - 1),
      y: 178 - value / maxValue * 140,
      value,
      label: labels[index]
    }));
    const pointList = points.map(({ x, y }) => `${x},${y}`).join(" ");
    const areaPath = `M ${points[0].x},178 L ${points.map(({ x, y }) => `${x},${y}`).join(" L ")} L ${points[points.length - 1].x},178 Z`;
    const gridLines = [38, 83, 128, 173].map((y) => `<line x1="36" y1="${y}" x2="964" y2="${y}" class="reports-line-gridline"/>`).join("");
    const markers = points.map((point, index) => {
      const hitStart = index === 0 ? 20 : (points[index - 1].x + point.x) / 2;
      const hitEnd = index === points.length - 1 ? 980 : (point.x + points[index + 1].x) / 2;
      return `
        <g class="reports-line-point" tabindex="0" role="img" aria-label="${point.label}: ${formatPhp(point.value)}" aria-describedby="reports-revenue-tooltip" data-tooltip="${point.label} · ${formatPhp(point.value)}">
          <rect x="${hitStart}" y="22" width="${hitEnd - hitStart}" height="158" class="reports-line-hit-area"/>
          <line x1="${point.x}" y1="${point.y + 8}" x2="${point.x}" y2="178" class="reports-line-guide"/>
          <circle cx="${point.x}" cy="${point.y}" r="5" class="reports-line-marker"/>
          <title>${point.label}: ${formatPhp(point.value)}</title>
        </g>
      `;
    }).join("");

    return `
      <svg class="reports-line-chart-svg" viewBox="0 0 1000 205" preserveAspectRatio="none" role="group" aria-label="Fare revenue line chart">
        ${gridLines}
        <path d="${areaPath}" class="reports-line-area"/>
        <polyline points="${pointList}" class="reports-line-path"/>
        ${markers}
      </svg>
      <div class="reports-line-tooltip" id="reports-revenue-tooltip" role="tooltip" aria-hidden="true"></div>
      <div class="reports-line-xlabels" style="--reports-point-count: ${labels.length}">
        ${labels.map((label) => `<span>${label}</span>`).join("")}
      </div>
    `;
  };

  const renderReportsDecisionCharts = () => {
    const trend = reportsTrendData[activeRevenueChartPeriod];
    const revenueTotal = trend.revenue.reduce((total, value) => total + value, 0);
    const passengerTotal = trend.passengers.reduce((total, value) => total + value, 0);
    const snapshot = getDispatchSnapshot();
    const cashShare = reportingSummary.cashRevenueMonthToDate / reportingSummary.revenueMonthToDate * 100;
    const pouchShare = 100 - cashShare;
    const activeShare = snapshot.movingUnits.length / adminFleetSize * 100;
    const efficiencyShare = Math.min(100, reportingSummary.fleetEfficiency / 4.5 * 100);

    return `
      <div class="reports-trend-grid">
        <section class="reports-visual-card reports-primary-chart" aria-label="Revenue trend">
          <div class="reports-visual-header">
            <div>
              <h2 class="reports-visual-title">Fare revenue</h2>
              <p class="reports-visual-caption">${trend.revenueLabel} · ${trend.periodLabel}</p>
            </div>
            <div class="reports-chart-total">${formatPhp(revenueTotal)}<span>selected period</span></div>
          </div>
          <div class="reports-line-chart revenue-chart" aria-label="${trend.revenueLabel} from ${trend.periodLabel}">
            ${renderReportsRevenueLine(trend.revenue, trend.labels)}
          </div>
        </section>

        <section class="reports-visual-card reports-ridership-chart" aria-label="Passenger trend">
          <div class="reports-visual-header">
            <div>
              <h2 class="reports-visual-title">Passenger volume</h2>
              <p class="reports-visual-caption">${trend.periodLabel}</p>
            </div>
            <div class="reports-chart-total">${passengerTotal.toLocaleString()}<span>passengers</span></div>
          </div>
          <div class="reports-trend-chart passenger-chart" role="group" aria-label="Passenger volume from ${trend.periodLabel}">
            ${renderReportsTrendBars(trend.passengers, trend.labels, "passengers")}
          </div>
        </section>
      </div>

      <div class="reports-insight-grid">
        <section class="reports-visual-card reports-insight-card">
          <div class="reports-insight-heading">
            <h2 class="reports-visual-title">Revenue collection mix</h2>
            <span class="reports-visual-caption">Month to date</span>
          </div>
          <div class="reports-mix-track" tabindex="0" role="img" aria-label="Cash ${cashShare.toFixed(0)} percent, U-Pouch ${pouchShare.toFixed(0)} percent" data-tooltip="Cash ${cashShare.toFixed(0)}% · ${formatPhp(reportingSummary.cashRevenueMonthToDate)} | U-Pouch ${pouchShare.toFixed(0)}% · ${formatPhp(reportingSummary.pouchRevenueMonthToDate)}">
            <span class="reports-mix-cash" style="width: ${cashShare}%"></span>
            <span class="reports-mix-pouch" style="width: ${pouchShare}%"></span>
          </div>
          <div class="reports-mix-legend">
            <span><i class="reports-legend-dot cash"></i>Cash <strong>${cashShare.toFixed(0)}%</strong><small>${formatPhp(reportingSummary.cashRevenueMonthToDate)}</small></span>
            <span><i class="reports-legend-dot pouch"></i>U-Pouch <strong>${pouchShare.toFixed(0)}%</strong><small>${formatPhp(reportingSummary.pouchRevenueMonthToDate)}</small></span>
          </div>
        </section>

        <section class="reports-visual-card reports-insight-card">
          <div class="reports-insight-heading">
            <h2 class="reports-visual-title">Fleet deployment</h2>
            <span class="reports-visual-caption">Dispatch snapshot</span>
          </div>
          <div class="reports-deployment-value">${snapshot.movingUnits.length}<span> / ${adminFleetSize} buses active</span></div>
          <div class="reports-deployment-track" tabindex="0" role="img" aria-label="${snapshot.movingUnits.length} of ${adminFleetSize} fleet buses active" data-tooltip="${snapshot.movingUnits.length} of ${adminFleetSize} buses active · ${snapshot.movingUnits.filter((unit) => unit.statusType === "on-time").length} on time · ${snapshot.delayedUnits.length} delayed · ${snapshot.terminalUnits.length} at terminal">
            <span style="width: ${activeShare}%"></span>
          </div>
          <div class="reports-deployment-legend"><span>${snapshot.movingUnits.filter((unit) => unit.statusType === "on-time").length} on time</span><span>${snapshot.delayedUnits.length} delayed</span><span>${snapshot.terminalUnits.length} at terminal</span></div>
        </section>

        <section class="reports-visual-card reports-insight-card">
          <div class="reports-insight-heading">
            <h2 class="reports-visual-title">Fuel efficiency</h2>
            <span class="reports-visual-caption">Month to date</span>
          </div>
          <div class="reports-efficiency-value">${reportingSummary.fleetEfficiency}<span> km/L</span></div>
          <div class="reports-efficiency-track" tabindex="0" role="img" aria-label="${reportingSummary.fleetEfficiency} kilometers per liter, planning benchmark 3.5 kilometers per liter" data-tooltip="Fleet average: ${reportingSummary.fleetEfficiency} km/L · Benchmark: 3.5 km/L">
            <span style="width: ${efficiencyShare}%"></span>
            <i style="left: 77.78%"></i>
          </div>
          <div class="reports-efficiency-legend"><span>Current fleet average</span><span>Benchmark: 3.5 km/L</span></div>
        </section>
      </div>
    `;
  };

  const adminReportsView = () => {
    const dispatchSnapshot = getDispatchSnapshot();
    return `
    <!-- Top Title & Action Header -->
    <header class="admin-header-row reports-header-row">
      <div class="admin-header-title-box">
  <h1 class="admin-header-title">Reports &amp; Decision Support</h1>
      </div>

    </header>

    <p class="admin-kpi-context">Illustrative trip logs · Times, passenger counts and revenue are sample data. Fare totals use ₱120 per regular passenger and ₱100 per student passenger.</p>
    <section class="reports-kpi-grid" aria-label="Executive Operational Totals">
      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Fare revenue (MTD)</span>
          <span class="reports-growth-badge neutral">Month to date</span>
        </div>
        <div class="reports-kpi-figure">${formatPhp(reportingSummary.revenueMonthToDate)}</div>
        <div class="reports-kpi-sub">Average ${formatPhp(dailyRevenue.total)}/day · Cash: <strong>${formatPhp(reportingSummary.cashRevenueMonthToDate)}</strong> · U-Pouch: <strong>${formatPhp(reportingSummary.pouchRevenueMonthToDate)}</strong></div>
      </article>

      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Passengers (MTD)</span>
          <span class="reports-growth-badge neutral">Period total</span>
        </div>
        <div class="reports-kpi-figure">${reportingSummary.passengersMonthToDate.toLocaleString()} Pax</div>
        <div class="reports-kpi-sub">Average ${reportingSummary.passengersAveragePerDay.toLocaleString()} pax/day · <strong>${reportingSummary.concessionPassengersMonthToDate.toLocaleString()}</strong> concession/student fares</div>
      </article>

      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Active buses (snapshot)</span>
          <span class="reports-growth-badge neutral">${adminFleetSize} fleet units</span>
        </div>
        <div class="reports-kpi-figure accent">${dispatchSnapshot.movingUnits.length} buses</div>
        <div class="reports-kpi-sub">${dispatchSnapshot.movingUnits.filter((unit) => unit.statusType === "on-time").length} on time · <strong>${dispatchSnapshot.delayedUnits.length} delayed</strong> · ${dispatchSnapshot.terminalUnits.length} at terminal</div>
      </article>

      <article class="reports-kpi-card">
        <div class="reports-kpi-header">
          <span class="reports-kpi-label">Fuel efficiency (MTD)</span>
          <span class="reports-growth-badge neutral">${reportingSummary.dieselLiters.toLocaleString()} L diesel</span>
        </div>
        <div class="reports-kpi-figure">${reportingSummary.fleetEfficiency} km/L</div>
        <div class="reports-kpi-sub">${reportingSummary.operatingKilometers.toLocaleString()} km operated · Cost: <strong>₱${reportingSummary.operatingCostPerKilometer}/km</strong></div>
      </article>
    </section>

    <section class="reports-visualizations" aria-label="Operational decision visualizations">
      <div class="reports-visual-toolbar">
        <div>
          <h2 class="reports-visual-title">Performance trends</h2>
          <p class="reports-visual-caption">Compare revenue and passenger demand over time</p>
        </div>
        <label class="reports-period-control">View
          <select class="admin-select-corridor" data-revenue-period aria-label="Revenue chart period">
            <option value="weekly"${activeRevenueChartPeriod === "weekly" ? " selected" : ""}>Weekly</option>
            <option value="monthly"${activeRevenueChartPeriod === "monthly" ? " selected" : ""}>Monthly</option>
            <option value="annual"${activeRevenueChartPeriod === "annual" ? " selected" : ""}>Annual</option>
          </select>
        </label>
      </div>
      <div id="reports-decision-charts">${renderReportsDecisionCharts()}</div>
    </section>

    <!-- Main Reports Hub & Table Card -->
    <section class="reports-table-card" aria-labelledby="reports-library-title">
      <div class="reports-library-heading">
        <h2 class="reports-library-title" id="reports-library-title">Report library</h2>
        <div class="reports-log-controls">
          <label class="reports-log-date-label" for="reports-trip-date">Trip date
            <input class="admin-select-corridor reports-log-date" id="reports-trip-date" type="date" value="${activeTripLogDate}" data-trip-log-date aria-label="Filter trips by date">
          </label>
          <button class="reports-show-all-btn${showAllTripLogs ? " is-active" : ""}" type="button" data-trip-log-show-all aria-pressed="${showAllTripLogs}">${showAllTripLogs ? "Show selected date" : "Show all"}</button>
          <div class="staff-header-search-wrap reports-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="staff-header-search-input" placeholder="Search bus, driver, dispatcher..." value="${escapeHtml(reportsSearchQuery)}" data-report-search aria-label="Search trip logs">
          </div>
        </div>
      </div>

      <div class="reports-table-wrap">
        <table class="reports-table">
          <thead>
            <tr>
              <th>TRIP DATE</th>
              <th>BUS &amp; ROUTE</th>
              <th>DEPARTED / ARRIVED</th>
              <th>DRIVER</th>
              <th>PASSENGERS</th>
              <th>DISPATCHER</th>
              <th>TRIP REVENUE</th>
            </tr>
          </thead>
          <tbody id="reports-table-tbody">
            ${renderReportsTableRows()}
          </tbody>
        </table>
      </div>
    </section>
  `;
  };

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

          <nav class="admin-nav" aria-label="Main Navigation">
            <button class="admin-nav-item${activeAdminSidebarTab === "live-operations" ? " is-active" : ""}" type="button" data-admin-nav="live-operations" aria-current="${activeAdminSidebarTab === "live-operations" ? "page" : "false"}">
              <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
              <span>Dashboard</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "predictive-analytics" ? " is-active" : ""}" type="button" data-admin-nav="predictive-analytics" aria-current="${activeAdminSidebarTab === "predictive-analytics" ? "page" : "false"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
              <span>Passenger Demand</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "fleet-dispatch" ? " is-active" : ""}" type="button" data-admin-nav="fleet-dispatch" aria-current="${activeAdminSidebarTab === "fleet-dispatch" ? "page" : "false"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Fleet</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "staff-resources" ? " is-active" : ""}" type="button" data-admin-nav="staff-resources" aria-current="${activeAdminSidebarTab === "staff-resources" ? "page" : "false"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Staff Management</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "sensor-camera" ? " is-active" : ""}" type="button" data-admin-nav="sensor-camera" aria-current="${activeAdminSidebarTab === "sensor-camera" ? "page" : "false"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <span>Cameras &amp; Devices</span>
            </button>
            <button class="admin-nav-item${activeAdminSidebarTab === "reports" ? " is-active" : ""}" type="button" data-admin-nav="reports" aria-current="${activeAdminSidebarTab === "reports" ? "page" : "false"}">
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
            <span class="admin-profile-label">System Access</span>
            <span class="admin-profile-value">Vehicle tracking, bus assignments, schedules</span>
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
            <select class="admin-input" id="assign-bus" required style="height: 40px;">
              ${renderAssignableBusOptions()}
            </select>
          </div>
          <div class="admin-form-field">
            <label for="assign-driver" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assign Driver</label>
            <select class="admin-input" id="assign-driver" required style="height: 40px;">
              ${renderStaffDriverOptions()}
            </select>
          </div>
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Route</label>
            <select class="admin-input" id="assign-route" style="height: 40px;">
              ${renderRouteOptions(activeRoute.id)}
            </select>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Save Assignment</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("fleet-actions-")) {
      const busId = type.replace("fleet-actions-", "");
      const bus = adminFleetData.find((item) => item.id === busId);
      if (!bus) throw new Error(`Fleet actions could not be opened: vehicle "${busId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-2.4v-.21a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.52 15a1.7 1.7 0 0 0-1.55-1H6v-2.4h.97a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V5h2.4v.81a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1H22v2.4h-1.05a1.7 1.7 0 0 0-1.55 1.6Z"/></svg>`;
      title = `Vehicle Actions — ${bus.busNo}`;
      desc = `Choose an action for <strong>${bus.busNo}</strong> on <strong>${bus.route}</strong>.`;
      customHtml = `
        <div class="fleet-action-menu">
          <button type="button" data-fleet-action="telemetry" data-fleet-id="${bus.id}">
            <strong>View telemetry</strong><span>Review speed, fuel, GPS and onboard load.</span>
          </button>
          <button type="button" data-fleet-action="assign-driver" data-fleet-id="${bus.id}"${bus.filterCategory === "on-duty" ? " disabled" : ""}>
            <strong>${bus.filterCategory === "on-duty" ? "Driver assigned" : "Assign driver"}</strong>
            <span>${bus.filterCategory === "on-duty" ? "Driver changes are unavailable while this vehicle is on duty." : "Update the driver assigned to this vehicle."}</span>
          </button>
          <button type="button" data-fleet-action="dispatch" data-fleet-id="${bus.id}"${bus.filterCategory === "on-duty" || isBusOffDuty(bus) ? " disabled" : ""}>
            <strong>${bus.filterCategory === "on-duty" ? "Already on duty" : isBusOffDuty(bus) ? "Off-duty vehicle" : "Dispatch vehicle"}</strong>
            <span>${bus.filterCategory === "on-duty" ? "This vehicle is currently in service." : isBusOffDuty(bus) ? "Change the vehicle status before dispatching it." : "Place this vehicle into active service."}</span>
          </button>
          <p class="fleet-action-prototype-note">Actions update sample data in this prototype only.</p>
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Close</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("fleet-assign-driver-")) {
      const busId = type.replace("fleet-assign-driver-", "");
      const bus = adminFleetData.find((item) => item.id === busId);
      if (!bus) throw new Error(`Driver assignment could not be opened: vehicle "${busId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6m3-3h-6"/></svg>`;
      title = `Assign Driver — ${bus.busNo}`;
      desc = `Update the assigned driver for <strong>${bus.busNo}</strong>.`;
      customHtml = `
        <form class="admin-login-form" data-fleet-driver-form="${bus.id}" style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label for="fleet-driver-name" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Driver</label>
            <select class="admin-input" id="fleet-driver-name" name="driverId" required style="height: 40px;">
              ${renderStaffDriverOptions(adminStaffMembersData.find((member) => member.name === bus.driver && !isStaffOffDuty(member))?.id ?? "")}
            </select>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Save driver</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("fleet-dispatch-confirm-")) {
      const busId = type.replace("fleet-dispatch-confirm-", "");
      const bus = adminFleetData.find((item) => item.id === busId);
      if (!bus) throw new Error(`Vehicle dispatch could not be opened: vehicle "${busId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h17m-6-6 6 6-6 6"/><path d="M4 5v14"/></svg>`;
      const offDuty = isBusOffDuty(bus);
      title = offDuty ? `${bus.busNo} is off duty` : `Dispatch ${bus.busNo}?`;
      desc = offDuty
        ? `An off-duty vehicle cannot be dispatched. Change <strong>${bus.busNo}</strong>'s status before placing it into service.`
        : `Place <strong>${bus.busNo}</strong>, currently assigned to <strong>${bus.driver}</strong>, into active service on <strong>${bus.route}</strong>.`;
      customHtml = `
        <p class="fleet-action-prototype-note">This changes the sample fleet status only; it does not send a command to a real vehicle.</p>
        <div class="admin-modal-actions">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
          <button class="admin-modal-button-primary" type="button" data-fleet-dispatch-confirm="${bus.id}"${offDuty ? " disabled" : ""}>${offDuty ? "Dispatch unavailable" : "Confirm dispatch"}</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("telemetry-") && !type.startsWith("telemetry-delete-")) {
      const busId = type.replace("telemetry-", "");
      const bus = adminFleetData.find((b) => b.id === busId) ?? adminFleetData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
      title = `Bus Details — ${bus.busNo}`;
      desc = `Sample vehicle information · Route: <strong>${bus.route}</strong><br>Driver: <strong>${bus.driver}</strong>`;
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
            <span style="color: #64748b; display: block; font-size: 10px;">CURRENT LOCATION</span>
            <span style="color: #ffffff; font-size: 12px;">${bus.telemetry.gps}</span>
          </div>
          <div style="background: #0f1622; padding: 8px 12px; border-radius: 6px; border: 1px solid #1e2838; grid-column: span 2;">
            <span style="color: #64748b; display: block; font-size: 10px;">PASSENGER ONBOARD LOAD</span>
            <strong style="color: #2FD9A8; font-size: 13px;">${bus.telemetry.passengers} Seats Occupied</strong>
          </div>
        </div>
        <button class="admin-modal-button-secondary" type="button" style="width: 100%;" data-admin-modal-close>Close Details</button>
      `;
      isInfoOnly = true;
    } else if (type === "export-surge") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  title = "Export Demand and Surge Report (PDF / CSV)";
      const peakPeriod = predictiveDemandForecast.reduce((peak, item) => item.val > peak.val ? item : peak);
      const peakDemand = Math.round(peakPeriod.val * (predictiveTransitLoadScale / 100));
      const selectedPeriod = getPredictivePeriod();
  desc = `Preparing a sample demand report for <strong>${escapeHtml(activeRoute.label)}</strong>.<br><br>Peak ${selectedPeriod.unit}: <strong>${peakPeriod.periodLabel}</strong><br>Projected demand: <strong>${peakDemand.toLocaleString()} passengers/${selectedPeriod.unit}</strong><br>Forecast model convergence: <strong>96.4%</strong>`;
  primaryBtn = "Download Report";
      isInfoOnly = true;
    } else if (type === "approve-redistribution") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      title = "Bus Changes Applied";
      desc = `Sample changes for ${escapeHtml(activeRoute.label)}:<br><br>• Add <strong>3 standby buses</strong><br>• Reduce the time between evening buses from <strong>12 to 5 minutes</strong><br>• Deploy <strong>2 available buses</strong> from ${escapeHtml(activeRoute.origin)} depot<br><br>This prototype does not update real bus assignments.`;
      primaryBtn = "Close";
      isInfoOnly = true;
    } else if (type === "simulate-surge") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>`;
      title = "Passenger Demand Estimate";
      desc = `Sample estimate based on 1,000 simulated trips on ${escapeHtml(activeRoute.label)}.<br><br>Estimated queue wait time: <strong>42% shorter</strong> at ${escapeHtml(activeRoute.destinationShort)}.`;
      primaryBtn = "Close Estimate";
      isInfoOnly = true;
    } else if (type.startsWith("dispatch-order-sent-")) {
      const busId = type.replace("dispatch-order-sent-", "");
      const bus = fleetDispatchTelemetryUnits.find((u) => u.id === busId) || fleetDispatchTelemetryUnits[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
      title = `Assignment Saved — Bus ${bus.busNo}`;
      desc = `Sample assignment for <strong>Bus ${bus.busNo} (${bus.tripName})</strong>.<br><br>Driver: <strong>${bus.driverName}</strong><br>Dispatcher: <strong>${bus.dispatcherName}</strong><br>Route: <strong>${bus.routeCorridor}</strong><br><br>This prototype does not send instructions to a real vehicle.`;
      primaryBtn = "Close";
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
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assigned Dispatcher</label>
            <input class="admin-input" id="reassign-dispatcher-input" value="${escapeHtml(bus.dispatcherName)}" style="height: 38px;">
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
    } else if (type.startsWith("staff-edit-")) {
      const staffId = type.replace("staff-edit-", "");
      const staff = adminStaffMembersData.find((member) => member.id === staffId);
      if (!staff) throw new Error(`Staff editing could not be opened: staff member "${staffId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>`;
      title = `Edit ${staff.name}`;
      desc = "Update this staff member's roster information.";
      customHtml = `
        <form class="admin-login-form" data-admin-edit-staff-form="${staff.id}" style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label for="edit-staff-name" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Full Name</label>
            <input class="admin-input" id="edit-staff-name" name="name" value="${escapeHtml(staff.name)}" required style="height: 38px;">
          </div>
          <div class="admin-form-field">
            <label for="edit-staff-role" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Role</label>
            <select class="admin-input" id="edit-staff-role" name="role" style="height: 38px;">
              <option value="Driver"${staff.role === "Driver" ? " selected" : ""}>Driver</option>
              <option value="Dispatcher"${staff.role === "Dispatcher" ? " selected" : ""}>Dispatcher</option>
              <option value="Maintenance"${staff.role === "Maintenance" ? " selected" : ""}>Maintenance</option>
            </select>
          </div>
          <div class="admin-form-field">
            <label for="edit-staff-depot" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Depot</label>
            <select class="admin-input" id="edit-staff-depot" name="depot" style="height: 38px;">
              <option value="Trinoma Hub"${staff.depot === "Trinoma Hub" ? " selected" : ""}>Trinoma Hub</option>
              <option value="Malolos Hub"${staff.depot === "Malolos Hub" ? " selected" : ""}>Malolos Hub</option>
              <option value="Balintawak Staging"${staff.depot === "Balintawak Staging" ? " selected" : ""}>Balintawak Staging</option>
            </select>
          </div>
          <div class="admin-form-field">
            <label for="edit-staff-status" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Status</label>
            <select class="admin-input" id="edit-staff-status" name="status" style="height: 38px;">
              <option value="On Duty"${staff.status === "On Duty" ? " selected" : ""}>On Duty</option>
              <option value="On Break"${staff.status === "On Break" ? " selected" : ""}>On Break</option>
              <option value="Off"${staff.status === "Off" ? " selected" : ""}>Off</option>
            </select>
          </div>
          <div class="admin-form-field">
            <label for="edit-staff-bus" style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Assigned Bus</label>
            <select class="admin-input" id="edit-staff-bus" name="busNo" style="height: 38px;">
              ${renderStaffBusOptions(staff)}
            </select>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
            <button class="admin-modal-button-primary" type="submit">Save Changes</button>
          </div>
        </form>
      `;
      isInfoOnly = true;
    } else if (type === "staff-delete-selected") {
      const selectedStaff = adminStaffMembersData.filter((member) => staffSelectedRows.has(member.id));
      if (selectedStaff.length === 0) throw new Error("Staff removal could not be opened: no staff members are selected.");
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5m4-5v5"/></svg>`;
      title = `Delete ${selectedStaff.length} selected staff member${selectedStaff.length === 1 ? "" : "s"}?`;
      desc = "Selected staff and their matching bus assignments will be removed. This action cannot be undone.";
      customHtml = `
        <div class="admin-modal-actions" style="margin-top: 16px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
          <button class="admin-modal-button-primary" type="button" data-staff-delete-selected>Delete selected</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("staff-delete-")) {
      const staffId = type.replace("staff-delete-", "");
      const staff = adminStaffMembersData.find((member) => member.id === staffId);
      if (!staff) throw new Error(`Staff removal could not be opened: staff member "${staffId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5m4-5v5"/></svg>`;
      title = `Remove ${staff.name}?`;
      desc = "This will remove the staff member from the roster and clear any matching bus assignments. This action cannot be undone.";
      customHtml = `
        <div class="admin-modal-actions" style="margin-top: 16px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
          <button class="admin-modal-button-primary" type="button" data-staff-delete-confirm="${staff.id}">Remove Staff</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("telemetry-delete-")) {
      const busId = type.replace("telemetry-delete-", "");
      const unit = fleetDispatchTelemetryUnits.find((item) => item.id === busId);
      if (!unit) throw new Error(`Telemetry removal could not be opened: bus "${busId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5m4-5v5"/></svg>`;
      title = `Delete Bus ${escapeHtml(unit.busNo)} telemetry?`;
      desc = "This removes the sample telemetry record from the Fleet table. The fleet vehicle itself will remain in Fleet Management.";
      customHtml = `
        <div class="admin-modal-actions" style="margin-top: 16px;">
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Cancel</button>
          <button class="admin-modal-button-primary" type="button" data-telemetry-delete-confirm="${escapeHtml(unit.id)}">Delete telemetry</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("staff-detail-")) {
      const staffId = type.replace("staff-detail-", "");
      const staff = adminStaffMembersData.find((s) => s.id === staffId);
      if (!staff) throw new Error(`Staff details could not be opened: staff member "${staffId}" was not found.`);
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`;
      title = `${staff.name} (${staff.staffId})`;
      desc = `Role: <strong>${staff.role}</strong><br>Depot: <strong>${staff.depot}</strong> · Bus Assigned: <strong>${staff.busNo}</strong><br>Rate: <strong>${staff.rate}/hr</strong> (Max: ${staff.maxHours})<br>Duty Status: <strong>${staff.status}</strong>`;
      customHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button class="admin-modal-button-primary" type="button" data-staff-edit="${staff.id}">Edit Staff Information</button>
          <button class="admin-modal-button-primary" type="button" data-staff-quick-status="${staff.id}">
            Toggle Shift Status (${staff.status === "On Duty" ? "Set On Break" : "Set On Duty"})
          </button>
          <button class="admin-modal-button-secondary" type="button" data-staff-remove="${staff.id}">Remove Staff</button>
          <button class="admin-modal-button-secondary" type="button" data-admin-modal-close>Close</button>
        </div>
      `;
      isInfoOnly = true;
    } else if (type.startsWith("cctv-snapshot-")) {
      const camId = type.replace("cctv-snapshot-", "");
      const cam = adminCameraFeedsData.find((c) => c.id === camId) || adminCameraFeedsData[0];
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
      title = `Snapshot Saved — ${cam.code}`;
      desc = `Sample camera image saved.<br>Camera: <strong>${cam.title}</strong> · Location: <strong>${cam.locationLabel}</strong>`;
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
      title = `Camera View — ${cam.code}`;
      desc = `Adjust the sample view for <strong>${cam.title}</strong>.`;
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
      title = "Camera and Sensor Check";
      desc = "Sample camera and sensor checks are complete.";
      primaryBtn = "Done";
      isInfoOnly = true;
    } else if (type === "cctv-add-device") {
      icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      title = "Add Camera or Device";
      desc = "Add a camera or sensor to this sample device list.";
      customHtml = `
        <form class="admin-login-form" data-cctv-add-feed-form style="margin-top: 14px; text-align: left;">
          <div class="admin-form-field">
            <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Camera Name</label>
            <input class="admin-input" id="new-cam-title" placeholder="e.g. Balintawak South Gate" required style="height: 38px;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Camera Location</label>
              <select class="admin-input" id="new-cam-location" style="height: 38px;">
                <option value="trinoma">Trinoma</option>
                <option value="fleet">On Buses</option>
                <option value="nlex">Along NLEX</option>
                <option value="depot">Malolos Depot</option>
              </select>
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Connection Type</label>
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
                <option value="otp">Bus Schedules</option>
                <option value="crew">Crew &amp; Personnel</option>
                <option value="fuel">Fuel &amp; Maintenance</option>
              </select>
            </div>
            <div class="admin-form-field">
              <label style="font-size: 11px; color: #72849a; margin-bottom: 4px;">Route</label>
              <select class="admin-input" id="rep-gen-corridor" style="height: 38px;">
                ${renderRouteOptions(activeRoute.id)}
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
      desc = `Official transit operational audit for <strong>${report.corridorLabel}</strong>.`;
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
          <div class="password-input-wrap">
            <input id="register-password" name="password" type="password" placeholder="••••••••" autocomplete="new-password"${showError ? ' aria-invalid="true"' : ""}>
            <button class="password-visibility-toggle" type="button" data-password-toggle="register-password" aria-controls="register-password" aria-label="Show password" aria-pressed="false">Show</button>
          </div>
          <span class="field-error" id="register-password-error" role="alert" hidden>Include at least one number or special character.</span>
        </div>
        <div class="form-field">
          <label for="register-confirm-password">Confirm Password</label>
          <div class="password-input-wrap">
            <input id="register-confirm-password" name="confirmPassword" type="password" placeholder="••••••••" autocomplete="new-password"${showError ? ' aria-invalid="true"' : ""}>
            <button class="password-visibility-toggle" type="button" data-password-toggle="register-confirm-password" aria-controls="register-confirm-password" aria-label="Show confirm password" aria-pressed="false">Show</button>
          </div>
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
      <button class="nav-book" type="button" data-action="quick-book" aria-label="Book a trip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Book</span></button>
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
      <div class="map-art${compact ? " is-compact" : ""}${live ? " is-live" : ""}" role="${live ? "group" : "img"}" aria-label="Illustrative, not-to-scale route map from ${escapeHtml(activeRoute.origin)} to ${escapeHtml(activeRoute.destination)} via ${escapeHtml(activeRoute.via)}">
        <div class="map-scene">
          <span class="map-block map-block-one"></span><span class="map-block map-block-two"></span>
          <span class="map-block map-block-three"></span><span class="map-block map-block-four"></span>
          ${live ? '<span class="map-park map-park-one"></span><span class="map-park map-park-two"></span><span class="map-district-label district-malolos">MALOLOS</span><span class="map-district-label district-bocaue">BOCAUE</span><span class="map-district-label district-marilao">MARILAO</span><span class="map-district-label district-balintawak">BALINTAWAK</span><span class="map-district-label district-trinoma">TRINOMA</span>' : ""}
          <svg class="map-roads" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${roads}</svg>
          <span class="map-label map-label-one">${live ? escapeHtml(activeRoute.origin) : "MALOLOS"}</span><span class="map-label map-label-two">${live ? escapeHtml(activeRoute.destinationShort) : "TRINOMA"}</span>
          <span class="map-marker map-marker-start" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-8.1 8-13a8 8 0 1 0-16 0c0 4.9 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>
          ${live ? `<span class="map-marker map-marker-bus" data-sim-bus="0" tabindex="0" role="img" aria-label="Simulated Bus 1 on ${escapeHtml(activeRoute.label)}. 3 minutes away, 8 seats available, on time." aria-describedby="bus-tooltip-1"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg><span class="map-bus-tooltip" id="bus-tooltip-1" role="tooltip"><strong>Bus 01</strong><span>${escapeHtml(activeRoute.name)}</span><span>3 min · 8 seats</span><small>On time · Demo data</small></span></span><span class="map-marker map-marker-bus map-marker-bus-alt" data-sim-bus="1" tabindex="0" role="img" aria-label="Simulated Bus 2 on ${escapeHtml(activeRoute.label)}. Less than 1 minute away, 1 seat available, on time." aria-describedby="bus-tooltip-2"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg><span class="map-bus-tooltip" id="bus-tooltip-2" role="tooltip"><strong>Bus 02</strong><span>${escapeHtml(activeRoute.name)}</span><span>&lt;1 min · 1 seat</span><small>On time · Demo data</small></span></span>` : '<span class="map-marker map-marker-bus" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg></span>'}
          <span class="map-marker map-marker-destination" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-8.1 8-13a8 8 0 1 0-16 0c0 4.9 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>
          ${compact ? "" : '<span class="map-compass" aria-hidden="true">N</span>'}
        </div>
      </div>`;
  };

  const homeHeaderContent = ({ searchPlaceholder = "Where are you heading?", searchMode = "route", footerMarkup = null } = {}) => `
    <div class="home-header-content">
      <div class="home-greeting-row">
        <div><p class="location-kicker"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Your Location</p><h1>${escapeHtml(activeRoute.origin)}</h1></div>
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
          <button type="button" data-top-up><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Top Up</span></button>
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
            <span class="vehicle-logo">MLS<br><small>TRI</small></span>
            <span class="vehicle-info"><strong>${escapeHtml(activeRoute.name)}</strong><small>via ${escapeHtml(activeRoute.via)} · 8 seats available</small></span>
            <span class="vehicle-eta">3 min<small>On time</small></span>
          </button>
          <button class="vehicle-row" type="button" data-action="quick-book">
            <span class="vehicle-logo ochre">MLS<br><small>TRI</small></span>
            <span class="vehicle-info"><strong>${escapeHtml(activeRoute.name)}</strong><small>via ${escapeHtml(activeRoute.via)} · 1 seat available</small></span>
            <span class="vehicle-eta soon">&lt;1 min<small>On time</small></span>
          </button>
        </section>
        <p class="home-demo-note">Illustrative vehicle ETAs · No live tracking</p>
      </div>
      ${navigation("home")}
    </div>`;

  const accountVerificationScreen = () => {
    const concessionTypes = [
      { id: "student", label: "Student", detail: "₱20 Discount", icon: '<path d="M3 9 12 4l9 5-9 5-9-5Z"/><path d="M6 11v5c3.5 3 8.5 3 12 0v-5m3-2v6"/>' },
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
      ? `<div class="verification-section-label"><strong>Select Concession Type</strong><span>${discountVerificationType === "student" ? "₱20 Discount" : "Discount ID"}</span></div>
          <div class="verification-types" role="group" aria-label="Concession type">
            ${concessionTypes.map((type) => `<button type="button" class="verification-type${discountVerificationType === type.id ? " is-selected" : ""}" data-concession-type="${type.id}" aria-pressed="${discountVerificationType === type.id}"><span class="verification-type-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${type.icon}</svg></span><strong>${type.label}</strong><small>${type.id === discountVerificationType ? "Selected" : type.detail}</small></button>`).join("")}
          </div>
          <div class="verification-section-label verification-upload-heading"><strong>Document Upload</strong><span>JPG, PNG or PDF</span></div>
          <div class="verification-upload-list">${uploadCard("front", "Upload Front of ID")}${uploadCard("back", "Upload Back of School ID")}</div>
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
            <label class="payment-option${tripData.payment === "U-Pouch" ? " selected" : ""}"><input type="radio" name="payment" value="U-Pouch"${tripData.payment === "U-Pouch" ? " checked" : ""}><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/></svg></span><span><strong>U-Pouch</strong><small>₱2.00 <em>Insufficient amount</em></small></span><button type="button" data-top-up>＋ Top Up</button></label>
            <label class="payment-option${tripData.payment === "GCash" ? " selected" : ""}"><input type="radio" name="payment" value="GCash"${tripData.payment === "GCash" ? " checked" : ""}><span class="payment-icon gcash">G</span><span><strong>GCash</strong><small>••••5678 · Sufficient Balance</small></span></label>
            <label class="payment-option${tripData.payment === "Credit / Debit Card" ? " selected" : ""}"><input type="radio" name="payment" value="Credit / Debit Card"${tripData.payment === "Credit / Debit Card" ? " checked" : ""}><span class="payment-icon card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg></span><span><strong>Credit / Debit Card</strong><small>••4567</small></span></label>
          </div>
          <p class="field-error payment-error" data-payment-error role="alert" hidden>U-Pouch balance is insufficient for this trip. Choose another payment method.</p>
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
      <section class="ride-list">
        <article class="ride-card"><span class="ride-logo">MLS<small>TRI</small></span><div class="ride-detail"><h2>${escapeHtml(activeRoute.name)}</h2><p>via ${escapeHtml(activeRoute.via)}</p><span>8 seats available · ₱${discountedUserFarePerPassenger.toFixed(2)}</span></div><div class="ride-arrival">&lt;1 min<small>Arrival</small></div><button type="button" class="ride-book" data-action="open-confirmation">Book</button></article>
        <article class="ride-card"><span class="ride-logo">MLS<small>TRI</small></span><div class="ride-detail"><h2>${escapeHtml(activeRoute.name)}</h2><p>via ${escapeHtml(activeRoute.via)}</p><span>8 seats available · ₱${discountedUserFarePerPassenger.toFixed(2)}</span></div><div class="ride-arrival">3 min<small>Arrival</small></div><button type="button" class="ride-book" data-action="open-confirmation">Book</button></article>
        <article class="ride-card is-sold-out"><span class="ride-logo">MLS<small>TRI</small></span><div class="ride-detail"><h2>${escapeHtml(activeRoute.name)}</h2><p>via ${escapeHtml(activeRoute.via)}</p><span>0 seats · ₱${discountedUserFarePerPassenger.toFixed(2)}</span></div><div class="ride-arrival">9 min<small>Arrival</small></div><button type="button" class="ride-book" disabled>Full</button></article>
      </section>
      <p class="prototype-stamp">Sample ride options · Not live availability</p>
    </div>`;

  const bookingConfirmationScreen = () => `
    <div class="ride-results with-confirmation">
      ${rideResultsScreen()}
      <div class="modal-scrim">
        <section class="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title">
          <button class="modal-close" type="button" aria-label="Close confirmation" data-screen="find-rides">×</button>
          <h2 id="booking-dialog-title">Booking Confirmation</h2><p class="sheet-subtitle">Review your trip details</p>
          <div class="confirm-route"><span class="ride-logo">MLS<small>TRI</small></span><div><strong>${escapeHtml(activeRoute.name)}</strong><small>via ${escapeHtml(activeRoute.via)} · Drop-Off Near ${escapeHtml(tripData.destination)}</small><span>8 seats available</span></div></div>
          <div class="departure-fields">
            <label for="booking-departure-date">Travel date</label>
            <input id="booking-departure-date" type="date" min="${toDateInputValue(new Date())}" value="${escapeHtml(tripData.departureDate)}" required>
            <label for="booking-departure-time">Departure time</label>
            <input id="booking-departure-time" type="time" value="${escapeHtml(tripData.departureTime)}" required>
          </div>
          <p class="booking-demo-note">Sample date and time only. Schedules are not connected.</p>
          <p class="booking-date-error" data-booking-date-error role="alert" hidden>Please choose a future date and time.</p>
          <dl class="fare-breakdown"><div><dt>Regular Fare</dt><dd>₱${(regularUserFarePerPassenger * tripData.passengers).toFixed(2)}</dd></div><div><dt>Student Discount</dt><dd>-₱${((regularUserFarePerPassenger - discountedUserFarePerPassenger) * tripData.passengers).toFixed(2)}</dd></div><div class="fare-total"><dt>Total Fare</dt><dd>₱${(discountedUserFarePerPassenger * tripData.passengers).toFixed(2)}</dd></div></dl>
          <div class="dialog-actions"><button type="button" data-screen="find-rides">Cancel</button><button type="button" class="confirm-action" data-action="confirm-booking">Confirm</button></div>
        </section>
      </div>
    </div>`;

  const bookingConfirmedScreen = () => {
    const trip = tripHistory.find(({ id }) => id === selectedHistoryTripId)
      ?? {
        id: "USAD-7X29-KM41",
        receiptId: "USAD-7X29-KM41",
        origin: tripData.origin,
        destination: tripData.destination,
        fare: discountedUserFarePerPassenger * tripData.passengers,
        seat: tripData.seat,
        passengers: tripData.passengers,
        payment: tripData.payment,
        status: "upcoming",
      };
    const isCurrentBooking = bookingConfirmed && trip.status === "upcoming";
    return `
    <div class="booking-confirmed">
      <button type="button" class="confirmed-back" data-screen="${selectedHistoryTripId ? "tickets" : "home"}" aria-label="Back">‹</button>
      <div class="confirmed-check" aria-hidden="true">${trip.status === "cancelled" ? "×" : "✓"}</div>
      <h1>${trip.status === "cancelled" ? "Booking Cancelled" : isCurrentBooking ? "Booking Confirmed" : "Trip Details"}</h1>
      <p>${trip.status === "cancelled" ? `Original fare ₱${Number(trip.originalFare || 0).toFixed(2)}` : `₱${Number(trip.fare).toFixed(2)} total · ${escapeHtml(trip.payment)}`}</p>
      <section class="ticket-panel">
        <div class="demo-qr" role="img" aria-label="Non-scannable ticket code"><i></i><i></i><i></i><b></b></div>
        <p class="ticket-code-note">QR code cannot be scanned</p>
        <span class="ticket-caption">Ticket Reference</span><strong class="ticket-number">${escapeHtml(trip.receiptId || trip.id)}</strong>
        <div class="ticket-route"><span class="ride-logo">MLS<small>TRI</small></span><div><strong>${escapeHtml(trip.destination)}</strong><small>${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</small></div></div>
        <div class="ticket-facts"><div><span>Trip status</span><strong>${trip.status === "cancelled" ? "Cancelled" : trip.status === "upcoming" ? "Booked" : "Completed"}</strong></div><div><span>Seat</span><strong>${escapeHtml(trip.seat || "—")}</strong></div><div><span>Travel date</span><strong>${trip.travelDate && trip.departureTime ? escapeHtml(formatDeparture(trip.travelDate, trip.departureTime)) : escapeHtml(trip.date || "—")}</strong></div><div><span>Passengers</span><strong>${trip.passengers || 1}</strong></div><div><span>Payment</span><strong>${escapeHtml(trip.payment)}</strong></div><div><span>${trip.status === "cancelled" ? "Original fare" : "Fare total"}</span><strong>₱${Number(trip.status === "cancelled" ? trip.originalFare : trip.fare).toFixed(2)}</strong></div></div>
        ${trip.status === "upcoming" ? '<button type="button" class="track-ride" data-screen="live-map"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>View map</button>' : '<button type="button" class="track-ride" data-screen="tickets">Back to My Tickets <span>→</span></button>'}
      </section>
      ${isCurrentBooking ? '<button type="button" class="cancel-booking" data-action="cancel-booking">Cancel booking</button>' : ""}
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
              <label class="payment-option${tripData.payment === "U-Pouch" ? " selected" : ""}"><input type="radio" name="payment" value="U-Pouch"${tripData.payment === "U-Pouch" ? " checked" : ""}><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/></svg></span><span><strong>U-Pouch</strong><small>₱2.00 <em>Insufficient amount</em></small></span><button type="button" data-top-up>＋ Top Up</button></label>
              <label class="payment-option${tripData.payment === "GCash" ? " selected" : ""}"><input type="radio" name="payment" value="GCash"${tripData.payment === "GCash" ? " checked" : ""}><span class="payment-icon gcash">G</span><span><strong>GCash</strong><small>••••5678 · Sufficient Balance</small></span></label>
            </div>
            <p class="field-error payment-error" data-payment-error role="alert" hidden>U-Pouch balance is insufficient for this trip. Choose another payment method.</p>
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
              <label class="payment-option${tripData.payment === "U-Pouch" ? " selected" : ""}"><input type="radio" name="payment" value="U-Pouch"${tripData.payment === "U-Pouch" ? " checked" : ""}><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/></svg></span><span><strong>U-Pouch</strong><small>₱2.00 <em>Insufficient amount</em></small></span><button type="button" data-top-up>＋ Top Up</button></label>
              <label class="payment-option${tripData.payment === "GCash" ? " selected" : ""}"><input type="radio" name="payment" value="GCash"${tripData.payment === "GCash" ? " checked" : ""}><span class="payment-icon gcash">G</span><span><strong>GCash</strong><small>••••5678 · Sufficient Balance</small></span></label>
              <label class="payment-option${tripData.payment === "Credit / Debit Card" ? " selected" : ""}"><input type="radio" name="payment" value="Credit / Debit Card"${tripData.payment === "Credit / Debit Card" ? " checked" : ""}><span class="payment-icon card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg></span><span><strong>Credit / Debit Card</strong><small>••4567</small></span></label>
            </div>
            <p class="field-error payment-error" data-payment-error role="alert" hidden>U-Pouch balance is insufficient for this trip. Choose another payment method.</p>
          </div>
          <div class="seat-detail-booking-footer"><button class="sheet-primary" type="submit">Find Rides <span>→</span></button></div>
        </form>
      </div>
    </div>
  `;
  };

  const secondaryTabScreen = (state) => {
    const titles = { "live-map": "Live Map", tickets: "My Tickets", profile: "Account Information", "payment-options": "Payment Options", faq: "Customer Support", notifications: "Notifications" };
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
            <button type="button" class="notification-item${notification.unread ? " is-unread" : ""}" data-notification-id="${notification.id}" aria-label="${notification.unread ? "Unread notification: " : "Read notification: "}${escapeHtml(notification.title)}">
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
      const upcomingTrips = tripHistory.filter((trip) => trip.status === "upcoming");
      const pastTrips = tripHistory.filter((trip) => trip.status !== "upcoming");
      const ticketCard = (trip) => {
        const upcoming = trip.status === "upcoming";
        const tripRating = tripRatings.get(trip.id)?.stars ?? 0;
        const statusLabel = trip.status === "cancelled" ? "Cancelled" : upcoming ? "Booked" : "Completed";
        const dateLabel = trip.travelDate && trip.departureTime
          ? formatDeparture(trip.travelDate, trip.departureTime)
          : trip.date;
        const fareDetail = trip.status === "cancelled"
          ? `Original fare ₱${Number(trip.originalFare || 0).toFixed(2)}`
          : `Paid via ${escapeHtml(trip.payment)}`;
        return `<article class="trip-history-card${upcoming ? " upcoming-ticket-card" : ""}" data-trip-history-card data-ticket-tab="${upcoming ? "upcoming" : "past"}">
          <header class="trip-history-card-header"><span class="trip-history-code">${escapeHtml(trip.id)}</span><time>${escapeHtml(dateLabel)}</time><span class="trip-history-status is-${trip.status}">${statusLabel}</span></header>
          <div class="trip-history-card-body">
            <div class="trip-history-stops">
              <div class="trip-history-stop"><i class="trip-origin-dot"></i><span><strong>${escapeHtml(trip.origin)}</strong><small>${escapeHtml(trip.originDetail)}</small></span></div>
              <div class="trip-history-stop"><i class="trip-destination-dot"></i><span><strong>${escapeHtml(trip.destination)}</strong><small>${escapeHtml(trip.destinationDetail)}</small></span></div>
            </div>
            <div class="trip-history-fare"><strong>${trip.status === "cancelled" ? "Cancelled" : `₱${Number(trip.fare).toFixed(2)}`}</strong><span>Seat ${escapeHtml(trip.seat)}</span><small>${fareDetail}</small></div>
          </div>
          ${upcoming ? `<p class="trip-history-reference">Booking reference <strong>${escapeHtml(trip.receiptId || trip.id)}</strong> · ${trip.passengers || 1} ${trip.passengers === 1 ? "passenger" : "passengers"}</p>` : ""}
          <footer class="trip-history-actions">
            <button type="button" class="trip-receipt-link" data-view-trip="${escapeHtml(trip.id)}">View details</button>
            ${upcoming ? `<button type="button" class="trip-receipt-link" data-screen="live-map">View map</button><button type="button" class="trip-cancel-button" data-action="cancel-booking" data-trip-id="${escapeHtml(trip.id)}">Cancel booking</button>` : ""}
            ${trip.status === "completed" ? `<button type="button" class="trip-rate-button" data-trip-rating-toggle="${escapeHtml(trip.id)}">${tripRatings.has(trip.id) ? "Edit rating" : "Rate Trip"}</button>` : ""}
            ${trip.status === "completed" ? `<button type="button" class="trip-rebook-button" data-action="rebook-trip" data-trip-id="${escapeHtml(trip.id)}">Rebook</button>` : ""}
          </footer>
          ${tripRatings.has(trip.id) ? `<p class="trip-rating-saved">Your rating: ${tripRatings.get(trip.id).stars}/5${tripRatings.get(trip.id).comment ? ` · “${escapeHtml(tripRatings.get(trip.id).comment)}”` : ""}</p>` : ""}
        </article>`;
      };
      const upcomingCards = upcomingTrips.map(ticketCard).join("");
      const pastCards = pastTrips.map(ticketCard).join("");
      return `<div class="trip-history-page">
        <header class="ticket-history-header">
          <div class="ticket-header-top"><button class="settings-back" type="button" data-screen="home" aria-label="Back to home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><span>TRIPS</span></div>
          <h1>My Tickets</h1>
          <p>Keep your upcoming rides and past trips together.</p>
          <div class="ticket-tabs" role="tablist" aria-label="Ticket categories">
            <button type="button" role="tab" id="upcoming-tickets-tab" aria-controls="upcoming-tickets-panel" data-ticket-tab-select="upcoming" aria-selected="${tripHistoryTab === "upcoming"}" class="${tripHistoryTab === "upcoming" ? "is-active" : ""}">Upcoming <span>${upcomingTrips.length}</span></button>
            <button type="button" role="tab" id="past-tickets-tab" aria-controls="past-tickets-panel" data-ticket-tab-select="past" aria-selected="${tripHistoryTab === "past"}" class="${tripHistoryTab === "past" ? "is-active" : ""}">Past trips <span>${pastTrips.length}</span></button>
          </div>
        </header>
        <div class="trip-history-body">
          <div id="upcoming-tickets-panel" role="tabpanel" aria-labelledby="upcoming-tickets-tab" data-ticket-panel="upcoming">
            <section class="trip-history-list upcoming-trip-list" aria-label="Upcoming tickets">${upcomingCards}</section>
            <div class="ticket-empty-state" data-ticket-empty-upcoming${upcomingTrips.length ? " hidden" : ""}>
              <span class="ticket-empty-icon" aria-hidden="true">＋</span><h2>No upcoming trips</h2><p>Your confirmed bookings will show up here with their reference, seat, fare, and travel details.</p><button type="button" data-action="quick-book">Book a trip</button>
            </div>
          </div>
          <section id="past-tickets-panel" role="tabpanel" aria-labelledby="past-tickets-tab" class="past-trip-panel" data-ticket-panel="past" aria-label="Past trips"${tripHistoryTab === "past" ? "" : " hidden"}>
            <label class="trip-history-search"><span>Search past trips</span><input type="search" data-trip-history-search placeholder="Search reference, route, or date" value="${escapeHtml(tripHistoryQuery)}"></label>
            <section class="trip-history-list" data-trip-history-list>${pastCards}</section>
            <p class="trip-history-empty" data-trip-history-empty hidden>No past trips match your search.</p>
          </section>
        </div>
        <div class="trip-rating-scrim" data-trip-rating-modal${activeTripRatingId ? "" : " hidden"}>
          <section class="trip-rating-modal" role="dialog" aria-modal="true" aria-labelledby="trip-rating-title" aria-describedby="trip-rating-description">
            <button class="trip-rating-close" type="button" data-trip-rating-close aria-label="Close rating">×</button>
            <span class="trip-rating-modal-icon" aria-hidden="true">★</span>
            <h2 id="trip-rating-title">Rate your trip</h2>
            <p id="trip-rating-description">How was your ride? Share what went well or what could be better.</p>
            <p class="trip-rating-trip-summary" data-trip-rating-summary></p>
            <div class="trip-rating-stars" role="group" aria-label="Choose a rating from 1 to 5 stars">
              ${[1, 2, 3, 4, 5].map((rating) => `<button type="button" data-trip-rating-choice="${rating}" aria-label="${rating} ${rating === 1 ? "star" : "stars"}" aria-pressed="${selectedTripRating >= rating}" class="${selectedTripRating >= rating ? "is-selected" : ""}">★</button>`).join("")}
            </div>
            <label class="trip-rating-comment-label" for="trip-rating-comment">Your comments <span>Optional</span></label>
            <textarea id="trip-rating-comment" data-trip-rating-comment maxlength="50" placeholder="Tell us what made your trip good or bad..." rows="4">${escapeHtml(selectedTripComment)}</textarea>
            <span class="trip-rating-character-count" data-trip-rating-character-count>${selectedTripComment.length}/50</span>
            <p class="trip-rating-feedback" data-trip-rating-feedback role="status" aria-live="polite"></p>
            <div class="trip-rating-modal-actions">
              <button type="button" class="trip-rating-cancel" data-trip-rating-close>Cancel</button>
              <button type="button" class="trip-rating-submit" data-submit-trip-rating${selectedTripRating ? "" : " disabled"}>${activeTripRatingId && tripRatings.has(activeTripRatingId) ? "Update rating" : "Submit rating"}</button>
            </div>
          </section>
        </div>
      </div>`;
    };
    const liveMapScreen = () => `
      <div class="tab-map" tabindex="0" aria-label="Illustrative live operations map. Drag to pan, use plus and minus to zoom, or use arrow keys.">
        <header class="live-map-header">
          <div class="live-map-header-content">
            <div class="live-map-topbar">
              <div class="live-map-location"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Sample Map</span><strong>Bus Map</strong></div>
              <button class="notification-button compact" type="button" data-screen="notifications" aria-label="Notifications, ${unreadNotificationCount()} unread"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span class="notification-count"${unreadNotificationCount() ? "" : " hidden"}>${unreadNotificationCount()}</span></button>
            </div>
            <div class="live-map-search" role="search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
              <input type="search" data-live-map-search placeholder="Search trips by bus code, route..." aria-label="Search trips by bus code or route">
            </div>
            <p class="live-map-summary" data-live-map-summary role="status" aria-live="polite">2 buses on this corridor</p>
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
          : state === "payment-options"
            ? `<div class="payment-settings-page">
              <p class="payment-page-note">Manage the payment methods available in this demo. Linking and account management are not connected to a live service.</p>
              <section class="payment-settings-group" aria-labelledby="payment-savings-heading">
                <h2 id="payment-savings-heading">MariBank Savings</h2>
                <div class="payment-method-row">
                  <span class="payment-method-icon is-bank" aria-hidden="true">M</span>
                  <span class="payment-method-copy"><strong>MariBank Savings</strong><small>Sample linked account ·•••• 4022</small></span>
                  <button class="payment-method-action is-secondary" type="button" data-info="Unlinking accounts is not connected in this prototype.">Unlink</button>
                </div>
              </section>
              <section class="payment-settings-group" aria-labelledby="payment-cards-heading">
                <h2 id="payment-cards-heading">Credit / Debit Card</h2>
                <div class="payment-method-row">
                  <span class="payment-method-icon is-card" aria-hidden="true">${paymentIcon("card")}</span>
                  <span class="payment-method-copy"><strong>Mastercard •••• 4567</strong><small>Sample card · Default</small></span>
                  <span class="payment-method-badge">Default</span>
                </div>
                <div class="payment-method-row">
                  <span class="payment-method-icon is-card" aria-hidden="true">${paymentIcon("card")}</span>
                  <span class="payment-method-copy"><strong>Visa •••• 1882</strong><small>Sample card</small></span>
                </div>
                <button class="payment-method-add" type="button" data-info="Adding a card is not connected in this prototype."><span aria-hidden="true">＋</span>Add New Card</button>
              </section>
              <section class="payment-settings-group" aria-labelledby="payment-bank-heading">
                <h2 id="payment-bank-heading">Bank Account</h2>
                <button class="payment-method-add" type="button" data-info="Adding a bank account is not connected in this prototype."><span class="payment-method-icon is-bank" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 9h18M5 9v9m4-9v9m6-9v9m4-9v9M3 20h18M12 3 2 8h20L12 3Z"/></svg></span>Add Bank Account</button>
              </section>
              <section class="payment-settings-group" aria-labelledby="payment-linked-heading">
                <h2 id="payment-linked-heading">Linked Bank Accounts</h2>
                <button class="payment-method-add" type="button" data-info="Linking bank accounts is not connected in this prototype."><span class="payment-bank-wordmark" aria-hidden="true">BPI</span>Link BPI Account</button>
              </section>
              <section class="payment-settings-group" aria-labelledby="payment-wallet-heading">
                <h2 id="payment-wallet-heading">Digital Wallets</h2>
                <div class="payment-method-row">
                  <span class="payment-method-icon is-gcash" aria-hidden="true">${paymentIcon("gcash")}</span>
                  <span class="payment-method-copy"><strong>GCash</strong><small>Sample wallet ·•••• 5678</small></span>
                  <button class="payment-method-action is-secondary" type="button" data-info="Managing linked wallets is not connected in this prototype.">Unlink</button>
                </div>
                <div class="payment-method-row">
                  <span class="payment-method-icon is-maya" aria-hidden="true">${paymentIcon("maya")}</span>
                  <span class="payment-method-copy"><strong>Maya</strong><small>Not linked</small></span>
                  <button class="payment-method-action" type="button" data-info="Linking Maya is not connected in this prototype.">＋ Link</button>
                </div>
              </section>
              <section class="payment-settings-group" aria-labelledby="payment-auto-heading">
                <h2 id="payment-auto-heading">Auto Payment Service</h2>
                <button class="payment-method-add" type="button" data-info="Auto Payment Service is not connected in this prototype."><span class="payment-method-icon is-auto" aria-hidden="true">S</span><span class="payment-method-copy"><strong>Auto Payment Service</strong><small>Manage automatic payments</small></span><span class="payment-method-chevron" aria-hidden="true">›</span></button>
              </section>
              <p class="payment-settings-message" data-message role="status" aria-live="polite"></p>
            </div>`
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
                    <form class="account-password-form" data-change-password-form novalidate>
                      <div class="account-edit-field">
                        <label for="profile-new-password">New Password</label>
                        <div class="password-input-wrap">
                          <input id="profile-new-password" name="newPassword" type="password" autocomplete="new-password" data-change-password-field aria-describedby="profile-new-password-error">
                          <button class="password-visibility-toggle" type="button" data-password-toggle="profile-new-password" data-password-label="new password" aria-controls="profile-new-password" aria-label="Show new password" aria-pressed="false">Show</button>
                        </div>
                        <span class="field-error" id="profile-new-password-error" role="alert" hidden>Enter a new password.</span>
                      </div>
                      <div class="account-edit-field">
                        <label for="profile-confirm-password">Confirm New Password</label>
                        <div class="password-input-wrap">
                          <input id="profile-confirm-password" name="confirmPassword" type="password" autocomplete="new-password" data-change-password-field aria-describedby="profile-confirm-password-error">
                          <button class="password-visibility-toggle" type="button" data-password-toggle="profile-confirm-password" data-password-label="confirm password" aria-controls="profile-confirm-password" aria-label="Show confirm password" aria-pressed="false">Show</button>
                        </div>
                        <span class="field-error" id="profile-confirm-password-error" role="alert" hidden>Passwords do not match.</span>
                      </div>
                      <button class="account-password-submit" type="submit">Update Password</button>
                    </form>
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
              <section class="profile-menu-card" aria-label="Payment settings">
                <button class="profile-menu-row" type="button" data-screen="payment-options">Payment Options <span aria-hidden="true">›</span></button>
              </section>
              <p class="account-message profile-message" data-message role="status" aria-live="polite"></p>
              <section class="profile-menu-card" aria-label="Account actions">
                <button class="profile-menu-row account-signout" type="button" data-mobile-action="logout">
                  <span>Log out</span>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 17l5-5-5-5m5 5H3m9-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>
                </button>
              </section>
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
    const isSettingsFrame = state === "profile" || state === "payment-options" || state === "faq" || state === "notifications" || state === "tickets";
    const hasBrandedHeader = isSettingsFrame || state === "tickets";
    const header = state === "live-map" || state === "tickets"
      ? ""
      : state === "profile"
        ? `<header class="settings-header profile-settings-header"><div class="device-status-spacer" aria-hidden="true"></div><div class="profile-settings-title"><h1>Account Profile</h1></div></header>`
        : hasBrandedHeader
          ? `<header class="settings-header"><div class="device-status-spacer" aria-hidden="true"></div><div class="settings-title"><button type="button" class="settings-back" data-screen="${state === "faq" || state === "payment-options" ? "profile" : "home"}" aria-label="${state === "faq" || state === "payment-options" ? "Back to Account Information" : "Back to home"}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button><h1>${titles[state]}</h1></div></header>`
          : `<header class="tab-header"><button type="button" class="round-back" data-screen="home" aria-label="Back to home">‹</button><h1>${titles[state]}</h1></header>`;
    const busPopup = state === "live-map" ? `
        <div class="modal-scrim bus-popup-scrim" data-bus-popup hidden>
          <section class="bottom-sheet quick-book-sheet bus-capacity-popup" role="dialog" aria-modal="true" aria-labelledby="bus-popup-title" tabindex="-1">
            <span class="sheet-handle"></span>
            <h2 id="bus-popup-title" data-bus-name>Bus 01</h2>
            <p class="sheet-subtitle" data-bus-route>${escapeHtml(activeRoute.origin)} → ${escapeHtml(activeRoute.destinationShort)}</p>
            <div class="bus-popup-scroll" aria-label="Bus details and seat plan">
            <details class="bus-route-overview">
              <summary class="bus-route-overview-summary"><span><strong>${escapeHtml(activeRoute.name)}</strong><small>42 mins · ${escapeHtml(activeRoute.via)} · Normal Flow</small></span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></summary>
              <div class="bus-route-overview-content">
                <div class="bus-route-overview-meta"><span>via ${escapeHtml(activeRoute.via)}</span><span>Updated 1m ago</span></div>
                <div class="bus-route-operations">
                  <div><strong>Terminal Demand</strong><span>${escapeHtml(activeRoute.destinationShort)} <b>118 pax</b></span><span>${escapeHtml(activeRoute.origin)} <b>42 pax</b></span></div>
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
              <div class="payment-option"><span class="payment-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/></svg></span><span><strong>Estimated Fare</strong><small data-bus-fare>₱${discountedUserFarePerPassenger.toFixed(2)}</small></span></div>
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
    screen.querySelectorAll("[data-ticket-tab-select]").forEach((button) => {
      const selected = button.dataset.ticketTabSelect === tripHistoryTab;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    screen.querySelectorAll("[data-ticket-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.ticketPanel !== tripHistoryTab;
    });
    screen.querySelectorAll("[data-trip-history-card]").forEach((card) => {
      const tabMatches = card.dataset.ticketTab === tripHistoryTab;
      const queryMatches = !query || card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !tabMatches || (tripHistoryTab === "past" && !queryMatches);
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
      button.setAttribute("aria-label", `${notification.unread ? "Unread notification: " : "Read notification: "}${notification.title}`);
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
    let visibleBusCount = 0;
    const query = liveMapQuery.trim().toLocaleLowerCase();

    screen.querySelectorAll("[data-sim-bus]").forEach((marker) => {
      const bus = liveBusDetails[Number(marker.dataset.simBus)];
      const matchesQuery = !query || [bus.name, bus.fleetId, bus.route].some((value) => value.toLocaleLowerCase().includes(query));
      marker.hidden = !matchesQuery;
      if (!marker.hidden) visibleBusCount += 1;
    });
    const summary = screen.querySelector("[data-live-map-summary]");
    if (!summary) return;
    summary.textContent = query
      ? visibleBusCount
        ? `${visibleBusCount} matching ${visibleBusCount === 1 ? "bus" : "buses"} on this corridor`
        : "No matching buses. Try another bus code or route."
      : "2 buses on this corridor";
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
    } else if (state === "live-map" || state === "tickets" || state === "profile" || state === "payment-options" || state === "faq" || state === "notifications") {
      screen.innerHTML = secondaryTabScreen(state);
      if (state === "live-map") {
        liveMapPan = { x: 0, y: 0 };
        liveMapZoom = 1;
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
        updateTripHistoryView();
      }
    } else if (state === "backend-error") {
      screen.innerHTML = backendErrorScreen();
    } else {
      throw new Error(`Unknown USAD prototype screen: ${state}`);
    }
    if (["home", "quick-book", "find-rides", "booking-confirmation", "booking-confirmed", "verify-account", "live-map", "live-seat-overview", "live-seat-detail", "tickets", "profile", "payment-options", "faq", "notifications"].includes(state)) {
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

  const openTopUpModal = () => {
    if (screen.querySelector("[data-top-up-modal]")) return;
    topUpReturnFocus = document.activeElement;
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="modal-scrim top-up-modal-scrim" data-top-up-modal>
        <section class="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="top-up-dialog-title">
          <button class="modal-close" type="button" aria-label="Close top-up message" data-top-up-close>×</button>
          <div class="top-up-message">
            <span class="top-up-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6m-.5-5.5L11 13m-2-7H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <h2 id="top-up-dialog-title">Redirecting you to merchant</h2>
          </div>
        </section>
      </div>`;
    const modal = template.content.firstElementChild;
    if (!modal) throw new Error("USAD could not open the top-up message.");
    screen.append(modal);
    modal.querySelector("[data-top-up-close]")?.focus();
  };

  const closeTopUpModal = () => {
    const modal = screen.querySelector("[data-top-up-modal]");
    if (!modal) return;
    modal.remove();
    if (topUpReturnFocus?.isConnected) topUpReturnFocus.focus();
    topUpReturnFocus = null;
  };

  const openPasswordUpdatedModal = () => {
    if (screen.querySelector("[data-password-updated-modal]")) return;
    passwordUpdatedReturnFocus = document.activeElement;
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="modal-scrim top-up-modal-scrim" data-password-updated-modal>
        <section class="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="password-updated-dialog-title">
          <button class="modal-close" type="button" aria-label="Close password updated message" data-password-updated-close>×</button>
          <div class="top-up-message">
            <span class="top-up-icon password-updated-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <h2 id="password-updated-dialog-title">Password updated</h2>
          </div>
        </section>
      </div>`;
    const modal = template.content.firstElementChild;
    if (!modal) throw new Error("USAD could not open the password updated message.");
    screen.append(modal);
    modal.querySelector("[data-password-updated-close]")?.focus();
  };

  const closePasswordUpdatedModal = () => {
    const modal = screen.querySelector("[data-password-updated-modal]");
    if (!modal) return;
    modal.remove();
    if (passwordUpdatedReturnFocus?.isConnected) passwordUpdatedReturnFocus.focus();
    passwordUpdatedReturnFocus = null;
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

  const updateFullscreenButton = () => {
    const isFullscreen = document.fullscreenElement === workspacePage;
    const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
    fullscreenButton.setAttribute("aria-label", label);
    fullscreenButton.title = label;
    fullscreenStatus.textContent = "";
  };

  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === workspacePage) {
        await document.exitFullscreen();
      } else if (workspacePage.requestFullscreen) {
        await workspacePage.requestFullscreen();
      } else {
        fullscreenStatus.textContent = "Fullscreen is unavailable in this browser.";
      }
    } catch (error) {
      const details = error instanceof Error ? ` ${error.message}` : "";
      fullscreenStatus.textContent = `Fullscreen could not be enabled.${details}`;
    }
  });

  document.addEventListener("fullscreenchange", updateFullscreenButton);

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
      if (screen.querySelector("[data-password-updated-modal]")) {
        closePasswordUpdatedModal();
        return;
      }
      if (screen.querySelector("[data-top-up-modal]")) {
        closeTopUpModal();
        return;
      }
      const ratingModal = screen.querySelector("[data-trip-rating-modal]:not([hidden])");
      if (ratingModal) {
        event.preventDefault();
        screen.querySelector(`[data-trip-rating-toggle="${CSS.escape(activeTripRatingId)}"]`)?.focus();
        ratingModal.hidden = true;
        activeTripRatingId = "";
        selectedTripRating = 0;
        selectedTripComment = "";
        return;
      }
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
    const forecastPeriod = event.target.closest("[data-chart-period]");
    if (forecastPeriod && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      forecastPeriod.click();
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
      const busId = screen.querySelector("#assign-bus")?.value;
      const driverId = screen.querySelector("#assign-driver")?.value;
      const assignedDriver = adminStaffMembersData.find((member) => member.id === driverId && member.roleKey === "driver" && !isStaffOffDuty(member));
      if (!assignedDriver) throw new Error("USAD could not assign a bus: select a driver who is not off duty.");
      const routeId = screen.querySelector("#assign-route")?.value;
      if (!busId) throw new Error("USAD could not assign a bus: select an available vehicle.");
      const assignedRoute = routes.find((route) => route.id === routeId);
      if (!assignedRoute) throw new Error(`USAD could not assign a bus: route "${routeId}" is not available.`);
      const targetBus = adminFleetData.find((bus) => bus.id === busId);
      if (!targetBus) throw new Error(`USAD could not assign a bus: vehicle "${busId}" was not found.`);
      if (!isBusAvailableForAssignment(targetBus)) throw new Error(`USAD could not assign ${targetBus.busNo}: it is on duty or off duty.`);
      targetBus.driver = assignedDriver.name;
      targetBus.routeId = assignedRoute.id;
      targetBus.route = assignedRoute.label;
      targetBus.status = "On Duty";
      targetBus.statusClass = "on-duty";
      targetBus.dot = "green";
      targetBus.filterCategory = "on-duty";
      const telemetryUnit = fleetDispatchTelemetryUnits.find((unit) => unit.id === targetBus.id);
      if (telemetryUnit) {
        telemetryUnit.driverName = assignedDriver.name;
        telemetryUnit.routeId = assignedRoute.id;
        telemetryUnit.routeCorridor = assignedRoute.label;
        telemetryUnit.nextStop = assignedRoute.destination;
        telemetryUnit.scheduledStop = assignedRoute.destination;
        telemetryUnit.gpsLocation = assignedRoute.via;
        telemetryUnit.category = "deployed";
        telemetryUnit.statusText = "On Time";
        telemetryUnit.statusType = "on-time";
        telemetryUnit.headwayAlert = "Vehicle dispatched and staged for service";
      }
      activeCorridorFilter = assignedRoute.id;
      activeFleetFilter = "all";
      screen.querySelector(".admin-modal-backdrop")?.remove();
      renderScreen("admin-dashboard");
      return;
    }

    if (event.target.matches("[data-fleet-driver-form]")) {
      event.preventDefault();
      const busId = event.target.dataset.fleetDriverForm;
      const bus = adminFleetData.find((item) => item.id === busId);
      const driverSelect = event.target.querySelector('[name="driverId"]');
      const driver = adminStaffMembersData.find((member) => member.id === driverSelect?.value && member.roleKey === "driver" && !isStaffOffDuty(member));
      if (!bus) throw new Error(`Driver assignment could not be saved: vehicle "${busId}" was not found.`);
      if (!driverSelect || !driver) throw new Error("Driver assignment could not be saved: select a driver who is not off duty.");
      bus.driver = driver.name;
      const telemetryUnit = fleetDispatchTelemetryUnits.find((item) => item.id === busId);
      if (telemetryUnit) telemetryUnit.driverName = driver.name;
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const tbody = screen.querySelector("#admin-fleet-tbody");
      if (tbody) tbody.innerHTML = renderAdminFleetRows();
      const dispatchTbody = screen.querySelector("#fleet-telemetry-tbody");
      if (dispatchTbody) dispatchTbody.innerHTML = renderFleetTelemetryRows();
      const dispatchPanel = screen.querySelector("#dispatch-panel-container");
      if (dispatchPanelOpen && dispatchPanel) dispatchPanel.innerHTML = renderDispatchControlPanel();
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
        const restoredConfirmPasswordError = screen.querySelector("#register-confirm-password-error");
        const restoredTermsAccepted = screen.querySelector("#terms-accepted");
        if (restoredUsername) restoredUsername.value = username.value;
        if (restoredEmail) restoredEmail.value = email.value;
        if (restoredPassword) restoredPassword.value = password.value;
        if (restoredConfirmPassword) restoredConfirmPassword.value = confirmPassword.value;
        if (restoredConfirmPassword && restoredConfirmPasswordError && (!confirmPassword.value || mismatch)) {
          restoredConfirmPassword.setAttribute("aria-invalid", "true");
          restoredConfirmPasswordError.hidden = false;
        }
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

    if (event.target.matches("[data-change-password-form]")) {
      event.preventDefault();
      const newPassword = event.target.querySelector("#profile-new-password");
      const confirmPassword = event.target.querySelector("#profile-confirm-password");
      const newPasswordError = event.target.querySelector("#profile-new-password-error");
      const confirmPasswordError = event.target.querySelector("#profile-confirm-password-error");
      if (!newPassword || !confirmPassword || !newPasswordError || !confirmPasswordError) {
        throw new Error("USAD could not update the password: a required field or error message is missing.");
      }

      const missingPassword = !newPassword.value;
      const missingConfirmation = !confirmPassword.value;
      const passwordsMismatch = !missingPassword && !missingConfirmation && newPassword.value !== confirmPassword.value;
      newPasswordError.hidden = !missingPassword;
      confirmPasswordError.hidden = !(missingConfirmation || passwordsMismatch);
      newPassword.toggleAttribute("aria-invalid", missingPassword);
      confirmPassword.toggleAttribute("aria-invalid", missingConfirmation || passwordsMismatch);

      if (missingPassword || missingConfirmation || passwordsMismatch) {
        (missingPassword ? newPassword : confirmPassword).focus();
        return;
      }

      accountProfile.password = newPassword.value;
      event.target.reset();
      openPasswordUpdatedModal();
      return;
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
      const seat = formData.get("seat");
      const passengerText = screen.querySelector("#passenger-count")?.textContent ?? "1";
      const passengers = Number.parseInt(passengerText, 10);
      const paymentError = event.target.querySelector("[data-payment-error]");
      if (insufficientUPouchPayment(payment, passengers)) {
        if (paymentError) paymentError.hidden = false;
        event.target.querySelector('input[name="payment"][value="U-Pouch"]')?.setAttribute("aria-invalid", "true");
        return;
      }
      if (paymentError) paymentError.hidden = true;
      if (typeof origin !== "string" || !origin.trim() || typeof destination !== "string" || !destination.trim() || !Number.isInteger(passengers) || passengers < 1 || typeof payment !== "string") {
        throw new Error("USAD quick booking could not continue: route, passenger, or payment selection is invalid.");
      }
      tripData = {
        ...tripData,
        origin: origin.trim(),
        destination: destination.trim(),
        passengers,
        payment,
        ...(typeof seat === "string" && seat ? { seat } : {}),
      };
      bookingConfirmed = false;
      renderScreen("find-rides");
    }

    if (event.target.matches("[data-admin-edit-staff-form]")) {
      event.preventDefault();
      const form = event.target;
      const staffId = form.dataset.adminEditStaffForm;
      const staff = adminStaffMembersData.find((member) => member.id === staffId);
      const formData = new FormData(form);
      const name = String(formData.get("name") ?? "").trim();
      const role = String(formData.get("role") ?? "");
      const depot = String(formData.get("depot") ?? "");
      const selectedBusNo = String(formData.get("busNo") ?? "").trim();
      const status = String(formData.get("status") ?? "");
      if (!staff) throw new Error(`Staff information could not be saved: staff member "${staffId}" was not found.`);
      const availableBuses = getAvailableStaffBuses(staff);
      if (!name || !["-", ...availableBuses.map((bus) => normalizeStaffBusNo(bus.busNo))].includes(selectedBusNo) ||
        !["Driver", "Dispatcher", "Maintenance"].includes(role) ||
        !["Trinoma Hub", "Malolos Hub", "Balintawak Staging"].includes(depot) ||
        !["On Duty", "On Break", "Off"].includes(status) ||
        (role === "Driver" && status === "Off" && selectedBusNo !== "-")) {
        throw new Error("Staff information could not be saved: one or more fields are invalid.");
      }

      const roleCode = role === "Driver" ? "DRV" : role === "Dispatcher" ? "DSP" : "MNT";
      const previousBusNo = normalizeStaffBusNo(staff.busNo);
      const busNo = selectedBusNo === "-" ? "-" : selectedBusNo;
      staff.name = name;
      staff.role = role;
      staff.roleKey = role.toLowerCase();
      staff.staffId = staff.staffId.replace(/•\s*(DRV|DSP|MNT)$/, `• ${roleCode}`);
      staff.busNo = busNo;
      staff.depot = depot;
      staff.status = status;
      staff.statusKey = status.toLowerCase().replace(" ", "-");
      staff.statusClass = status === "On Duty" ? "on-duty" : status === "On Break" ? "on-break" : "off";
      staff.initials = name.split(/\s+/).map((word) => word[0]).join("").toUpperCase().slice(0, 2);
      staffCurrentPage = 1;

      adminFleetData.forEach((bus) => {
        const busCode = normalizeStaffBusNo(bus.busNo);
        if (busCode === previousBusNo && busCode !== selectedBusNo) bus.driver = "Unassigned";
        if (busCode === selectedBusNo) bus.driver = name;
      });
      fleetDispatchTelemetryUnits.forEach((unit) => {
        const busCode = normalizeStaffBusNo(unit.busNo);
        if (busCode === previousBusNo && busCode !== selectedBusNo) unit.driverName = "Unassigned";
        if (busCode === selectedBusNo) unit.driverName = name;
      });
      screen.querySelector(".admin-modal-backdrop")?.remove();
      updateStaffDirectory();
      const fleetTbody = screen.querySelector("#admin-fleet-tbody");
      if (fleetTbody) fleetTbody.innerHTML = renderAdminFleetRows();
      const dispatchTbody = screen.querySelector("#fleet-telemetry-tbody");
      if (dispatchTbody) dispatchTbody.innerHTML = renderFleetTelemetryRows();
      const dispatchPanel = screen.querySelector("#dispatch-panel-container");
      if (dispatchPanelOpen && dispatchPanel) dispatchPanel.innerHTML = renderDispatchControlPanel();
      return;
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
      staffCurrentPage = 1;
      updateStaffDirectory();
      return;
    }

    if (event.target.matches("[data-cctv-add-feed-form]")) {
      event.preventDefault();
      const title = screen.querySelector("#new-cam-title")?.value?.trim() || "New Camera Unit";
      const location = screen.querySelector("#new-cam-location")?.value || "trinoma";
      const nextNum = adminCameraFeedsData.length + 1;
      adminCameraFeedsData.unshift({
        id: `cam-${Date.now()}`,
        code: `CAM ${nextNum}.1/ws`,
        title,
        location,
        locationLabel: location === "trinoma" ? "Trinoma" : location === "fleet" ? "On Buses" : location === "nlex" ? "Along NLEX" : "Malolos Depot",
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
      const routeId = screen.querySelector("#rep-gen-corridor")?.value || activeRoute.id;
      const reportRoute = routes.find((route) => route.id === routeId);
      if (!reportRoute) throw new Error(`USAD could not generate the report: route "${routeId}" is not active.`);
      const period = screen.querySelector("#rep-gen-period")?.value || "Month to Date";
      const format = screen.querySelector("#rep-gen-format")?.value || "PDF";
      const nextNum = 1048 + adminReportsData.length - 5;
      const newRep = {
        id: `REP-2026-${nextNum}`,
        title,
        routeId: reportRoute.id,
        corridorLabel: reportRoute.label,
        category,
        categoryLabel: category === "financial" ? "Revenue & Finance" : category === "otp" ? "Bus Schedules" : category === "crew" ? "Staff" : "Fuel & Maintenance",
        dateRange: `${period} (Verified)`,
        period: `${period} (Verified)`,
        summaryMetric: category === "financial" ? "₱385,420 Fare Rev" : category === "otp" ? "93.4% On-Time" : category === "crew" ? "100% Shift Fill" : "3.48 km/L Fleet Avg",
        primaryMetric: category === "financial" ? "₱385,420 Fare Rev" : category === "otp" ? "93.4% On-Time" : category === "crew" ? "100% Shift Fill" : "3.48 km/L Fleet Avg",
        secondaryMetric: "Automated Data Ingestion",
        status: "Finalized",
        statusClass: "completed",
        fileFormat: format,
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
    if (event.target.matches("[data-trip-rating-comment]")) {
      selectedTripComment = event.target.value.slice(0, 50);
      const characterCount = screen.querySelector("[data-trip-rating-character-count]");
      if (characterCount) characterCount.textContent = `${selectedTripComment.length}/50`;
      return;
    }
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
      staffCurrentPage = 1;
      updateStaffDirectory();
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
      updatePredictiveView();
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

    if (event.target.matches("[data-change-password-field]")) {
      event.target.removeAttribute("aria-invalid");
      const fieldError = screen.querySelector(`#${event.target.id}-error`);
      if (fieldError) fieldError.hidden = true;
    }
  });

  const showReportsRevenueTooltip = (point) => {
    const chart = point.closest(".reports-line-chart");
    const marker = point.querySelector(".reports-line-marker");
    const tooltip = chart?.querySelector("#reports-revenue-tooltip");
    const tooltipText = point.dataset.tooltip;
    if (!chart || !marker || !tooltip || !tooltipText) return;

    tooltip.textContent = tooltipText;
    tooltip.setAttribute("aria-hidden", "false");
    tooltip.classList.add("is-visible");

    const chartRect = chart.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const scaleX = chartRect.width / chart.offsetWidth;
    const scaleY = chartRect.height / chart.offsetHeight;
    const tooltipHalfWidth = tooltip.offsetWidth / 2;
    const centerX = (markerRect.left + markerRect.width / 2 - chartRect.left) / scaleX;
    const left = Math.max(tooltipHalfWidth + 8, Math.min(chart.offsetWidth - tooltipHalfWidth - 8, centerX));
    let top = (markerRect.top - chartRect.top) / scaleY - tooltip.offsetHeight - 8;
    if (top < 0) top = (markerRect.bottom - chartRect.top) / scaleY + 8;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const hideReportsRevenueTooltip = () => {
    const tooltip = screen.querySelector("#reports-revenue-tooltip");
    if (!tooltip) return;
    tooltip.classList.remove("is-visible");
    tooltip.setAttribute("aria-hidden", "true");
  };

  screen.addEventListener("pointerover", (event) => {
    const point = event.target.closest(".reports-line-point");
    if (point) showReportsRevenueTooltip(point);
  });

  screen.addEventListener("pointerout", (event) => {
    const point = event.target.closest(".reports-line-point");
    if (!point || (event.relatedTarget instanceof Node && point.contains(event.relatedTarget))) return;
    if (point !== screen.activeElement) hideReportsRevenueTooltip();
  });

  screen.addEventListener("focusin", (event) => {
    const point = event.target.closest(".reports-line-point");
    if (point) showReportsRevenueTooltip(point);
  });

  screen.addEventListener("focusout", (event) => {
    const point = event.target.closest(".reports-line-point");
    if (point && !point.matches(":hover")) hideReportsRevenueTooltip();
  });

  screen.addEventListener("change", (event) => {
    if (event.target.matches("[data-revenue-period]")) {
      activeRevenueChartPeriod = event.target.value;
      const charts = screen.querySelector("#reports-decision-charts");
      if (charts) charts.innerHTML = renderReportsDecisionCharts();
      return;
    }

    if (event.target.matches("#live-seat-picker")) {
      selectedBusSeatId = event.target.value;
    }

    if (event.target.matches('input[name="payment"]')) {
      const paymentOptions = event.target.closest(".payment-options");
      paymentOptions?.querySelectorAll(".payment-option").forEach((option) => {
        option.classList.toggle("selected", option.querySelector('input[name="payment"]')?.checked === true);
      });
      tripData.payment = event.target.value;
      if (event.target.value !== "U-Pouch") {
        const bookingContainer = event.target.closest("[data-quick-book], .seat-book-card");
        const paymentError = bookingContainer?.querySelector("[data-payment-error]");
        if (paymentError) paymentError.hidden = true;
        bookingContainer?.querySelector('input[name="payment"][value="U-Pouch"]')?.removeAttribute("aria-invalid");
      }
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
      const tbody = screen.querySelector("#admin-fleet-tbody");
      if (tbody) tbody.innerHTML = renderAdminFleetRows();
    }

    if (event.target.matches("[data-cctv-filter]")) {
      activeCameraLocationFilter = event.target.value;
      const grid = screen.querySelector("#cctv-grid-container");
      if (grid) grid.innerHTML = renderCameraFeedsGrid();
    }

    if (event.target.matches("[data-analytics-profile]")) {
      predictiveOperatingProfile = event.target.value;
      updatePredictiveView();
      return;
    }

    if (event.target.matches("[data-analytics-route]")) {
      activeAnalyticsRouteId = event.target.value;
      updatePredictiveView();
      return;
    }

    if (event.target.matches("[data-analytics-range]")) {
      activePredictivePeriod = event.target.value;
      updatePredictiveView();
      return;
    }

    if (event.target.matches("[data-dispatch-note]")) {
      dispatchNoteInput = event.target.value;
    }

    if (event.target.matches("[data-trip-log-date]")) {
      activeTripLogDate = event.target.value;
      showAllTripLogs = false;
      const showAllButton = screen.querySelector("[data-trip-log-show-all]");
      if (showAllButton) {
        showAllButton.textContent = "Show all";
        showAllButton.classList.remove("is-active");
        showAllButton.setAttribute("aria-pressed", "false");
      }
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
    const passwordToggle = event.target.closest("[data-password-toggle]");
    if (passwordToggle) {
      const passwordInput = screen.querySelector(`#${passwordToggle.dataset.passwordToggle}`);
      if (!passwordInput) {
        throw new Error(`Password visibility control could not find its input: ${passwordToggle.dataset.passwordToggle}.`);
      }
      const showPassword = passwordInput.type === "password";
      passwordInput.type = showPassword ? "text" : "password";
      passwordToggle.textContent = showPassword ? "Hide" : "Show";
      const passwordLabel = passwordToggle.dataset.passwordLabel
        ?? (passwordInput.id === "register-confirm-password" ? "confirm password" : "password");
      passwordToggle.setAttribute("aria-label", `${showPassword ? "Hide" : "Show"} ${passwordLabel}`);
      passwordToggle.setAttribute("aria-pressed", String(showPassword));
      return;
    }

    const topUpButton = event.target.closest("[data-top-up]");
    if (topUpButton) {
      event.preventDefault();
      openTopUpModal();
      return;
    }

    if (event.target.closest("[data-top-up-close]")) {
      closeTopUpModal();
      return;
    }

    if (event.target.closest("[data-password-updated-close]")) {
      closePasswordUpdatedModal();
      return;
    }

    const passwordUpdatedModal = event.target.closest("[data-password-updated-modal]");
    if (passwordUpdatedModal && event.target === passwordUpdatedModal) {
      closePasswordUpdatedModal();
      return;
    }

    const topUpModal = event.target.closest("[data-top-up-modal]");
    if (topUpModal && event.target === topUpModal) {
      closeTopUpModal();
      return;
    }

    const showAllTripsButton = event.target.closest("[data-trip-log-show-all]");
    if (showAllTripsButton) {
      showAllTripLogs = !showAllTripLogs;
      showAllTripsButton.textContent = showAllTripLogs ? "Show selected date" : "Show all";
      showAllTripsButton.classList.toggle("is-active", showAllTripLogs);
      showAllTripsButton.setAttribute("aria-pressed", String(showAllTripLogs));
      const tbody = screen.querySelector("#reports-table-tbody");
      if (tbody) tbody.innerHTML = renderReportsTableRows();
      return;
    }

    const repActionBtn = event.target.closest("[data-report-action]");
    if (repActionBtn) {
      const { reportAction } = repActionBtn.dataset;
      const repId = repActionBtn.dataset.reportId;
      if (reportAction === "generate") {
        openAdminModal("generate-report");
      } else if (reportAction === "view") {
        openAdminModal(`view-report-${repId}`);
      } else if (reportAction === "download") {
        openAdminModal(`download-report-${repId}`);
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
      } else if (mobileAction === "logout") {
        mobileLoginShowError = false;
        renderScreen("login");
      }
      return;
    }

    const chartCol = event.target.closest("[data-chart-period]");
    if (chartCol) {
      predictiveSelectedBucket = chartCol.dataset.chartPeriod;
      updatePredictiveView();
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

    const fleetActionsBtn = event.target.closest("[data-fleet-actions]");
    if (fleetActionsBtn) {
      openAdminModal(`fleet-actions-${fleetActionsBtn.dataset.fleetActions}`);
      return;
    }

    const fleetActionBtn = event.target.closest("[data-fleet-action]");
    if (fleetActionBtn) {
      if (fleetActionBtn.disabled) return;
      const { fleetAction, fleetId } = fleetActionBtn.dataset;
      screen.querySelector(".admin-modal-backdrop")?.remove();
      if (fleetAction === "telemetry") {
        openAdminModal(`telemetry-${fleetId}`);
      } else if (fleetAction === "assign-driver") {
        openAdminModal(`fleet-assign-driver-${fleetId}`);
      } else if (fleetAction === "dispatch") {
        openAdminModal(`fleet-dispatch-confirm-${fleetId}`);
      }
      return;
    }

    const confirmFleetDispatch = event.target.closest("[data-fleet-dispatch-confirm]");
    if (confirmFleetDispatch) {
      const bus = adminFleetData.find((item) => item.id === confirmFleetDispatch.dataset.fleetDispatchConfirm);
      if (!bus) {
        throw new Error(`Vehicle dispatch failed: vehicle "${confirmFleetDispatch.dataset.fleetDispatchConfirm}" was not found.`);
      }
      if (isBusOffDuty(bus)) {
        screen.querySelector(".admin-modal-backdrop")?.remove();
        openAdminModal(`fleet-dispatch-confirm-${bus.id}`);
        return;
      }
      bus.status = "On Duty";
      bus.statusClass = "on-duty";
      bus.dot = "green";
      bus.filterCategory = "on-duty";
      bus.speed = "0 km/h (Staged)";
      const telemetryUnit = fleetDispatchTelemetryUnits.find((item) => item.id === bus.id);
      if (telemetryUnit) {
        telemetryUnit.category = "deployed";
        telemetryUnit.statusText = "On Time";
        telemetryUnit.statusType = "on-time";
        telemetryUnit.headwayAlert = "Vehicle dispatched and staged for service";
      }
      screen.querySelector(".admin-modal-backdrop")?.remove();
      const tbody = screen.querySelector("#admin-fleet-tbody");
      if (tbody) tbody.innerHTML = renderAdminFleetRows();
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

    const manageTripBtn = event.target.closest("[data-manage-trip]");
    if (manageTripBtn) {
      selectedDispatchBusId = manageTripBtn.dataset.manageTrip;
      dispatchPanelOpen = true;
      dispatchAssignmentPanelOpen = true;
      selectedDispatchSeatBooking = null;
      screen.querySelectorAll("[data-select-bus]").forEach((row) => {
        row.classList.toggle("is-selected", row.dataset.selectBus === selectedDispatchBusId);
      });
      const grid = screen.querySelector(".fleet-dispatch-grid");
      if (grid) {
        grid.classList.remove("is-panel-closed");
        grid.classList.add("is-assignment-expanded");
      }
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = renderDispatchControlPanel();
      return;
    }

    const telemetryDeleteBtn = event.target.closest("[data-telemetry-delete]");
    if (telemetryDeleteBtn) {
      openAdminModal(`telemetry-delete-${telemetryDeleteBtn.dataset.telemetryDelete}`);
      return;
    }

    const telemetryDeleteConfirm = event.target.closest("[data-telemetry-delete-confirm]");
    if (telemetryDeleteConfirm) {
      const busId = telemetryDeleteConfirm.dataset.telemetryDeleteConfirm;
      const telemetryIndex = fleetDispatchTelemetryUnits.findIndex((unit) => unit.id === busId);
      if (telemetryIndex === -1) throw new Error(`Telemetry deletion failed: bus "${busId}" was not found.`);
      fleetDispatchTelemetryUnits.splice(telemetryIndex, 1);
      screen.querySelector(".admin-modal-backdrop")?.remove();

      if (selectedDispatchBusId === busId) {
        selectedDispatchBusId = fleetDispatchTelemetryUnits[0]?.id ?? "";
        selectedDispatchSeatBooking = null;
        dispatchPanelOpen = false;
        const panel = screen.querySelector("#dispatch-panel-container");
        if (panel) panel.innerHTML = "";
        const grid = screen.querySelector(".fleet-dispatch-grid");
        grid?.classList.add("is-panel-closed");
        grid?.classList.remove("is-assignment-expanded");
      }

      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      const counts = {
        all: fleetDispatchTelemetryUnits.length,
        deployed: fleetDispatchTelemetryUnits.filter((unit) => unit.category === "deployed").length,
        delayed: fleetDispatchTelemetryUnits.filter((unit) => unit.category === "delayed").length,
        terminal: fleetDispatchTelemetryUnits.filter((unit) => unit.category === "terminal").length
      };
      const labels = { all: "Tracked Sample", deployed: "Deployed", delayed: "Delayed", terminal: "At Terminal" };
      screen.querySelectorAll("[data-telemetry-tab]").forEach((button) => {
        const tab = button.dataset.telemetryTab;
        button.textContent = `${labels[tab]} (${counts[tab]})`;
      });
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    const dispatchBookingSeat = event.target.closest("[data-dispatch-booking-seat]");
    if (dispatchBookingSeat) {
      const bus = fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId);
      if (!bus) throw new Error(`USAD could not find the selected bus "${selectedDispatchBusId}" for seat booking details.`);
      assertSeatMapEditable(bus);
      const seatId = dispatchBookingSeat.dataset.dispatchBookingSeat;
      const booking = getBookingForSeat(bus, seatId);
      if (!booking) {
        throw new Error(`USAD could not show booking details for non-occupied seat ${seatId} on Bus ${bus.busNo}.`);
      }

      selectedDispatchSeatBooking = { busId: bus.id, seatId, ...booking };
      screen.querySelectorAll("[data-dispatch-booking-seat]").forEach((seat) => {
        const isSelected = seat === dispatchBookingSeat;
        seat.classList.toggle("is-selected", isSelected);
        seat.setAttribute("aria-pressed", String(isSelected));
      });
      screen.querySelectorAll("[data-dispatch-available-seat]").forEach((seat) => {
        seat.classList.remove("is-selected");
        seat.setAttribute("aria-pressed", "false");
      });
      const bookingDetails = screen.querySelector("[data-dispatch-seat-booking-details]");
      if (bookingDetails) {
        bookingDetails.classList.add("has-selection");
        bookingDetails.innerHTML = renderDispatchSeatBookingDetails(bus);
      }
      return;
    }

    const startSeatRelease = event.target.closest("[data-start-seat-release]");
    if (startSeatRelease) {
      const bus = fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId);
      if (!bus) throw new Error(`USAD could not find the selected bus "${selectedDispatchBusId}" to release a seat.`);
      assertSeatMapEditable(bus);
      if (selectedDispatchSeatBooking?.seatId !== startSeatRelease.dataset.startSeatRelease) {
        throw new Error(`USAD could not confirm the selected booking for seat ${startSeatRelease.dataset.startSeatRelease}.`);
      }
      selectedDispatchSeatBooking.confirmingRelease = true;
      const bookingDetails = screen.querySelector("[data-dispatch-seat-booking-details]");
      if (bookingDetails) bookingDetails.innerHTML = renderDispatchSeatBookingDetails(fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId));
      return;
    }

    const cancelSeatRelease = event.target.closest("[data-cancel-seat-release]");
    if (cancelSeatRelease) {
      const bus = fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId);
      if (!bus) throw new Error(`USAD could not find the selected bus "${selectedDispatchBusId}" to cancel a seat release.`);
      assertSeatMapEditable(bus);
      if (!selectedDispatchSeatBooking?.confirmingRelease) return;
      selectedDispatchSeatBooking.confirmingRelease = false;
      const bookingDetails = screen.querySelector("[data-dispatch-seat-booking-details]");
      if (bookingDetails && bus) bookingDetails.innerHTML = renderDispatchSeatBookingDetails(bus);
      return;
    }

    const confirmSeatRelease = event.target.closest("[data-confirm-seat-release]");
    if (confirmSeatRelease) {
      const bus = fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId);
      const seatId = confirmSeatRelease.dataset.confirmSeatRelease;
      if (!bus) throw new Error(`USAD could not find the selected bus "${selectedDispatchBusId}" to release seat ${seatId}.`);
      assertSeatMapEditable(bus);
      if (selectedDispatchSeatBooking?.busId !== bus.id || selectedDispatchSeatBooking.seatId !== seatId || !selectedDispatchSeatBooking.confirmingRelease) {
        throw new Error(`USAD could not verify the customer departure confirmation for seat ${seatId}.`);
      }

      const bookingIndex = bus.walkInBookings.findIndex((booking) => booking.seatId === seatId);
      if (bookingIndex >= 0) {
        bus.walkInBookings.splice(bookingIndex, 1);
      } else {
        const passengerSeatIndex = getPassengerSeatIndex(seatId);
        if (passengerSeatIndex < 0 || passengerSeatIndex >= bus.sampleOccupiedSeats || bus.releasedSampleSeatIds.includes(seatId)) {
          throw new Error(`USAD could not release seat ${seatId} because its booking is no longer active.`);
        }
        bus.releasedSampleSeatIds.push(seatId);
      }

      updateFleetOccupancyDisplay(bus);
      selectedDispatchSeatBooking = { busId: bus.id, seatId, type: "released" };
      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = renderDispatchControlPanel();
      return;
    }

    if (event.target.closest("[data-close-dispatch-panel]")) {
      dispatchPanelOpen = false;
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = "";
      const grid = screen.querySelector(".fleet-dispatch-grid");
      if (grid) grid.classList.add("is-panel-closed");
      grid?.classList.remove("is-assignment-expanded");
      return;
    }

    const availableDispatchSeat = event.target.closest("[data-dispatch-available-seat]");
    if (availableDispatchSeat) {
      const bus = fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId);
      if (!bus) throw new Error(`USAD could not find the selected bus "${selectedDispatchBusId}" for walk-in booking.`);
      assertSeatMapEditable(bus);
      const seatId = availableDispatchSeat.dataset.dispatchAvailableSeat;
      if (getBookingForSeat(bus, seatId)) {
        throw new Error(`USAD cannot book seat ${seatId} on Bus ${bus.busNo} because it is already occupied.`);
      }
      selectedDispatchSeatBooking = { busId: bus.id, seatId, type: "available" };
      screen.querySelectorAll("[data-dispatch-available-seat]").forEach((seat) => {
        const isSelected = seat === availableDispatchSeat;
        seat.classList.toggle("is-selected", isSelected);
        seat.setAttribute("aria-pressed", String(isSelected));
      });
      screen.querySelectorAll("[data-dispatch-booking-seat]").forEach((seat) => {
        seat.classList.remove("is-selected");
        seat.setAttribute("aria-pressed", "false");
      });
      const bookingDetails = screen.querySelector("[data-dispatch-seat-booking-details]");
      if (bookingDetails) {
        bookingDetails.classList.add("has-selection");
        bookingDetails.innerHTML = renderDispatchSeatBookingDetails(bus);
      }
      return;
    }

    const bookWalkInButton = event.target.closest("[data-book-walk-in-seat]");
    if (bookWalkInButton) {
      const bus = fleetDispatchTelemetryUnits.find((unit) => unit.id === selectedDispatchBusId);
      if (!bus) throw new Error(`USAD could not find the selected bus "${selectedDispatchBusId}" for walk-in booking.`);
      assertSeatMapEditable(bus);
      const seatId = bookWalkInButton.dataset.bookWalkInSeat;
      if (selectedDispatchSeatBooking?.busId !== bus.id || selectedDispatchSeatBooking.seatId !== seatId || selectedDispatchSeatBooking.type !== "available") {
        throw new Error(`USAD could not confirm the walk-in booking for seat ${seatId}. Select an available seat and try again.`);
      }
      if (getBookingForSeat(bus, seatId)) {
        throw new Error(`USAD cannot book seat ${seatId} on Bus ${bus.busNo} because it is already occupied.`);
      }

      const booking = createWalkInBooking(bus, seatId);
      bus.walkInBookings.push(booking);
      updateFleetOccupancyDisplay(bus);
      selectedDispatchSeatBooking = { busId: bus.id, ...booking };
      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      const panel = screen.querySelector("#dispatch-panel-container");
      if (panel) panel.innerHTML = renderDispatchControlPanel();
      return;
    }

    const selectBusRow = event.target.closest("[data-select-bus]");
    if (selectBusRow) {
      selectedDispatchBusId = selectBusRow.dataset.selectBus;
      selectedDispatchSeatBooking = null;
      screen.querySelectorAll("[data-select-bus]").forEach((r) => {
        r.classList.toggle("is-selected", r === selectBusRow);
      });
      const panel = screen.querySelector("#dispatch-panel-container");
      if (dispatchPanelOpen && panel) panel.innerHTML = renderDispatchControlPanel();
      const mapContainer = screen.querySelector("#radar-viewport-container");
      if (mapContainer) mapContainer.innerHTML = renderRadarMapSvg();
      return;
    }

    const mapBus = event.target.closest("[data-map-bus]");
    if (mapBus) {
      selectedDispatchBusId = mapBus.dataset.mapBus;
      selectedDispatchSeatBooking = null;
      const tbody = screen.querySelector("#fleet-telemetry-tbody");
      if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
      const panel = screen.querySelector("#dispatch-panel-container");
      if (dispatchPanelOpen && panel) panel.innerHTML = renderDispatchControlPanel();
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

    const peakDispatchBtn = event.target.closest("[data-peak-dispatch]");
    if (peakDispatchBtn) {
      const bus = peakDispatchQueue.find((item) => item.id === peakDispatchBtn.dataset.peakDispatch);
      if (!bus || bus.status !== "ready") return;
      bus.status = "dispatched";
      peakDispatchAnnouncement = `Bus ${bus.busNo} marked as dispatched in this prototype.`;
      const readinessPanel = screen.querySelector("#peak-readiness-container");
      if (readinessPanel) readinessPanel.outerHTML = renderPeakDispatchReadiness();
      return;
    }

    if (event.target.closest("[data-peak-dispatch-reset]")) {
      peakDispatchQueue.forEach((bus) => { bus.status = "ready"; });
      peakDispatchAnnouncement = "Demo queue reset. All staged buses are ready.";
      const readinessPanel = screen.querySelector("#peak-readiness-container");
      if (readinessPanel) readinessPanel.outerHTML = renderPeakDispatchReadiness();
      return;
    }

    const dispatchActionBtn = event.target.closest("[data-dispatch-action]");
    if (dispatchActionBtn) {
      const action = dispatchActionBtn.dataset.dispatchAction;
      const unit = fleetDispatchTelemetryUnits.find((u) => u.id === selectedDispatchBusId) || fleetDispatchTelemetryUnits[0];
      const textarea = screen.querySelector("[data-dispatch-note]");

      if (action === "reroute") {
        dispatchNoteInput = `Route update: Continue via ${activeRoute.via} to ${activeRoute.destination} and make up an 8-minute delay.`;
        if (textarea) {
          textarea.value = dispatchNoteInput;
          textarea.focus();
        }
      } else if (action === "hold") {
        dispatchNoteInput = `Schedule adjustment: Wait at ${activeRoute.destination} for 4 minutes to keep buses evenly spaced.`;
        if (textarea) {
          textarea.value = dispatchNoteInput;
          textarea.focus();
        }
      } else if (action === "recall") {
        dispatchNoteInput = `Return to Saraza Central Depot for a vehicle check.`;
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
      } else if (action === "finish-trip" && !unit.tripFinished) {
        const passengerMatch = unit.occupancySeats.match(/^(\d+)\s*\/\s*\d+/);
        const passengers = passengerMatch ? Number(passengerMatch[1]) : NaN;
        if (!Number.isFinite(passengers)) {
          peakDispatchAnnouncement = `Could not record remittance for Bus ${unit.busNo}: passenger count is unavailable.`;
          const panel = screen.querySelector("#dispatch-panel-container");
          if (panel) panel.innerHTML = renderDispatchControlPanel();
          return;
        }

        unit.tripFinished = true;
        selectedDispatchSeatBooking = null;
        unit.category = "completed";
        unit.statusText = "Finished";
        unit.statusType = "completed";
        unit.nextStop = "Trip completed";
        unit.etaText = "Finished";
        const remittance = {
          id: `REM-${unit.busNo}-${Date.now()}`,
          busNo: unit.busNo,
          route: unit.tripName,
          passengers,
          farePerPassenger: sampleFarePerPassenger,
          amount: passengers * sampleFarePerPassenger,
          finishedAt: new Date().toLocaleString(),
        };
        dispatchRemittances.unshift(remittance);
        const panel = screen.querySelector("#dispatch-panel-container");
        if (panel) panel.innerHTML = renderDispatchControlPanel();
        const tbody = screen.querySelector("#fleet-telemetry-tbody");
        if (tbody) tbody.innerHTML = renderFleetTelemetryRows();
        const remittancePanel = screen.querySelector("#dispatch-remittances-container");
        if (remittancePanel) remittancePanel.outerHTML = renderDispatchRemittances();
      }
      return;
    }

    const confirmCrewBtn = event.target.closest("[data-admin-confirm-crew]");
    if (confirmCrewBtn) {
      const busId = confirmCrewBtn.dataset.adminConfirmCrew;
      const unit = fleetDispatchTelemetryUnits.find((u) => u.id === busId);
      const driverIn = screen.querySelector("#reassign-driver-input");
      const dispatcherIn = screen.querySelector("#reassign-dispatcher-input");
      if (unit && driverIn && driverIn.value.trim()) {
        unit.driverName = driverIn.value.trim();
      }
      if (unit && dispatcherIn && dispatcherIn.value.trim()) {
        unit.dispatcherName = dispatcherIn.value.trim();
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
      staffCurrentPage = 1;
      updateStaffDirectory();
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

    if (event.target.closest("[data-staff-bulk-delete]")) {
      if (staffSelectedRows.size === 0) return;
      openAdminModal("staff-delete-selected");
      return;
    }

    const staffBulkDeleteConfirm = event.target.closest("[data-staff-delete-selected]");
    if (staffBulkDeleteConfirm) {
      const selectedIds = new Set(staffSelectedRows);
      const removedStaff = adminStaffMembersData.filter((member) => selectedIds.has(member.id));
      if (removedStaff.length === 0) throw new Error("Staff removal could not be completed: no selected staff members remain.");
      for (let index = adminStaffMembersData.length - 1; index >= 0; index -= 1) {
        if (selectedIds.has(adminStaffMembersData[index].id)) adminStaffMembersData.splice(index, 1);
      }
      removedStaff.forEach((member) => {
        staffSelectedRows.delete(member.id);
        adminFleetData.forEach((bus) => {
          if (bus.driver === member.name) bus.driver = "Unassigned";
        });
        fleetDispatchTelemetryUnits.forEach((unit) => {
          if (unit.driverName === member.name) unit.driverName = "Unassigned";
        });
      });
      screen.querySelector(".admin-modal-backdrop")?.remove();
      updateStaffDirectory();
      const fleetTbody = screen.querySelector("#admin-fleet-tbody");
      if (fleetTbody) fleetTbody.innerHTML = renderAdminFleetRows();
      const telemetryTbody = screen.querySelector("#fleet-telemetry-tbody");
      if (telemetryTbody) telemetryTbody.innerHTML = renderFleetTelemetryRows();
      const dispatchPanel = screen.querySelector("#dispatch-panel-container");
      if (dispatchPanelOpen && dispatchPanel) dispatchPanel.innerHTML = renderDispatchControlPanel();
      return;
    }

    const staffEditButton = event.target.closest("[data-staff-edit]");
    if (staffEditButton) {
      openAdminModal(`staff-edit-${staffEditButton.dataset.staffEdit}`);
      return;
    }

    const staffRemoveButton = event.target.closest("[data-staff-remove]");
    if (staffRemoveButton) {
      openAdminModal(`staff-delete-${staffRemoveButton.dataset.staffRemove}`);
      return;
    }

    const staffDeleteConfirm = event.target.closest("[data-staff-delete-confirm]");
    if (staffDeleteConfirm) {
      const staffId = staffDeleteConfirm.dataset.staffDeleteConfirm;
      const staffIndex = adminStaffMembersData.findIndex((member) => member.id === staffId);
      if (staffIndex === -1) throw new Error(`Staff member could not be removed: "${staffId}" was not found.`);
      const [removedStaff] = adminStaffMembersData.splice(staffIndex, 1);
      adminFleetData.forEach((bus) => {
        if (bus.driver === removedStaff.name) bus.driver = "Unassigned";
      });
      fleetDispatchTelemetryUnits.forEach((unit) => {
        if (unit.driverName === removedStaff.name) unit.driverName = "Unassigned";
      });
      screen.querySelector(".admin-modal-backdrop")?.remove();
      updateStaffDirectory();
      updateStaffSelectionControls();
      const fleetTbody = screen.querySelector("#admin-fleet-tbody");
      if (fleetTbody) fleetTbody.innerHTML = renderAdminFleetRows();
      const dispatchTbody = screen.querySelector("#fleet-telemetry-tbody");
      if (dispatchTbody) dispatchTbody.innerHTML = renderFleetTelemetryRows();
      const dispatchPanel = screen.querySelector("#dispatch-panel-container");
      if (dispatchPanelOpen && dispatchPanel) dispatchPanel.innerHTML = renderDispatchControlPanel();
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
      updateStaffSelectionControls();
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
      updateStaffSelectionControls();
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
      updateStaffSelectionControls();
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
      updateStaffDirectory();
      return;
    }

    const staffPageBtn = event.target.closest("[data-staff-page]");
    if (staffPageBtn) {
      if (staffPageBtn.disabled) return;
      const pageVal = staffPageBtn.dataset.staffPage;
      const pageCount = Math.ceil(getFilteredStaffMembers().length / staffPageSize);
      if (pageVal === "prev") staffCurrentPage = Math.max(1, staffCurrentPage - 1);
      else if (pageVal === "next") staffCurrentPage = Math.min(pageCount, staffCurrentPage + 1);
      else staffCurrentPage = Number(pageVal) || 1;
      updateStaffDirectory();
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

    const notificationFilterButton = event.target.closest("[data-notification-filter]");
    if (notificationFilterButton) {
      notificationFilter = notificationFilterButton.dataset.notificationFilter;
      updateNotificationView();
      return;
    }

    const ticketTabButton = event.target.closest("[data-ticket-tab-select]");
    if (ticketTabButton) {
      tripHistoryTab = ticketTabButton.dataset.ticketTabSelect;
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
      notification.unread = false;
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

    const ratingToggle = event.target.closest("[data-trip-rating-toggle]");
    if (ratingToggle) {
      activeTripRatingId = ratingToggle.dataset.tripRatingToggle;
      const savedRating = tripRatings.get(activeTripRatingId);
      selectedTripRating = savedRating?.stars ?? 0;
      selectedTripComment = savedRating?.comment ?? "";
      const modal = screen.querySelector("[data-trip-rating-modal]");
      if (!modal) throw new Error("USAD could not open trip rating because the rating dialog is missing.");
      modal.hidden = false;
      modal.querySelectorAll("[data-trip-rating-choice]").forEach((button) => {
        const selected = Number(button.dataset.tripRatingChoice) <= selectedTripRating;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      const commentField = modal.querySelector("[data-trip-rating-comment]");
      if (commentField) commentField.value = selectedTripComment;
      const ratingTrip = tripHistory.find(({ id }) => id === activeTripRatingId);
      const tripSummary = modal.querySelector("[data-trip-rating-summary]");
      if (!ratingTrip || !tripSummary) throw new Error(`USAD could not display trip details for rating ${activeTripRatingId}.`);
      tripSummary.textContent = `${ratingTrip.origin} → ${ratingTrip.destination} · ${ratingTrip.date}`;
      const characterCount = modal.querySelector("[data-trip-rating-character-count]");
      if (characterCount) characterCount.textContent = `${selectedTripComment.length}/50`;
      const submit = modal.querySelector("[data-submit-trip-rating]");
      if (submit) submit.disabled = selectedTripRating === 0;
      if (submit) submit.textContent = savedRating ? "Update rating" : "Submit rating";
      commentField?.focus();
      return;
    }

    const closeRating = event.target.closest("[data-trip-rating-close]");
    if (closeRating || event.target.matches("[data-trip-rating-modal]")) {
      const modal = screen.querySelector("[data-trip-rating-modal]");
      if (modal) modal.hidden = true;
      screen.querySelector(`[data-trip-rating-toggle="${CSS.escape(activeTripRatingId)}"]`)?.focus();
      activeTripRatingId = "";
      selectedTripRating = 0;
      selectedTripComment = "";
      return;
    }

    const ratingChoice = event.target.closest("[data-trip-rating-choice]");
    if (ratingChoice) {
      selectedTripRating = Number(ratingChoice.dataset.tripRatingChoice);
      if (!Number.isInteger(selectedTripRating) || selectedTripRating < 1 || selectedTripRating > 5) {
        throw new Error("USAD could not update a trip rating because the selected value is invalid.");
      }
      screen.querySelectorAll("[data-trip-rating-modal] [data-trip-rating-choice]").forEach((button) => {
        const selected = Number(button.dataset.tripRatingChoice) <= selectedTripRating;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      const submit = screen.querySelector("[data-submit-trip-rating]");
      if (submit) submit.disabled = false;
      return;
    }

    const submitTripRating = event.target.closest("[data-submit-trip-rating]");
    if (submitTripRating) {
      if (!activeTripRatingId || selectedTripRating < 1 || selectedTripRating > 5) {
        throw new Error("USAD could not submit the trip rating because a valid rating has not been selected.");
      }
      const tripId = activeTripRatingId;
      tripRatings.set(tripId, { stars: selectedTripRating, comment: selectedTripComment.trim() });
      const ratingButton = screen.querySelector(`[data-trip-rating-toggle="${CSS.escape(tripId)}"]`);
      if (ratingButton) ratingButton.textContent = "Edit rating";
      activeTripRatingId = "";
      selectedTripRating = 0;
      selectedTripComment = "";
      renderScreen("tickets");
      return;
    }

    const viewTripButton = event.target.closest("[data-view-trip]");
    if (viewTripButton) {
      const trip = tripHistory.find(({ id }) => id === viewTripButton.dataset.viewTrip);
      if (!trip) throw new Error(`Unknown trip ticket requested: ${viewTripButton.dataset.viewTrip}.`);
      selectedHistoryTripId = trip.id;
      bookingConfirmed = false;
      renderScreen("booking-confirmed");
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
      } else if (action === "rebook-trip") {
        const trip = tripHistory.find(({ id }) => id === actionButton.dataset.tripId);
        if (!trip) throw new Error(`Unknown trip selected for rebooking: ${actionButton.dataset.tripId}.`);
        tripData = {
          ...tripData,
          origin: trip.origin,
          destination: trip.destination,
          passengers: trip.passengers || 1,
          payment: "GCash",
          seat: trip.seat === "—" ? "1A" : trip.seat,
          departureDate: defaultDepartureDate(),
          departureTime: "08:15",
        };
        openQuickBookOverlay();
      } else if (action === "open-confirmation") {
        const seatBookingPanel = screen.querySelector(".seat-book-card");
        if (seatBookingPanel) {
          const payment = seatBookingPanel.querySelector('input[name="payment"]:checked')?.value ?? tripData.payment;
          const passengers = Number.parseInt(seatBookingPanel.querySelector("#seat-passengers")?.textContent ?? "1", 10);
          const paymentError = seatBookingPanel.querySelector("[data-payment-error]");
          if (insufficientUPouchPayment(payment, passengers)) {
            if (paymentError) paymentError.hidden = false;
            seatBookingPanel.querySelector('input[name="payment"][value="U-Pouch"]')?.setAttribute("aria-invalid", "true");
            return;
          }
          if (paymentError) paymentError.hidden = true;
          tripData = { ...tripData, payment, passengers, seat: selectedBusSeatId || tripData.seat };
        }
        renderScreen("booking-confirmation");
      } else if (action === "confirm-booking") {
        const departureDateInput = screen.querySelector("#booking-departure-date");
        const departureTimeInput = screen.querySelector("#booking-departure-time");
        const dateError = screen.querySelector("[data-booking-date-error]");
        if (!departureDateInput || !departureTimeInput || !dateError) {
          throw new Error("USAD booking could not continue: departure date and time controls are missing.");
        }
        if (!departureDateInput.reportValidity() || !departureTimeInput.reportValidity()) return;
        const departure = new Date(`${departureDateInput.value}T${departureTimeInput.value}`);
        if (!Number.isFinite(departure.getTime()) || departure.getTime() <= Date.now()) {
          dateError.hidden = false;
          departureDateInput.setAttribute("aria-invalid", "true");
          departureTimeInput.setAttribute("aria-invalid", "true");
          departureDateInput.focus();
          return;
        }
        dateError.hidden = true;
        departureDateInput.removeAttribute("aria-invalid");
        departureTimeInput.removeAttribute("aria-invalid");
        tripData = {
          ...tripData,
          departureDate: departureDateInput.value,
          departureTime: departureTimeInput.value,
        };
        const reference = createBookingReference();
        const confirmedTrip = {
          id: reference,
          receiptId: reference,
          date: "Just now",
          travelDate: tripData.departureDate,
          departureTime: tripData.departureTime,
          status: "upcoming",
          origin: tripData.origin,
          originDetail: tripData.origin === activeRoute.origin ? activeRoute.originShort : "Trip origin",
          destination: tripData.destination,
          destinationDetail: `Via ${activeRoute.via}`,
          fare: 100 * tripData.passengers,
          seat: tripData.seat,
          passengers: tripData.passengers,
          payment: tripData.payment,
          co2Saved: 0,
          inMonth: true,
        };
        tripHistory.unshift(confirmedTrip);
        selectedHistoryTripId = confirmedTrip.id;
        bookingConfirmed = true;
        tripHistoryTab = "upcoming";
        renderScreen("booking-confirmed");
      } else if (action === "cancel-booking") {
        const tripId = actionButton.dataset.tripId || selectedHistoryTripId;
        const cancelledTrip = tripHistory.find((trip) => trip.id === tripId);
        if (!cancelledTrip || cancelledTrip.status !== "upcoming") {
          throw new Error(`USAD could not cancel trip ${tripId || "(missing reference)"} because it is not an upcoming booking.`);
        }
        cancelledTrip.status = "cancelled";
        cancelledTrip.originalFare = cancelledTrip.fare;
        cancelledTrip.fare = 0;
        cancelledTrip.destinationDetail = "Booking cancelled · illustrative record";
        cancelledTrip.seat = "—";
        bookingConfirmed = false;
        selectedHistoryTripId = "";
        tripHistoryTab = "past";
        renderScreen("tickets");
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
