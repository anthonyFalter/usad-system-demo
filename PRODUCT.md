# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vanilla HTML, CSS, and JavaScript; no framework, component library, build tool, or external dependency.

## Users

- Daily commuters using Saraza TRD Transport Services Corp. mini buses who need confidence about vehicle locations, route matches, seat availability, and estimated arrival times.
- Saraza transport staff responsible for dispatch, fleet deployment, operations, and sales monitoring.

## Product Purpose

USAD is a researcher-led initiative intended to improve the commuter experience and operational process of Saraza TRD Transport Services Corp. It aims to reduce commuter uncertainty and unnecessary waiting, streamline boarding, and help transport staff make better-informed deployment and planning decisions.

## Positioning

USAD connects real-time commuter information with more structured transport operations, addressing both the passenger's uncertainty and Saraza's manual, reactive fleet-management process.

## Operating Context

Saraza currently dispatches vehicles ad hoc, with schedules and assignments decided unsystematically. Fleet deployment is reactive and depends on immediate vehicle functionality rather than structured preventative maintenance. Bus and driver details, time in route, and discounts are recorded on paper. Finance and sales monitoring are also manual and lack clear discrepancy reporting.

## Capabilities and Constraints

- Intended commuter capabilities include real-time mini bus locations, route matching, seat availability, estimated arrival times, advanced ticket purchasing, and seat reservation.
- Traffic-aware ETAs are intended to help management plan around congestion or delays.
- Passenger-demand visibility is intended to inform route and schedule adjustments.
- The initiative aims to support public utility vehicle modernization by improving the broader commuting experience as well as vehicle operations.
- The user-side prototype includes login and email validation, registration and verification states, a commuter home dashboard, an illustrative live-map screen, booking/ticket flows, scrollable Account Information settings, and searchable/category-filtered FAQs.
- The admin-side prototype includes the dark-themed, provisioned-account-only login and the Saraza TRD Operations & Dispatch console. It includes a pre-booking queue, staged-bus dispatch actions, vehicle telemetry and driver dialogs, an illustrative Bus Monitoring Map with selectable, moving sample buses, a parked terminal bus, and northbound/southbound routes, peak-hour readiness, illustrative remittances, Live Operations KPIs, and Reports with revenue and ridership trends, collection mix, fleet deployment, and fuel efficiency. Sample interactions and figures are not connected to live operations or services; fleet analytics model 20 buses.
- Fleet Management's Bus Assignment panel starts as a tall, narrow tab on the far right and expands leftward to its original panel proportions and content height. Its Seats Filled row supports up to 15 seats per bus: 13 passenger seats and two reserved employee seats (1A driver and 1B conductor). Staff can book a walk-in customer with a masked booking ID and timestamp, or release an occupied seat after confirming the customer has left. Booking details and counts are illustrative, session-only, and contain no passenger PII.
- The prototype currently represents one active route: Malolos to Trinoma via NLEX. Route selectors and route-specific sample content use the shared route data in `routes.js`; this does not represent live service data.

## Brand Commitments

- Product name: USAD.
- Prototype palette: green `#2FD9A8` and primary text `#2C2C2C`.
- Preferred typeface: SF Pro Display, with a system fallback.
- The supplied mobile login and error screens are the visual reference for this prototype.

## Evidence on Hand

- UI reference image is supplied in the request.
- Existing image assets are in `assets/3d-images/`.
- No live transit feed, GPS coordinates, authentication, booking service, payment processor, or operations dataset is provided for this UI-only prototype. The map, vehicle positions, availability, ETAs, registration/verification, booking, tickets, admin operational KPIs, and reports are illustrative interactions only; do not claim that services or data are live.

## Product Principles

- Reduce uncertainty for commuters with timely, relevant travel information.
- Support reliable boarding and informed trip planning.
- Help transport staff replace ad hoc, paper-based workflows with clearer operational visibility.
- Represent prototype interactions honestly; do not suggest that unconnected services are operational.
