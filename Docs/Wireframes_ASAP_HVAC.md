# ASAP HVAC – Lightweight Wireframe Notes (Demo)

Purpose: Provide clear, build-ready notes outlining page structure, key components, responsive behavior, and the end-to-end demo flows using the JSON data already drafted.

## Sitemap
- Home (`/`) 
- Services (`/services`)
- About (`/about`)
- Contact (`/contact`)
- Quote Request (`/quote`)
- Schedule Inspection (post-quote) (`/schedule`)
- Inspection Finalization (admin demo) (`/admin/inspection/[id]`)
- Final Quote (customer view) (`/quote/[id]`)
- Invoice & Payment (demo) (`/invoice/[id]`)
- Maintenance Plans (`/plans`)
- Admin Dashboard (`/admin`)

## Global Template
- Header: Logo (text placeholder "ASAP HVAC"), Nav (Home, Services, About, Contact, Plans), Primary CTA button [Request a Quote]
- Footer: Short legal, license/insurance line, links to Privacy/Terms/Contact

## Style Tokens (draft)
- Colors: Primary #0A4D8C, Accent #FF7A00, Neutral Light #F5F7FA, Neutral Dark #1E1E1E
- Type: Headings Poppins (fallbacks), Body Inter (fallbacks)
- Buttons: Solid primary, outline neutral; Hover: darken 6–8%
- Spacing: 8px base unit; container max-width 1200px; section padding 64px desktop / 32px mobile

## Responsive
- Mobile-first; breakpoints: 0–639, 640–1023, 1024+
- Collapse nav to hamburger at < 1024; hero stacks text over illustration; tables convert to cards

---

## Page Wireframes

### 1) Home
```
[Header]
[Hero]
  [H1] Honest, Licensed HVAC Service — Greater Houston
  [Sub] 18+ years… fair pricing… customer-first
  [CTA Primary] Request a Quote   [CTA Secondary] Schedule Inspection
  [Badge Row] Licensed • Insured • Family-Owned • References
[Services Teaser 3-up]
[Testimonials Carousel (2 quotes)]
[CTA Band] "Need help fast?" [Call Now] [Request Online Quote]
[Footer]
```

### 2) Services
```
[Header]
[Title] Services
[Grid 2x3]
  Card: Repairs & Diagnostics ($79–$109 service call)
  Card: Installations (3–4 ton $4.8k–$8.2k)
  Card: Duct Repair & Replacement
  Card: Seasonal Tune-Ups ($109–$149)
  Card: Smart Thermostat Upgrades
  Card: Plumbing Assist
[CTA Band] Not listed? [Request Custom Quote]
[Footer]
```

### 3) About
```
[Header]
[Title] About ASAP HVAC
[Two Column]
  Left: Owner story (Anthony Anderson), values, 18+ years
  Right: License/Insurance badges (placeholder), testimonial highlights
[Footer]
```

### 4) Contact
```
[Header]
[Title] Contact Us
[Two Column]
  Left: Contact form (Name, Phone, Email, Address, Service Type, Preferred Date/Window, Urgency, Notes)
  Right: Service Area map (Greater Houston), Hours (Mon–Sat 8–6), Phone & Email
[Footer]
```

### 5) Quote Request
```
[Header]
[Title] Request an Online Quote
[Form]
  Name, Email, Phone, Address, Service Type (dropdown)
  Unit Age (approx), Symptoms (multi-select chips), Urgency
  Preferred Date (for inspection), Notes
[On Submit]
  Show Estimated Range card (based on service anchors)
  [CTA] Schedule Inspection  [Link] Edit Details
[Footer]
```

### 6) Schedule Inspection (after quote)
```
[Header]
[Title] Schedule Your Inspection
[Calendar/Slots]
  Select Date  | Select Window (9–11, 12–2, 2–4)
  Technician (pre-filled/auto-assign)
[Confirmation]
  "Inspection scheduled for [Date/Window]. Tech will call 30 minutes prior."
  Cancellation policy: cancel online up to 24 hours before appointment to avoid a $50 cancellation fee. Late cancellations or no-shows may incur the fee.
[Footer]
```

### 7) Inspection Finalization (Admin Demo)
```
[Header - Admin]
[Title] Inspection for Quote #[id]
[Layout]
  Left Panel: Findings (add rows: code, description, severity)
             Adjustments (description, cost)
             Recommended services (chips)
  Right Panel: Summary
    Base Estimate (from quote)
    Adjustments Total
    Final Total
    [Button] Publish Final Quote
[Footer]
```

### 8) Final Quote (Customer View)
```
[Header]
[Title] Your Final Quote #[id]
[Summary]
  Base Estimate, Adjustments (itemized), Final Total, Expiration
[Actions]
  [Approve & Generate Invoice] [Request Revision] [Ask a Question]
[Footer]
```

### 9) Invoice & Payment (Demo)
```
[Header]
[Title] Invoice #[id]
[Items Table]
  Line items: Base + Adjustments → Total Due
[Payment Methods]
  Card (Stripe demo), ACH placeholder, Cash/Check (mark paid)
[On Pay]
  Show Receipt (confirmation code) and Download PDF (demo)
[Footer]
```

### 10) Maintenance Plans
```
[Header]
[Title] Maintenance Plans
[Tier Cards]
  Basic ($169) – 2 tune-ups, 5% parts, priority
  Plus ($249) – +condenser clean, duct check, 10%, next-day priority
  Premium ($379) – +IAQ assessment, drain flush, 15%, no after-hours surcharge
[CTA] Enroll / Compare Plans / Request Plan Call
[Footer]
```

### 11) Admin Dashboard
```
[Header - Admin]
[Title] Admin Dashboard
[Sections]
  New Quote Requests (table/list) → actions: Schedule | View
  Scheduled Inspections (list/calendar)
  Finalized Quotes (awaiting approval)
  Invoices (paid/outstanding)
  Maintenance Plan Members (renewal alerts)
[Footer]
```

---

## Critical Flows (Happy Paths)
1) Service Call Request → Schedule → Inspect → Quote (or Service-Fee Invoice) → Quote Approval → Parts Order → Installation → Invoice → Payment
- Customer submits service request (`/quote` or phone) → `quoteRequest` created (status `requested`).
- ASAP schedules inspection → appointment created (`/schedule`) with cancellation policy and reminders.
- Technician performs inspection at `/admin/inspection/[id]`:
  - Either generate service-fee invoice (`service-fee-invoiced`) OR publish `finalQuote` (`quoted-awaiting-approval`).
  - If parts required, admin creates `partsOrder` with ETA and cost estimate; quote updated with parts cost.
- Customer reviews `/quote/[id]` → Approve (status `quote-approved`) or request revision.
- If `partsOrder` required: parts progress `ordered` → `shipped` → `received`; once `received`, schedule installation appointment.
- Installation appointment completed → generate invoice linked to `finalQuoteId` / `appointmentId` → payment (mock) → show receipt and mark invoice `paid`.

2) Maintenance Plan Enrollment
- `/plans` → select tier → confirmation card (demo record created)

---

## Component Inventory
- Header/Nav, Footer
- Card: Service, Testimonial, CTA band
- Form: Quote Request (validated), Contact, Schedule Slots
- Table/List: Admin queue tables (responsive → cards on mobile)
- Summary Panels: Quote Summary, Invoice Summary
- Toasts/Banners: Success/failure notifications

---

## Data Mapping (to `data_models_sample.json`)
- Services grid → `services[]`
- Quote Request form → creates `quoteRequests[]` item
- Scheduling → creates/updates `appointments[]`
- Inspection admin → writes `inspections[]`, updates `finalQuotes[]`
- Approve quote → creates `invoices[]`
- Pay (mock) → appends to `payments[]` and toggles invoice `paid`

---

## Accessibility & UX Notes
- Color contrast ≥ 4.5:1; focus states visible; labels linked to inputs
- Form validation inline; error summary at top on submit
- Keyboard-accessible menus and modals; skip-to-content link
- Mobile: larger touch targets (min 44px)

---

## Legal & Disclaimers (Demo)
- Pricing is illustrative; final after on-site inspection
- Licensed HVAC Contractor – Texas (TACLA##### placeholder)
- Payment simulation only; no real charges

---

## Build Checklist (for the prototype)
- [ ] Create pages per sitemap with consistent header/footer
- [ ] Load `data_models_sample.json` and render services/plans
- [ ] Implement Quote form → Estimated range card
- [ ] Implement Scheduling UI → create appointment record
- [ ] Admin Inspection page → findings/adjustments → final quote
- [ ] Final Quote view → Approve → create invoice
- [ ] Invoice page → mock payment → receipt
- [ ] Admin Dashboard lists map to JSON collections
- [ ] Mobile/responsive pass
- [ ] Add clear “Demo Only” labels where applicable