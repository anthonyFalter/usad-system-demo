# USAD Prototype

USAD is a browser-based prototype for passenger travel planning and transport operations for Saraza TRD Transport Services Corp. It demonstrates passenger booking and ticket flows alongside an illustrative admin dispatch and fleet-management console.

> **Prototype only:** This project is a static front-end demo. Authentication, bookings, payments, vehicle locations, arrival times, availability, queue updates, and operational data are not connected to live services.

## Run locally

No package installation or build step is required.

1. Clone or download this repository.
2. Open `index.html` in a browser.

Alternatively, serve the project directory with Python:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Demo views

- **Passenger prototype:** Open the app normally. The passenger sign-in screen appears first; use **Auto-fill Demo Account** to populate the demo login.
- **Role selector:** Add `?role=select` to the URL to view the user/admin selector.
- **Admin prototype:** Add `?role=admin` to open the admin sign-in and operations console directly.

The role selector is not shown in the passenger-facing frame. Demo interactions and entered data are kept in the current page session only.

## Passenger features

- Light-themed commuter screens, home dashboard, and bottom navigation.
- Select an origin and downstream drop-off for illustrative Malolos–Trinoma trips in either direction, including intermediate stops at Bocaue, Marilao, and Balintawak.
- View the selected route segment and its stop markers on the schematic map.
- Browse illustrative ride options, choose a travel date and departure time, and complete a sample booking flow.
- View upcoming and past tickets, booking references, assigned sample bus, seat, fare, and booking details.
- Review a boarding-wait status on upcoming tickets. It advises passengers not to queue before their assigned bus arrives; it is sample-only and does not provide live alerts or queue positions.
- Track only the bus assigned to the selected upcoming ticket on the passenger live map. No bus is shown when there is no eligible ticket or bus assignment.

The route stops and map positions are examples, not official stop schedules or geographic coordinates.

## Admin prototype

The admin view demonstrates a provisioned-account sign-in and an illustrative operations console with fleet monitoring, dispatch, seat assignment, staff and driver information, peak-hour readiness, remittances, and reports. All records, vehicle states, and metrics are sample data.

## Project files

| File or directory | Purpose |
| --- | --- |
| `index.html` | Prototype shell and page metadata |
| `styles.css` | Passenger and admin interface styles |
| `app.js` | Screen rendering, interactions, and illustrative app data |
| `routes.js` | Shared sample route and stop definitions |
| `assets/` | Prototype image assets |
| `PRODUCT.md` | Product context, capabilities, and prototype constraints |

## Development notes

- The app uses vanilla HTML, CSS, and JavaScript; there is no framework, package manager, or build system configured.
- The scripts load directly from `index.html`.
- There is no automated test suite configured. A basic JavaScript syntax check can be run with:

```powershell
node --check app.js
node --check routes.js
```
