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

  if (!rolePage || !workspacePage || !roleNote || !viewport || !world || !screen || !zoomOutput || !backButton || !fitButton) {
    throw new Error("USAD prototype could not initialize: required interface elements are missing.");
  }

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

  const unreadNotificationCount = () => notifications.filter((notification) => notification.unread).length;

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
      ? '<path class="road-local" d="M-20 45 94 72 148 59 215 86 380 65M-20 128 75 153 153 135 224 167 380 143M-20 214 92 194 160 224 247 208 380 242M-20 302 81 277 165 306 238 284 380 318M-20 392 88 360 161 395 255 372 380 414M-20 486 92 454 167 486 247 463 380 502M-20 574 84 548 164 577 255 553 380 596M42-20 62 102 42 206 76 303 50 404 87 505 68 660M118-20 133 78 110 174 145 272 124 373 153 468 137 570 160 660M235-20 218 93 251 186 224 285 261 383 232 475 272 572 251 660M326-20 302 92 335 188 310 282 348 374 318 469 350 566 330 660"/><path class="road-secondary" d="M158-10 169 112 151 181 191 253 163 329 210 386 200 469 231 552 202 650M-15 100 130 122 354 95M30 255 163 329 345 355M-12 455 210 386 365 422M66 0 91 180 44 313M290 35 252 202 290 300 269 620"/><path class="road-main" d="M158-10 169 112 151 181 191 253 163 329 210 386 200 469 231 552 202 650"/><path class="route-line" d="M107 390 163 380 185 365 163 350 211 338 191 320 217 300"/><circle class="map-junction" cx="163" cy="329" r="8"/><circle class="map-junction" cx="191" cy="253" r="7"/><circle class="map-junction" cx="210" cy="386" r="7"/>'
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
                <span class="seat-live-badge"><i></i> Live</span>
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
          </div>
        </header>
        ${mapMarkup(false, true)}
        <aside class="live-map-legend" aria-label="Traffic flow legend"><strong>Traffic Flow</strong><span><i class="is-normal"></i>Normal Flow</span><span><i class="is-moderate"></i>Moderate</span><span><i class="is-congested"></i>Congested</span></aside>
        <div class="map-controls" aria-label="Map controls"><button type="button" data-map-control="zoom-in" aria-label="Zoom in">+</button><output data-map-zoom>100%</output><button type="button" data-map-control="zoom-out" aria-label="Zoom out">−</button><span></span><button type="button" data-map-control="reset" aria-label="Reset map position"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11a8 8 0 1 1 2.3 5.7M4 5v6h6"/></svg></button></div>
        <section class="live-operations-panel" aria-label="Route operations summary">
          <span class="live-operations-handle" aria-hidden="true"></span>
          <div class="live-operations-route">
            <div><h2>Route Malolos ⇄ Trinoma</h2><div class="live-route-badges"><span>NLEX Express</span><span class="is-normal">Normal Flow</span></div></div>
            <div class="live-route-duration"><strong>42 mins</strong><small>Estimated</small></div>
          </div>
          <div class="live-route-context"><span>via Tabang Exit</span><span>Updated 1m ago</span></div>
          <p class="live-map-filter-summary" data-live-map-filter-summary role="status" aria-live="polite">12 trips · 2 buses on this corridor</p>
          <div class="live-operations-stats">
            <div><h3>Terminal Demand</h3><p>Tabang Bridge <strong>118 pax</strong></p><p>Malolos Hub <strong>42 pax</strong></p></div>
            <div><h3>Fleet Deployment</h3><p>Active on Road <strong>14 buses</strong></p><p>Dispatched Next <strong>~4 mins</strong></p></div>
          </div>
          <div class="live-next-departing"><span class="live-next-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10ZM7 7h10v6H7zM8 18.5v2m8-2v2"/></svg></span><div><strong>Next Departing: MLS-042</strong><small>8 available seats · Departing in 4 min</small></div><button type="button" data-action="quick-book">Reserve</button></div>
          <p class="live-operations-disclaimer">Illustrative operations data · Not live tracking</p>
        </section>
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
                <div class="profile-user-copy"><strong>${escapeHtml(registrationData.username || "JockyThePythonKing")}</strong><span>${escapeHtml([accountProfile.firstName, accountProfile.middleName, accountProfile.lastName].filter(Boolean).join(" "))}</span><span class="profile-status-badge">Unverified</span></div>
              </section>
              <button class="profile-verify-button" type="button" data-info="Discount ID verification is a prototype-only flow.">Verify Account <span aria-hidden="true">→</span></button>
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
    const buses = [...screen.querySelectorAll("[data-sim-bus]")];
    if (!buses.length) return;
    buses.forEach((bus) => {
      const info = liveBusDetails[Number(bus.dataset.simBus)];
      bus.setAttribute("role", "button");
      bus.setAttribute("aria-haspopup", "dialog");
      bus.setAttribute("aria-controls", "bus-popup-title");
      if (info) bus.setAttribute("aria-label", `${info.name}. ${info.route}. ${info.eta} away, ${info.seats} ${info.seats === 1 ? "seat" : "seats"} available, ${info.status.toLowerCase()}.`);
    });

    const route = [
      [32, 60], [45, 58], [51, 56], [45, 54], [59, 52],
      [53, 49], [60, 46],
    ];
    const segments = route.slice(1).map((point, index) => {
      const start = route[index];
      return { start, end: point, length: Math.hypot(point[0] - start[0], point[1] - start[1]) };
    });
    const routeLength = segments.reduce((total, segment) => total + segment.length, 0);
    const duration = 36000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const placeBus = (bus, distance) => {
      let remaining = distance;
      const segment = segments.find((part) => {
        if (remaining <= part.length) return true;
        remaining -= part.length;
        return false;
      }) || segments[segments.length - 1];
      const progress = Math.min(1, remaining / segment.length);
      bus.style.left = `${segment.start[0] + (segment.end[0] - segment.start[0]) * progress}%`;
      bus.style.top = `${segment.start[1] + (segment.end[1] - segment.start[1]) * progress}%`;
    };

    if (reduceMotion) {
      buses.forEach((bus, index) => placeBus(bus, routeLength * (index ? 0.68 : 0.28)));
      return;
    }

    const startedAt = performance.now();
    const animate = (now) => {
      if (activeState !== "live-map") return;
      buses.forEach((bus, index) => {
        if (bus.matches(":hover, :focus-visible")) return;
        const offset = index * duration * 0.48;
        const progress = ((now - startedAt + offset) % duration) / duration;
        placeBus(bus, routeLength * progress);
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
    if (state === "login") {
      screen.innerHTML = loginScreen();
    } else if (state === "login-error") {
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
    if (["home", "quick-book", "find-rides", "booking-confirmation", "booking-confirmed", "live-map", "live-seat-overview", "live-seat-detail", "tickets", "profile", "faq", "notifications"].includes(state)) {
      screen.firstElementChild?.classList.add("screen-enter");
    }
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
    world.style.left = `calc(50% - 196.5px + ${panX / zoom}px)`;
    world.style.top = `calc(50% - 426px + ${panY / zoom}px)`;
    zoomOutput.value = `${Math.round(zoom * 100)}%`;
    zoomOutput.textContent = `${Math.round(zoom * 100)}%`;
  };

  const resetCanvas = () => {
    zoom = 1;
    panX = 0;
    panY = Math.max(0, (852 * zoom - viewport.clientHeight) / 2 + 12);
    updateCanvas();
  };

  const openWorkspace = () => {
    rolePage.hidden = true;
    workspacePage.hidden = false;
    roleNote.textContent = "";
    renderScreen("login");
    resetCanvas();
    viewport.focus({ preventScroll: true });
  };

  document.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.open === "user") {
        openWorkspace();
      } else {
        roleNote.textContent = "Admin experience is coming soon.";
      }
    });
  });

  backButton.addEventListener("click", () => {
    workspacePage.hidden = true;
    rolePage.hidden = false;
    document.querySelector('[data-open="user"]').focus();
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
  });

  screen.addEventListener("input", (event) => {
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

    if (event.target.matches("#login-email")) {
      const emailError = screen.querySelector("#email-error");
      if (emailError) emailError.hidden = true;
      event.target.removeAttribute("aria-invalid");
    }

    if (event.target.matches("#register-email, #register-username, #register-password, #register-confirm-password")) {
      event.target.removeAttribute("aria-invalid");
      const fieldError = screen.querySelector(`#${event.target.id}-error`);
      if (fieldError) fieldError.hidden = true;
    }

    if (event.target.matches("#login-password")) {
      const passwordError = screen.querySelector("#login-password-error");
      if (passwordError) passwordError.hidden = true;
      event.target.removeAttribute("aria-invalid");
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

    if (event.target.matches("#terms-accepted") && event.target.checked) {
      event.target.removeAttribute("aria-invalid");
      const termsError = screen.querySelector("#terms-error");
      if (termsError) termsError.hidden = true;
    }
  });

  screen.addEventListener("click", (event) => {
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
