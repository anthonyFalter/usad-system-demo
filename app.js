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
  let tripData = {
    origin: "Robinsons Place Malolos",
    destination: "Trinoma",
    passengers: 1,
    payment: "GCash",
  };
  let bookingConfirmed = false;
  let liveMapPan = { x: 0, y: 0 };
  let liveMapZoom = 1;
  let liveMapDrag = null;
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

  const registerScreen = (showError = false) => `
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
        <p class="terms-copy">By signing up, you agree to our <button class="text-link" type="button" data-info="Terms and policy are not connected in this prototype.">Terms of Service</button> and <button class="text-link" type="button" data-info="Privacy policy is not connected in this prototype.">Privacy Policy</button>.</p>
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
        <button class="login-button success-continue" type="button" data-screen="home">Continue to home</button>
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
      ? '<path class="road-main" d="M158-10 169 112 151 181 191 253 163 329 210 386 200 469 231 552 202 650"/><path class="road-secondary" d="M-15 100 130 122 354 95M30 255 163 329 345 355M-12 455 210 386 365 422M66 0 91 180 44 313M290 35 252 202 290 300 269 620"/><path class="route-line" d="M107 440 163 464 185 393 163 329 211 269 191 206 217 141"/>'
      : '<path class="road-main" d="M-12 136 68 95 118 108 164 65 217 78 286 20 374 35"/><path class="road-secondary" d="M-15 48 68 95 95 166M118 108 152 180M164 65 147 0M217 78 231 158M286 20 312 0M286 20 332 114"/><path class="route-line" d="M48 119 110 104 160 70 220 77 296 35"/>';
    const viewBox = live ? "0 0 360 640" : "0 0 360 180";
    return `
      <div class="map-art${compact ? " is-compact" : ""}${live ? " is-live" : ""}" role="img" aria-label="Illustrative route map from Malolos toward Trinoma">
        <div class="map-scene">
          <span class="map-block map-block-one"></span><span class="map-block map-block-two"></span>
          <span class="map-block map-block-three"></span><span class="map-block map-block-four"></span>
          <svg class="map-roads" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${roads}</svg>
          <span class="map-label map-label-one">MALINTA</span><span class="map-label map-label-two">NORTH AVE</span>
          <span class="map-marker map-marker-start" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-8.1 8-13a8 8 0 1 0-16 0c0 4.9 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>
          <span class="map-marker map-marker-bus" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"/><path d="M7 7h10v6H7zM8 18.5v2m8-2v2M8.5 15.5h.01m7 0h.01"/></svg></span>
          <span class="map-marker map-marker-destination" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-8.1 8-13a8 8 0 1 0-16 0c0 4.9 8 13 8 13Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>
          ${compact ? "" : '<span class="map-compass" aria-hidden="true">N</span>'}
        </div>
      </div>`;
  };

  const homeScreen = () => `
    <div class="commuter-app">
      <div class="home-scroll">
        <header class="home-header">
          <div class="home-greeting-row">
            <div><p class="location-kicker"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Your Location</p><h1>Robinsons Place Malolos</h1></div>
            <button class="notification-button" type="button" aria-label="Notifications" data-info="You're all caught up."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span></span></button>
          </div>
          <form class="destination-search" data-route-search>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
            <input name="destination" type="text" placeholder="Where are you heading?" aria-label="Where are you heading?">
            <button type="submit" aria-label="Search rides"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="9" cy="7" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="11" cy="17" r="1.7"/></svg></button>
          </form>
          <div class="home-shortcuts">
            <button type="button" data-info="Your saved routes will appear here."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4V4Z"/></svg>Saved Routes</button>
            <button type="button" data-info="Fare estimates are shown with ride results."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h5"/></svg>Fare Estimator</button>
            <button type="button" data-info="Home location updated for this demo."><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Set Home</button>
          </div>
        </header>
        <section class="pouch-panel" aria-label="U-Pouch balance">
          <div><span>Current U-Pouch Balance:</span><strong>₱2.00</strong></div>
          <button type="button" data-info="Top up is a visual demo only.">＋ Top Up</button>
          <span class="pouch-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h15v13H4zM4 7l2-3h13v3m0 3h3v5h-3a2.5 2.5 0 0 1 0-5Z"/><circle cx="18" cy="12.5" r=".7"/></svg></span>
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
      <div class="modal-scrim">
        <form class="bottom-sheet quick-book-sheet" data-quick-book>
          <span class="sheet-handle"></span>
          <button class="modal-close" type="button" aria-label="Close" data-screen="home">×</button>
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

  const bookingConfirmedScreen = () => `
    <div class="booking-confirmed">
      <button type="button" class="confirmed-back" data-screen="home" aria-label="Back to home">‹</button>
      <div class="confirmed-check" aria-hidden="true">✓</div>
      <h1>Booking Confirmed</h1><p>₱${(80 * tripData.passengers).toFixed(2)} total · ${escapeHtml(tripData.payment)} demo</p>
      <section class="ticket-panel">
        <div class="demo-qr" role="img" aria-label="Illustrative non-scannable ticket code"><i></i><i></i><i></i><b></b></div>
        <span class="ticket-caption">Ticket Reference</span><strong class="ticket-number">USAD-7X29-KM41</strong>
        <div class="ticket-route"><span class="ride-logo">MLS<small>NAVE</small></span><div><strong>Malolos – North Avenue Station</strong><small>${escapeHtml(tripData.origin)} → ${escapeHtml(tripData.destination)}</small></div></div>
        <div class="ticket-facts"><div><span>Arrival</span><strong>3 minutes</strong></div><div><span>Seat held until</span><strong>9:51 AM</strong></div><div><span>Passengers</span><strong>${tripData.passengers}</strong></div><div><span>Fare total</span><strong>₱${(80 * tripData.passengers).toFixed(2)}</strong></div></div>
        <button type="button" class="track-ride" data-screen="live-map"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>Track this ride</button>
      </section>
      <button type="button" class="cancel-booking" data-action="cancel-booking">Cancel booking</button>
      <p class="prototype-stamp">Demo confirmation · No payment was processed</p>
    </div>`;

  const secondaryTabScreen = (state) => {
    const titles = { "live-map": "Live Map", tickets: "My Tickets", profile: "Profile" };
    const content = state === "live-map"
      ? `<div class="tab-map" tabindex="0" aria-label="Illustrative map. Drag to pan, use plus and minus to zoom, or use arrow keys.">${mapMarkup(false, true)}<div class="map-controls" aria-label="Map controls"><button type="button" data-map-control="zoom-in" aria-label="Zoom in">+</button><output data-map-zoom>100%</output><button type="button" data-map-control="zoom-out" aria-label="Zoom out">−</button><span></span><button type="button" data-map-control="reset" aria-label="Reset map position"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11a8 8 0 1 1 2.3 5.7M4 5v6h6"/></svg></button></div><div class="map-live-card"><strong>Malolos – North Avenue Station</strong><span>Illustrative vehicle · Estimated arrival 3 min</span></div><p class="map-attribution">Illustrative map · Drag to explore</p></div>`
      : state === "tickets"
        ? bookingConfirmed
          ? `<button class="saved-ticket" type="button" data-screen="booking-confirmed"><strong>USAD-7X29-KM41</strong><span>${escapeHtml(tripData.origin)} → ${escapeHtml(tripData.destination)}</span><small>View ticket details →</small></button>`
          : `<p class="empty-tab">Your booked rides will appear here.</p>`
        : `<div class="profile-summary"><span class="profile-avatar">${escapeHtml((registrationData.username || "U").slice(0, 1).toUpperCase())}</span><strong>${escapeHtml(registrationData.username || "USAD Commuter")}</strong><span>${escapeHtml(registrationData.email || "Demo account")}</span><button type="button" data-screen="login">Sign out</button></div>`;
    return `<div class="commuter-app secondary-tab"><header class="tab-header"><button type="button" class="round-back" data-screen="home" aria-label="Back to home">‹</button><h1>${titles[state]}</h1></header><div class="tab-content">${content}</div>${navigation(state)}${state === "live-map" ? "" : '<p class="prototype-stamp">Illustrative demo · No live service connected</p>'}</div>`;
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

  const renderScreen = (state) => {
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
      screen.innerHTML = registerScreen(true);
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
    } else if (state === "live-map" || state === "tickets" || state === "profile") {
      screen.innerHTML = secondaryTabScreen(state);
      if (state === "live-map") {
        liveMapPan = { x: 0, y: 0 };
        liveMapZoom = 1;
        applyLiveMapTransform();
      }
    } else if (state === "backend-error") {
      screen.innerHTML = backendErrorScreen();
    } else {
      throw new Error(`Unknown USAD prototype screen: ${state}`);
    }
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
    if (activeState !== "live-map" || !map || event.button !== 0 || event.target.closest(".map-controls, .map-live-card")) return;
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
    if (activeState !== "live-map" || !event.target.closest(".tab-map")) return;
    event.preventDefault();
    event.stopPropagation();
    liveMapZoom = Math.min(2.4, Math.max(1, liveMapZoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12)));
    applyLiveMapTransform();
  }, { passive: false });

  screen.addEventListener("keydown", (event) => {
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
      renderScreen("home");
      return;
    }

    if (event.target.matches("[data-register-form]")) {
      event.preventDefault();
      const username = screen.querySelector("#register-username");
      const email = screen.querySelector("#register-email");
      const password = screen.querySelector("#register-password");
      const confirmPassword = screen.querySelector("#register-confirm-password");
      const hasEmptyField = !username?.value.trim() || !email?.value.trim() || !password?.value || !confirmPassword?.value;
      const invalidEmail = email ? !email.validity.valid : true;
      const weakPassword = password ? !/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password.value) : true;
      const mismatch = password && confirmPassword ? password.value !== confirmPassword.value : true;

      if (hasEmptyField || invalidEmail || weakPassword || mismatch) {
        renderScreen("register-error");
        const restoredUsername = screen.querySelector("#register-username");
        const restoredEmail = screen.querySelector("#register-email");
        const restoredPassword = screen.querySelector("#register-password");
        const restoredConfirmPassword = screen.querySelector("#register-confirm-password");
        if (restoredUsername) restoredUsername.value = username?.value ?? "";
        if (restoredEmail) restoredEmail.value = email?.value ?? "";
        if (restoredPassword) restoredPassword.value = password?.value ?? "";
        if (restoredConfirmPassword) restoredConfirmPassword.value = confirmPassword?.value ?? "";
        screen.querySelector(".form-alert")?.focus({ preventScroll: true });
        return;
      }

      registrationData = {
        username: username.value.trim(),
        email: email.value.trim(),
      };

      renderScreen("verification");
    }

    if (event.target.matches("[data-verification-form]")) {
      event.preventDefault();
      renderScreen("register-success");
      return;
    }

    if (event.target.matches("[data-route-search]")) {
      event.preventDefault();
      const destination = new FormData(event.target).get("destination");
      if (typeof destination === "string" && destination.trim()) {
        tripData.destination = destination.trim();
        renderScreen("find-rides");
      } else {
        renderScreen("quick-book");
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
  });

  screen.addEventListener("click", (event) => {
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

    const stateButton = event.target.closest("[data-screen]");
    if (stateButton) {
      renderScreen(stateButton.dataset.screen);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const { action } = actionButton.dataset;
      if (action === "quick-book") {
        renderScreen("quick-book");
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
      const message = screen.querySelector("[data-message]");
      if (message) message.textContent = infoButton.dataset.info;
    }
  });

  renderScreen(activeState);
  resetCanvas();
})();
