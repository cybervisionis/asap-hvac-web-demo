# ASAP HVAC – Draft Site Copy (Demo)

## 1. Home (Hero)
Headline: "Honest, Licensed HVAC Service – Fast Response Across Greater Houston"
Subheading: "18+ years keeping homes & businesses comfortable with fair pricing, quality work, and customer‑first care."
Primary CTA Buttons: [Request a Quote] [Schedule Inspection] [Join a Maintenance Plan]
Trust Badges (placeholder): Licensed • Insured • Family-Owned • References Available
Testimonial Teaser: "Same-day service – problem fixed!" – Layna P.

## 2. Services Overview (Summary Tiles)
- Repairs & Diagnostics – Fast troubleshooting; service call credited toward repair.
- New System Installations – Energy-efficient units sized correctly for your space.
- Duct Repair & Replacement – Solve airflow loss & efficiency issues.
- Seasonal Tune-Ups – Prevent breakdowns and keep performance high.
- Smart Thermostat Upgrades – Modern comfort & energy savings.
- Plumbing Assist (Drain/Condensate) – Integrated support when HVAC issues cross lines.

CTA (end of section): "Need something not listed? Request a custom quote."

## 3. Services (Detail Page Sections)
### Repairs & Diagnostics
Service Call: $79–$109 (applied if repair approved). Transparent findings; no upsell unless needed.
### Installations
Central AC (3–4 ton): Typical range $4,800–$8,200. Includes load sizing, equipment, and basic warranty outline.
### Ductwork
Minor repair: $250–$650. Full replacement (typical home): $2,800–$6,500.
### Tune-Ups
Seasonal performance & reliability check: $109–$149. Helps extend unit life & maintain efficiency.
### Smart Thermostats
Install & configuration: $249–$399 (device + setup).
### Plumbing Assist
Condensate & minor drain issues: $150–$350. Supports full resolution without scheduling a second vendor.

Disclaimer: "All pricing examples are approximate demo ranges; final quotes confirmed after inspection."

## 4. About Page
Story: "ASAP HVAC is a family-owned local company built on honesty, fair pricing, and quality workmanship. We don’t recommend replacements unless they’re truly needed."
Owner Highlight: Anthony Anderson – Certified HVAC Technician & Instructor.
Core Values: Integrity • Fair Pricing • Skilled Craftsmanship • Customer Respect • Faith-Guided Service.
Badge Section: Licensed (TACLA#####), Insured, 18+ Years in Service.
Testimonials (expanded):
> "Same-day service – problem fixed! Professional and fair." – Layna P.
> "Many years of dependable support – we really love you guys!" – Mattie A.

## 5. Contact Page
Service Area: Greater Houston Area.
Phone (placeholder): (281) 706-2148
Email (placeholder): paul@cybervisionis.com (Replace with official ASAP email at go-live.)
Hours: Mon–Sat 8:00 AM – 6:00 PM (After-hours emergency available; Premium plan no surcharge.)
Contact Form Fields: Name, Phone, Email, Address, Service Type (dropdown), Preferred Date/Time Window, Urgency (Normal/Emergency), Notes.
Map Placeholder: Greater Houston highlight region.
Secondary CTA: "Request an Online Quote".

## 6. Quote Request Flow (Simulation Copy)
Intro Text: "Tell us what you’re experiencing – we’ll send an initial estimate and schedule an inspection."
Fields: Name, Email, Phone, Address, Service Type, Unit Age (approx), Symptoms (multi-select), Urgency, Preferred Date, Notes.
Estimate Output (example): "Estimated range: $250–$480 (pending inspection)." + Button: [Schedule Inspection].
Follow-Up Message (demo): "We’ll confirm your inspection within 2 business hours."
Note: Submitting a quote request creates an inspection appointment request; ASAP will confirm and schedule the inspection (you will receive confirmation and reminder notices).

## 7. Scheduling (Simulation Copy)
Inspection Confirmation: "Inspection scheduled for [Date/Window]. Technician will call 30 minutes prior."
Cancellation policy: cancel online up to 24 hours before appointment to avoid a $50 cancellation fee. Late cancellations or no-shows may incur the fee; this is shown in confirmation and reminder notices.
Calendar Note: "Availability updated instantly."

## 8. Inspection Finalization
Technician Findings (example list): Low refrigerant level; Worn blower capacitor; Restricted airflow at return.
Outcome options (demo):
- Service-fee invoice generated & sent (diagnostic/visit fee). Customer can pay the service fee immediately (mock payment) or later.
- If additional work required, technician publishes a `Final Quote` with itemized parts & labor. Quote includes parts ETA and estimated parts cost where applicable.

Adjustment Summary: Parts & labor adjustments added → Final Quote Total.
Action Buttons: [Approve Quote] [Request Revision] [Ask a Question]

If customer approves and parts are required:
- Admin creates `partsOrder` (items, qty, est. cost, ETA). `partsOrder` status flows: `ordered` → `shipped` → `received`. ETA and cost estimates are visible to the customer in quote status updates.
- When parts `received`, installation appointment is scheduled and notices sent.

## 9. Invoice & Payment (Simulation)
Invoice Display: Itemized summary (Base Estimate + Adjustments). Status: Pending Payment.
Mock Payment Methods: Card (Stripe demo), ACH (placeholder), Cash/Check (mark as paid manually).
Receipt Text: "Payment received. A confirmation email and PDF invoice will be sent (simulation)."

## 10. Maintenance Plans
Pitch: "Prevent breakdowns & save on repairs with a maintenance plan."
Tier Summary:
- Basic: 2 tune-ups, priority scheduling, 5% parts discount.
- Plus: Adds condenser clean, duct check, 10% parts discount, next-day priority.
- Premium: Adds IAQ assessment, drain flush, 15% discount, no after-hours surcharge.
CTA Buttons: [Enroll – Basic] [Compare Plans] [Request Plan Call]

## 11. Admin Dashboard (Demo Copy)
Sections:
- New Quote Requests (status: Awaiting Scheduling)
- Scheduled Inspections (status: Upcoming)
- Finalized Quotes (status: Awaiting Approval)
- Invoices (Paid / Outstanding)
- Appointments Calendar (Day/Week view)
- Maintenance Plan Members (Renewal alerts)

Empty State Text Example: "No pending inspections – great time to review past jobs!"

## 12. Footer Copy
"© 2025 ASAP HVAC – Licensed & Insured. Demo site; pricing & details subject to confirmation."
Links: Privacy (placeholder), Terms (placeholder), Maintenance Plans, Contact.

## 13. Disclaimers & Legal (Demo)
- "Demo pricing ranges only; final pricing subject to on-site inspection."
- "Licensed HVAC Contractor – Texas (TACLA#####). Replace license number upon confirmation."
- "All invoice/payment simulations are non-binding and for demonstration purposes."

## 14. Placeholder Assets
Logo: Text-based placeholder ("ASAP HVAC")
Colors (draft palette):
- Primary: #0A4D8C (Trust Blue)
- Accent: #FF7A00 (Energy Orange)
- Neutral Light: #F5F7FA
- Neutral Dark: #1E1E1E
Font Suggestion: Headings – Poppins / Body – Inter (web-safe fallbacks applied).

---
Next: Implement static pages & JSON models; integrate quote → schedule → inspection → invoice demo flow.