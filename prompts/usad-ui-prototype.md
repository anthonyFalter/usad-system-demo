# What is USAD?
USAD and the researcher’s initiative offers significant advantages for daily commuters by offering real-time visibility into the location of mini buses, route match, seat availability, and estimated arrival times; reducing an individual’s uncertainty and unnecessary waiting. Advanced ticket purchasing and seat reservation would also streamline boarding and minimize the risk of commuters being unable to board due to a mini bus being at full capacity. Traffic-aware ETAs would allow management to plan trips around congestion or delays rather than being caught off guard by them. The system would also offer better visibility into passenger demand, informing route and schedule adjustments. On a broader level, the system would support the ongoing PUV modernization efforts by extending improvements beyond the vehicle themselves and into the overall experience of commuting.

This solution aims to improve the operational process of Saraza TRD Transport Services Corp. Fleet management and deployment is a manual process for the operation of Saraza; transitioning from a manual to an automated process improves the overall fleet deployment and management. Saraza operates an ad-hoc dispatching; decisions and dispatch schedules are done unsystematically. Finances and sales monitoring are done manually, without a clear discrepancy report. Fleet deployment currently operates on a reactive basis, where vehicle assignment is strictly contingent on immediate daily functionality rather than structured, preventative maintenance schedules. Logging of bus and driver information, time in route, and discounts are recorded pen and paper.


# USAD UI-Only Prototype

Implement the USAD prototype as an interactive, UI-only experience using only the vanilla web development triad: HTML, CSS, and JavaScript. Do not use frameworks, component libraries, build tools, or external dependencies. Before changing code, inspect the existing project and available assets, and reuse relevant assets.

**Required design reference:** Read [`shadcn_components.md`](./shadcn_components.md) before implementation and treat it as a required source of styling and component guidance, not an optional suggestion. Apply its relevant shadcn conventions to the interface while implementing them with semantic native HTML and hand-written CSS/JavaScript. Do not install or import shadcn or any UI library. If a requested pattern is not covered by that file, follow the supplied screen reference and the project constraints rather than inventing a shadcn rule.

## Scope

- On the initial visit, show the question **“Which one?”** and two clear, clickable choices: **Admin** and **User**.
- Show the role choice as its own page before either system opens; it is not a frame on the prototype canvas.
- Admin is deferred; selecting it shows a brief “Coming soon” response.
- The User choice opens the complete commuter flow: login, registration, verification, home dashboard, live-map view, and associated ride booking and ticket screens. Do not reduce this to a login-only prototype.

## Visual direction

- Use the supplied login, login-error, and backend-error images as the visual guide for those states. Preserve their clean, restrained, white-screen design, generous whitespace, rounded controls, and centered composition. Extend the same visual language to registration and commuter screens.
- Brand green: `#2FD9A8`. Primary text: `#2C2C2C`. Use legible, muted neutrals for secondary text and borders, and a clear red treatment for login errors.
- In the invalid-login state, use `#FF0000` at 40% opacity for error outlines and `#E63238` for error text.
- Match the reference's compact “Forgot password?” link: approximately 11px and brand green `#2FD9A8`, not body/button-sized dark green text.
- Keep the “Having trouble? View service status” action compact (approximately 11px), brand green `#2FD9A8`, and centered beneath the registration line.
- Use “Enter Email/username” and “Enter password” as empty-field placeholders. Use a password input so masking bullets appear only after the user types a password.
- Use correctly recognizable Google, Facebook, and Apple marks in the same muted gray, centered and optically balanced to a consistent visual size in the OAuth buttons. Facebook should be a white lowercase “f” in a solid gray circle, matching the supplied icon reference.
- Use **SF Pro Display** where available, with a sensible system sans-serif fallback. Do not fetch or add a font dependency just for this prototype.
- On the home dashboard, anchor the location/greeting, destination search, and shortcut controls to the bottom of the green header panel instead of the top.
- Keep the home dashboard's corner language consistent: use generously rounded main panels and rows, a smaller matching radius for controls and icon tiles, and fully rounded chips where the pill shape serves as a status or shortcut. Keep the hierarchy intentional rather than giving every element the same radius; avoid mixing sharp corners into the rounded dashboard surface.
- Keep the home visually grounded and product-specific: preserve the existing route, balance, vehicle, and navigation content; use restrained borders and color; avoid decorative card grids, excessive shadows, or generic filler.
- Style the U-Pouch balance panel as a compact, full-width rounded surface with a clear gray label, prominent balance amount, outlined Top Up action, and a proportionate filled green wallet icon.
- The Profile destination opens an Account Information screen with a profile summary, notification/security switches, expandable settings groups, and a Customer Support link. Customer Information expands to labeled First Name, Middle Name, Last Name, Discount ID, and Address fields; Account Security expands to Email, Contact Number, and a masked Password field. Each field has an accessible edit/save control, with edits held in prototype-only in-memory state. Payment Options shows the U-Pouch toggle and E-Wallet, Card, GCash, and Maya link actions; clearly state that payment linking and processing are not connected. Customer Support opens a FAQ screen with search, topic filters, expandable answers, and a support contact action.
- The home notification bell opens a fixed-frame, internally scrollable mobile inbox. Show an unread badge, All/Unread filters, individual mark-read/unread actions, and a Mark all read action with touch-friendly controls. Keep sample alert content explicit: push delivery and live service alerts are not connected.
- Provide a visible back control on Account Information (to Home) and Customer Support (to Account Information).
- Account Information and FAQ content scroll vertically inside the fixed mobile frame as settings and help content grows. For FAQ artwork, use the uploaded `assets/3d-images/archery-target.png` as a blurred, decorative partial background layer and `assets/3d-images/robot-mascot.png` for the end-of-list illustration. Use the uploaded `wallet.png`, `cone.png`, `archery-target.png`, and `lightning.png` assets for Transactions, Operations, Fares, and Promos respectively; keep text and controls above the art and readable.
- Treat **393 × 852 CSS pixels** as the fixed target viewport for standard commuter screens, matching the original reference image. These are prototype frames on a canvas, not responsive pages: preserve the device-frame dimensions while the canvas itself is zoomed and panned.
- Keep every mobile screen, including Account Information and Customer Support, inside the fixed **393 × 852 CSS pixel** phone frame. Long account and FAQ content scrolls within the frame; never elongate the phone to fit content.
- Use the Account Information green header treatment, white title, and rounded back control consistently on Live Map, My Tickets, Notifications, and Customer Support. Do not render a status bar, clock, or status icons; reserve the same top spacing so titles remain unobstructed. Keep screen content below the full header within the fixed phone frame.
- Inspect `assets/` before recreating any illustrations or brand artwork; reuse suitable existing assets.

## Single-screen interaction prototype

After the user selects User, show exactly one 393 × 852 mobile screen at a time in a draggable, zoomable workspace. This is an interactive prototype, not a wireframe, storyboard, or canvas of side-by-side screens.

- Start on Login. Validate email format and require a password; invalid input stays on Login with inline field feedback. Submitting valid login details proceeds to the commuter home dashboard in this UI-only demo. “Register now” opens registration; require acceptance of the Terms of Service and Privacy Policy checkbox, and validate required fields, email, password strength, and password confirmation before verification. After verification, fade and gently stage the welcome screen components into view, show a small rotating loading indicator for about two seconds, then fade the components out before proceeding automatically to Home without a continue button. Keep motion reduced when the user prefers reduced motion.
- The home dashboard provides navigation to the Live Map, tickets, and profile, plus the illustrated ride-search and booking flow. The map is an interactive visual prototype with pan/zoom, but its routes, vehicle positions, availability, and ETAs are sample content, not connected live data. Booking and verification are also simulated; do not imply that payment or backend services are connected.
- Keep the illustrative bus movement restrained; on the Live Map, hovering or keyboard-focusing a simulated bus reveals its sample route, ETA, seat availability, and status.
- Use restrained motion only where it clarifies navigation or a state change: briefly fade/settle commuter app screens as they open, and softly reveal expanded FAQ/account details. Keep movement subtle and disable it for users who prefer reduced motion; avoid animating static content.
- Keep the login-error and backend-error states available as user-flow states with a clear way back to Login.
- Render only the active state in the phone viewport. Do not display other screens as frames, cards, thumbnails, or neighboring canvases.
- Keep frame labels, canvas controls, and navigation outside the mobile viewport.
- Support canvas panning by dragging the background, and zooming in and out with visible controls. If practical, support wheel/pinch zoom without hijacking ordinary page scrolling or mobile gestures.
- Open the user workspace at 100% zoom so the fixed mobile screen renders at native CSS pixel scale and stays crisp. Use browser-native CSS zoom rather than transform scaling for magnification, to avoid blurring text and controls. Do not automatically shrink the fixed mobile screen to fit short viewports; allow users to pan and zoom as needed.
- Keep zoom centered around the pointer or canvas center, prevent accidental panning when interacting with screen controls, and provide a way to return to a useful default zoom/position.
- Keep the canvas navigable and controls accessible by keyboard; use semantic buttons and visible focus styles.

## Implementation and validation

1. Inspect the existing project and available assets; read [`shadcn_components.md`](./shadcn_components.md) and apply its relevant styling/component guidance.
2. Implement the scoped prototype with plain HTML, CSS, and JavaScript only, translating the applicable guidance into native elements and CSS. Keep UI state local and make every in-scope choice and control produce an appropriate UI response.
3. Validate the role choice, each reachable user state rendered one at a time, and canvas pan/zoom behavior at the target viewport.
4. Keep changes limited to this prototype. Report what was implemented and which validation commands passed or could not be run.
5. Some of the assets (if provided) are in ./assets/3d-images
6. Avoid using Emojis/common AI generated stuffs and copy exactly what the user sent.
