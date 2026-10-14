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
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.35 12.22c0-.71-.06-1.39-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.19ZM12 21.75c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.55 0-4.72-1.72-5.5-4.04H3.25v2.5A9.75 9.75 0 0 0 12 21.75Z"/><path fill="currentColor" d="M6.5 13.87a5.87 5.87 0 0 1 0-3.74v-2.5H3.25a9.75 9.75 0 0 0 0 8.74l3.25-2.5Z"/><path fill="currentColor" d="M12 6.1c1.43 0 2.71.49 3.72 1.47l2.79-2.79C16.84 3.2 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.75 5.38l3.25 2.5C7.28 7.82 9.45 6.1 12 6.1Z"/></svg>
      </button>
      <button class="social-button" type="button" aria-label="Continue with Facebook" data-info="Facebook sign-in is not connected in this prototype.">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.25A9.75 9.75 0 1 0 13.43 21.65v-6.81h2.28l.34-2.66h-2.62v-1.7c0-.77.22-1.3 1.31-1.3h1.4V6.8c-.24-.03-1.06-.1-2.02-.1-2 0-3.37 1.22-3.37 3.46v2.02H8.49v2.66h2.26v6.84A9.75 9.75 0 0 0 12 2.25Z"/></svg>
      </button>
      <button class="social-button" type="button" aria-label="Continue with Apple" data-info="Apple sign-in is not connected in this prototype.">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.63c.02 2.18 1.91 2.9 1.93 2.91-.02.05-.3 1.04-.98 2.06-.6.89-1.23 1.77-2.22 1.79-.97.02-1.28-.58-2.39-.58-1.11 0-1.46.56-2.38.6-.95.03-1.67-.96-2.28-1.85-1.24-1.8-2.18-5.08-.91-7.3.63-1.1 1.75-1.8 2.97-1.82.93-.02 1.8.63 2.38.63.57 0 1.65-.78 2.78-.66.47.02 1.8.19 2.65 1.43-.07.04-1.58.92-1.55 2.79Zm-1.83-6.02c.5-.61.84-1.46.75-2.31-.73.03-1.61.49-2.13 1.09-.47.54-.89 1.4-.78 2.23.81.06 1.65-.41 2.16-1.01Z"/></svg>
      </button>
    </div>`;

  let activeState = "login";
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let dragOrigin = null;

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
          <input id="login-email" name="email" type="email" placeholder="jockypyth onking@edu.phd.engr.com" autocomplete="email"${showError ? ' value="jockypyth onking@edu.phd.engr.com" aria-invalid="true"' : ""}>
        </div>
        <div class="form-field">
          <label for="login-password">Password</label>
          <input id="login-password" name="password" type="password" placeholder="••••••••••" autocomplete="current-password"${showError ? ' value="password123" aria-invalid="true"' : ""}>
        </div>
        <button class="text-link forgot-link" type="button" data-info="Password recovery is not connected in this prototype.">Forgot password?</button>
        <button class="login-button" type="submit">Login</button>
        <div class="social-divider"><span></span><span>or</span><span></span></div>
        ${socialButtons}
        <p class="register-copy">Don't have an account? <button class="text-link" type="button" data-info="Registration is not connected in this prototype.">Register now</button></p>
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

  const renderScreen = (state) => {
    activeState = state;
    screen.replaceChildren();
    if (state === "login") {
      screen.innerHTML = loginScreen();
    } else if (state === "login-error") {
      screen.innerHTML = loginScreen(true);
    } else if (state === "backend-error") {
      screen.innerHTML = backendErrorScreen();
    } else {
      throw new Error(`Unknown USAD prototype screen: ${state}`);
    }
  };

  const updateCanvas = () => {
    world.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`;
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
      zoom = Math.min(1.25, Math.max(0.35, zoom * multiplier));
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

  screen.addEventListener("submit", (event) => {
    if (!event.target.matches("[data-login-form]")) return;
    event.preventDefault();
    renderScreen("login-error");
    screen.querySelector(".form-alert")?.focus({ preventScroll: true });
  });

  screen.addEventListener("click", (event) => {
    const stateButton = event.target.closest("[data-screen]");
    if (stateButton) {
      renderScreen(stateButton.dataset.screen);
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
