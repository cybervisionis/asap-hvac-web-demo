# ASAP HVAC Digital Transformation & Prototype Proposal

## 1. Executive Summary
ASAP A/C & Maintenance ("ASAP HVAC") has operated 18+ years on reputation and word‑of‑mouth. The absence of a website or automated workflows slows quote turnaround, scheduling, invoicing, and customer follow‑up. This proposal outlines a rapid, low-friction MVP plus forward roadmap to modernize customer intake, quote → job → invoice workflow, scheduling, and maintenance plan management, while laying a scalable foundation for future CRM and branding.

## 2. Objectives
| Goal | Outcome | Metric (Target) |
|------|---------|-----------------|
| Faster quote response | Online intake + structured inspection finalize | < 4 business hrs avg turnaround |
| Reduce admin time | Automate quote → invoice + payment receipt | 10–15 hrs/mo saved |
| Increase lead conversion | Professional multi-page site + clear CTAs | ≥ 25% quote request → inspection rate |
| Improve cash flow visibility | Simulated payment + invoice tracking | 100% invoices logged in dashboard |

## 3. Current Challenges
- No website; discovery limited to ad‑hoc social posts.
- Manual paperwork for quotes/invoices increases cycle time.
- No centralized customer/job data (harder follow-up & history review).
- Limited differentiation messaging despite strong trust and testimonials.

## 4. Proposed MVP Solution (Phase 1)
Multi-page responsive prototype deployed to existing Azure Web App (`app-asapHvac`):
1. Home (hero value proposition + testimonial snippet + primary CTAs).
2. Services (repairs, installations, ductwork, maintenance, plumbing support).
3. About (owner story, longevity, trust values, licensing/insurance highlight).
4. Contact (simple form + service area + phone/email + working hours).
5. Quote Request Simulation (form collects key job factors → preliminary estimate).
6. Scheduling Simulation (request preferred date/time → slot assignment in JSON calendar; sets inspection appointment).
7. Inspection Finalization Simulation (admin enters inspection data → generates finalized quote with adjustments & optional upsell items).
8. Invoice & Payment Simulation (convert approved quote → invoice; mock payment flow; produce demo receipt PDF).
9. Maintenance Plan Enrollment Simulation (choose plan tier; generates enrollment record for future recurring service reminders).
10. Admin Dashboard (lists: new quote requests, upcoming inspections, finalized quotes awaiting approval, invoices, scheduled appointments, maintenance plans).

All data persisted in JSON objects (client-side or lightweight static assets) to illustrate structure without backend complexity.

### Operational Flow (revised)
1. Customer requests service (online or by phone) → `quoteRequest` created (status `requested`).
2. ASAP confirms & schedules inspection → `appointment` created (status `scheduled`). Confirmation + cancellation policy sent; reminders before appointment.
3. Onsite inspection performed by technician:
	- 3a. Service/diagnostic fee invoice generated & sent (status `service-fee-invoiced`).
	- 3b. If additional work required, inspector publishes a `finalQuote` (status `quoted-awaiting-approval`).
4. Customer reviews quote → approves / rejects / requests revision. (Quote status transitions accordingly.)
5. If approved, ASAP either: a) closes the job (minor work) or b) finalizes quote and triggers `partsOrder` if parts are required.
6. `partsOrder` tracks parts (status: `ordered` → `shipped` → `received`) and includes ETA and cost estimate; once received an installation appointment is scheduled.
7. Installation performed; appointment marked `completed`.
8. Invoice is generated (linked to `finalQuoteId` and `appointmentId`).
9. Payment recorded (demo: mock Stripe flow); invoice marked `paid`; receipt sent.

### Demo Business Rules & Defaults
- Quote expiration: 14 days from issue (`quoteExpiryDays = 14`).
- Cancellation window: 24 hours prior to scheduled appointment (`cancellationWindowHours = 24`).
- Cancellation fee (demo): $50 if canceled within `cancellationWindowHours` or for no-shows. Displayed in scheduling UI and confirmation messages.
- Service/diagnostic fee demo: $79–$109, invoiced at inspection completion if applicable.
- Notifications are simulated (email/SMS placeholders); real implementation would use SendGrid/Twilio.

## 5. Additional Simulations (Optional Add-ins for Demo)
| Simulation | Purpose | Future Real Implementation |
|------------|---------|---------------------------|
| Automated email confirmations | Show lifecycle message after quote request | SMTP / SendGrid integration |
| Follow-up reminder scheduling | Illustrate preventive maintenance cadence | Azure Functions + Schedule store |
| Part availability note | Demo placeholder when special-order parts needed | Inventory micro-module |
| Warranty tracker | Show warranty status on equipment | DB warranty table + expirations |
| Upsell bundle (duct + maintenance) | Illustrate service bundling lift | Pricing engine + A/B tests |

## 6. Phase 2 (Post-MVP Roadmap)
- Real persistence layer (Azure SQL) + structured tables (Customers, Quotes, Inspections, Invoices, Payments, Appointments, Plans).
- Authenticated admin portal (role-based access, technician vs admin).
- Payment gateway integration (Stripe test → live) with automatic receipt emailing.
- CRM enrichment (job notes, follow-ups, repeat visit tracking).
- Reporting dashboards (quote cycle time, revenue by service type, conversion funnel).
- Brand identity package (logo, palette, typography guidelines) applied site-wide.
- Mobile-friendly field technician interface (inspection capture on phone/tablet).

## 7. Architecture (Demo Prototype)
| Layer | Tech | Notes |
|-------|------|-------|
| Hosting | Azure App Service (Linux F1) | Existing resource; no added cost at free tier |
| Frontend | Static HTML/CSS/JS | Fast to deploy; easy asset replacement |
| Data (simulated) | JSON models (in `/data`) | Mirrors future DB schemas |
| Observability (future) | Azure App Insights | Add in Phase 2 for telemetry |
| Security (future) | Entra ID (Azure AD) | Role-based admin access |
| Payments (future) | Stripe or PayPal | Mock only in MVP |
| Email (future) | SendGrid | Template-driven notifications |

## 8. Data Model (Prototype JSON Schemas)
```
service: { id, name, category, basePriceRange, description }
quoteRequest: { id, customerName, contactPhone, email, address, serviceType, urgency, requestedDate, notes, status }
inspection: { id, quoteRequestId, technician, findings: [ { code, description, severity } ], adjustments: [ { description, cost } ], recommendedServices: [] }
finalQuote: { id, quoteRequestId, baseEstimate, adjustmentsTotal, finalTotal, expiresOn, status }
invoice: { id, finalQuoteId, amountDue, createdOn, dueDate, paid: bool, paymentRef }
payment: { id, invoiceId, method, amount, date, confirmationCode }
appointment: { id, quoteRequestId|finalQuoteId, scheduledDate, window, technician, status }
maintenancePlan: { id, customerId, planTier, startDate, renewalDate, includedServices: [], status }
partsOrder: { id, finalQuoteId|quoteRequestId, items: [ { partId, description, qty, costEach } ], totalCost, status: "ordered|shipped|received", etaDate }
```

Suggested `status` values used in the demo (examples):
- `quoteRequest.status`: `requested`, `scheduled`, `inspected`, `service-fee-invoiced`, `quoted-awaiting-approval`, `quote-approved`, `quote-rejected`, `parts-ordered`, `installation-scheduled`, `completed`, `invoiced`, `paid`.


### Placeholder Service Categories & Pricing Anchors (Industry Approx. – Houston Area)
| Service | Typical Range | Notes |
|---------|---------------|-------|
| Diagnostic / Service Call | $79 – $109 | Applied to repair if approved |
| Seasonal Tune-Up | $109 – $149 | Includes coil clean & performance check |
| New Central AC Install (3–4 ton) | $4,800 – $8,200 | Variation by SEER2 rating & brand |
| Duct Repair (minor) | $250 – $650 | Per section; severity-based |
| Full Duct Replacement (per home) | $2,800 – $6,500 | Depends on footage & material |
| Thermostat Upgrade (smart) | $249 – $399 | Device + install |
| Plumbing Assist (condensate / minor drain) | $150 – $350 | If plumber add-on needed |

### Maintenance Plan Tiers (Demo)
| Tier | Annual Fee (Demo) | Included | Discounts | Extras |
|------|------------------|----------|-----------|--------|
| Basic | $169 | 2 tune-ups, priority scheduling | 5% parts | Service reminders |
| Plus | $249 | Basic + condenser clean, light duct check | 10% parts | Next-day priority |
| Premium | $379 | Plus + IAQ assessment, drain line flush | 15% parts | No after-hours surcharge |

### Scheduling Window (Placeholder)
Mon–Sat 8:00 AM – 6:00 PM (Emergency after-hours on request; surcharge applies outside plan tiers unless Premium).

### License & Insurance Statement (Placeholder)
"Licensed HVAC Contractor – Texas (TACLA#####). Fully insured (general liability & worker coverage)."

### Payment Processor (Future Integration)
Recommended: Stripe (modern API, supports later expansion to maintenance plan auto-renewals). PayPal optional as secondary.

## 9. Success Metrics (Initial Targets)
| Metric | Definition | Target after go-live (first 60–90 days) |
|--------|------------|-----------------------------------------|
| Quote turnaround | Time from request submission → initial estimate | < 4 business hrs avg |
| Conversion rate | Quote requests that proceed to inspection | ≥ 25% |
| Admin hours saved | Manual time replaced by automation | 10–15 hrs/mo |
| Payment cycle time | Approved quote → recorded payment | < 2 business days |

## 10. Pricing Framework (Illustrative – Final after Scope Review)
| Tier | Focus | Est. Range | Includes |
|------|-------|-----------|----------|
| Starter MVP | Public site + quote workflow + invoice mock | $X–Y | Pages (Home/Services/About/Contact), quote request, admin list, simulated invoice |
| Core Automation | Adds scheduling & maintenance plan + basic dashboard | $Y–Z | Starter + scheduling + plan enrollment + enhanced admin views |
| Growth & CRM | Real DB + auth + payments + reporting | Custom | Core + Azure SQL + auth + live payments + dashboards + App Insights |

Assumes phased deployment to reduce risk and cost while demonstrating tangible value early.

## 11. Timeline (Indicative)
| Phase | Duration | Key Outputs |
|-------|----------|-------------|
| Discovery & Content | 3–5 days | Finalized copy, confirm service list & pricing model inputs |
| MVP Prototype Build | 5–7 days | Deployed multi-page demo + simulations |
| Review & Adjust | 2–3 days | Feedback incorporated; finalize scope & SOW |
| Phase 2 Planning | Post-approval | Detailed backlog & architecture for automation & DB |

## 12. Assumptions
- Anthony will provide or approve baseline service categories & any pricing anchor points.
- No proprietary ERP integration required in MVP phase.
- Placeholder branding acceptable until logo assets delivered.
- Payment processing starts in test-mode only (no live transactions).

## 13. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Incomplete pricing data | Slows quote accuracy | Use adjustable pricing factors + capture ranges |
| Scope creep during demo | Delays MVP delivery | Strict Phase 1 checklist; backlog extras |
| Asset delays (logo/photos) | Visual polish limited | Use clear placeholders & callout replaceable assets |
| Manual follow-ups persist | Reduced automation gains | Introduce templated reminders in Phase 2 quickly |

## 14. Next Steps
1. Confirm service list + any baseline pricing heuristics (e.g., tune-up, install, duct replacement).  
2. Approve data model placeholders.  
3. Build & deploy prototype → schedule live walkthrough.  
4. Collect feedback → finalize SOW & contract terms.  
5. Execute Phase 1, measure early metrics, plan Phase 2 enhancements.

## 15. Requested Inputs (Open Items)
If any placeholder should change, provide updates for:
- Precise license number for HVAC (to replace TACLA#####).
- Adjusted pricing anchors or add service types (e.g., heat pump, indoor air quality add-ons).
- Final maintenance plan fee structure (if different from demo).
- Any exclusions or warranty statements to display.

---
_Draft prepared: Placeholder pricing ranges & certain values intentionally left as variables pending discovery. This markdown can convert to PDF for presentation._