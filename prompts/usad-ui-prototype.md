# USAD UI-Only Prototype

Implement the USAD prototype as an interactive, UI-only experience. Before changing code, inspect the existing app structure, stack, and available assets, and read [`shadcn_components.md`](./shadcn_components.md). Follow established project patterns and reuse relevant existing components and assets. Do not add dependencies unless the current stack cannot meet the requirements.

## Scope

- On the initial visit, show the question **“Which one?”** and two clear, clickable choices: **Admin** and **User**.
- The User choice opens the mobile user flow described below.

## Visual direction

- Use the supplied reference image as the visual guide for the three mobile screens. Preserve its clean, restrained, white-screen design, generous whitespace, rounded controls, and centered composition.
- Brand green: `#2FD9A8`. Primary text: `#2C2C2C`. Use legible, muted neutrals for secondary text and borders, and a clear red treatment for login errors.
- Use **SF Pro Display** where available, with a sensible system sans-serif fallback. Do not fetch or add a font dependency just for this prototype.
- Treat **393 × 852 CSS pixels** as the target mobile viewport for each user screen. Keep content usable on smaller screens and avoid clipping on taller or shorter viewports.
- Inspect `assets/` before recreating any illustrations or brand artwork; reuse suitable existing assets.

## Prototype canvas

Present the screens in a draggable, zoomable prototype workspace rather than making the mobile screens themselves draggable.

- Place the role-choice entry and the three user-flow states as distinct, clearly identifiable frames. Keep the mobile content within its 393 × 852 viewport; any frame labels or canvas controls belong outside the mobile viewport.
- Support canvas panning by dragging the background, and zooming in and out with visible controls. If practical, support wheel/pinch zoom without hijacking ordinary page scrolling or mobile gestures.
- Keep zoom centered around the pointer or canvas center, prevent accidental panning when interacting with screen controls, and provide a way to return to a useful default zoom/position.
- Keep the canvas navigable and the controls accessible by keyboard; use semantic buttons and visible focus styles.
- the protoype shouldnt be responsive as we already have a zoom-in/out feature.

## Implementation and validation

1. Inspect the existing app and available assets; read [`shadcn_components.md`](./shadcn_components.md) before choosing components.
2. Implement the scoped prototype using the current stack and conventions. Keep UI state local and make every in-scope choice and control produce an appropriate UI response.
3. Validate the project with its existing focused build, type-check, lint, or tests. Check the initial role choice, each of the three mobile states, and canvas pan/zoom behavior at the target viewport.
4. Keep changes limited to this prototype. Report what was implemented and which validation commands passed or could not be run.
5. Some of the assets (if provided) are in ./assets/3d-images
6. Avoid using Emojis/common AI generated stuffs and copy exactly what the user sent.
