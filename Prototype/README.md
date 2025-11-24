# ASAP HVAC - Digital Transformation Prototype

## Overview
This is a working static HTML/CSS/JS prototype demonstrating the proposed digital transformation solution for ASAP HVAC, a family-owned Houston HVAC business.

**⚠️ DEMO NOTICE:** This prototype uses placeholder data, mock payment processing, and simulated workflows. All company details, contact information, and license numbers are placeholders.

## Project Goals
- Demonstrate online quote request and estimation
- Simulate inspection-to-quote workflow
- Show invoice generation and payment processing
- Demonstrate maintenance plan enrollment
- Provide admin dashboard for business management

## Folder Structure
`
Prototype/
├── css/
│   └── styles.css          # Complete stylesheet with design tokens
├── js/
│   └── app.js              # Core JavaScript for data loading and rendering
├── data/
│   └── data.json           # Sample business data (services, quotes, invoices, etc.)
├── admin/
│   ├── dashboard.html      # Admin overview of quotes, appointments, invoices
│   └── inspection.html     # Finalize inspection findings and publish quotes
├── index.html              # Home page with hero and services preview
├── services.html           # Full services listing
├── about.html              # Company story and credentials
├── contact.html            # Contact form and service area info
├── quote.html              # Quote request form with estimation
├── schedule.html           # Appointment booking with cancellation policy
├── plans.html              # Maintenance plan tiers
├── quote-view.html         # Customer view of final quote with approval actions
├── invoice.html            # Invoice display and payment simulation
└── README.md               # This file
`

## Key Features Demonstrated

### Customer-Facing Pages
1. **Home (index.html)** - Hero section, services preview, testimonials
2. **Services (services.html)** - Complete service catalog with pricing ranges
3. **About (about.html)** - Company story, owner highlight, credentials
4. **Contact (contact.html)** - Contact form with service area and hours
5. **Quote Request (quote.html)** - Service request form with instant estimation
6. **Schedule (schedule.html)** - Appointment booking with 24-hour cancellation policy
7. **Quote View (quote-view.html)** - Final quote review with approve/reject/revise options
8. **Invoice (invoice.html)** - Payment processing with card/ACH/cash options
9. **Maintenance Plans (plans.html)** - Three-tier plan comparison

### Admin Pages
1. **Dashboard (admin/dashboard.html)** - Overview of quotes, appointments, invoices, maintenance members
2. **Inspection Finalization (admin/inspection.html)** - Add findings, adjust costs, publish final quote or generate service-fee invoice

## Data Model
The prototype uses a JSON-based data model (data.json) with the following structures:
- **services[]** - Service catalog with pricing ranges
- **maintenancePlans[]** - Three-tier maintenance offerings
- **quoteRequests[]** - Customer quote submissions (also stored in localStorage)
- **appointments[]** - Scheduled inspections
- **inspections[]** - Completed inspection records
- **finalQuotes[]** - Published quotes awaiting approval
- **partsOrders[]** - Parts procurement tracking
- **invoices[]** - Generated invoices and payment status
- **payments[]** - Payment transaction records
- **customers[]** - Customer information and maintenance plan enrollment
- **businessSettings** - Demo rules (cancellation policy, quote expiry, service fees)

## Critical Workflows Simulated

### 1. Service Call Request → Inspection → Quote
1. Customer fills out quote request form (quote.html)
2. System generates initial estimate and creates inspection request
3. Admin views request in dashboard
4. Admin finalizes inspection (admin/inspection.html) with findings and cost adjustments
5. System publishes final quote
6. Customer reviews quote (quote-view.html) and approves/rejects/requests revision
7. Upon approval, invoice is generated (invoice.html)

### 2. Service-Fee Invoice Path (Alternative to Quote)
1. After inspection, if only minor diagnostic work was done
2. Admin generates service-fee invoice ($79-$109) instead of full quote
3. Customer receives invoice and pays immediately

### 3. Parts Ordering & Installation
1. After quote approval, admin creates parts order (if needed)
2. System tracks parts ETA (5-7 business days)
3. Once parts arrive, installation is scheduled
4. After installation, final invoice is generated

## Testing Locally

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (optional but recommended for fetch API)

### Option 1: Simple File Opening
1. Navigate to the Prototype folder
2. Double-click index.html
3. Browse the site using the navigation menu

**Note:** Some features (JSON data loading) may not work correctly due to CORS restrictions when opening files directly.

### Option 2: Using Python HTTP Server (Recommended)
`powershell
cd "d:\Cybervision\CyberVision - Documents\Projects\ASAP HVAC\Prototype"
python -m http.server 8080
`
Then open: http://localhost:8080

### Option 3: Using Node.js http-server
`powershell
npm install -g http-server
cd "d:\Cybervision\CyberVision - Documents\Projects\ASAP HVAC\Prototype"
http-server -p 8080
`
Then open: http://localhost:8080

### Option 4: Using Visual Studio Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on index.html
3. Select "Open with Live Server"

## Testing Checklist
- [ ] Home page loads with hero section and services preview
- [ ] Navigation works across all pages
- [ ] Services page displays all services from JSON data
- [ ] Quote form submission shows estimation and confirmation
- [ ] Schedule page enforces minimum date (tomorrow) and shows cancellation policy
- [ ] Admin dashboard displays quote requests (including localStorage submissions)
- [ ] Admin inspection page allows adding findings/adjustments and publishing quotes
- [ ] Quote-view page shows final quote with approval actions
- [ ] Invoice page displays line items and payment method selection
- [ ] Maintenance plans page shows all three tiers with pricing
- [ ] Responsive design works at mobile breakpoints (768px)
- [ ] All demo badges are visible
- [ ] Footer displays on all pages

## Deployment to Azure

### Target Environment
- **Subscription:** 49dfbc34-601e-4476-bac0-7802a70209df
- **Resource Group:** rg-AsapHvac-01
- **App Service Plan:** asp-Cis-Linux-F1 (Free Tier)
- **Web App:** app-asapHvac

### Deployment Options

#### Option 1: Azure CLI Deployment
`powershell
# Login to Azure
az login

# Set subscription
az account set --subscription 49dfbc34-601e-4476-bac0-7802a70209df

# Deploy files (from Prototype folder)
az webapp up --name app-asapHvac --resource-group rg-AsapHvac-01 --html
`

#### Option 2: FTP Deployment
1. Get FTP credentials from Azure Portal:
   - Navigate to app-asapHvac
   - Deployment Center → FTPS credentials
2. Use FTP client (FileZilla, WinSCP) to upload all files from Prototype folder to /site/wwwroot/

#### Option 3: GitHub Actions (Future Enhancement)
1. Create GitHub repository for prototype
2. Set up GitHub Actions workflow
3. Configure Azure publish profile as repository secret
4. Automatic deployment on push to main branch

### Post-Deployment Verification
1. Visit: https://app-asapHvac.azurewebsites.net
2. Test navigation across all pages
3. Verify JSON data loads correctly
4. Test quote submission and localStorage persistence
5. Check responsive design on mobile devices
6. Confirm all demo badges are visible

## Design System

### Color Palette
- **Primary:** #0A4D8C (Deep blue - trust, professionalism)
- **Accent:** #FF7A00 (Vibrant orange - energy, urgency)
- **Neutral Light:** #F5F7FA (Backgrounds)
- **Neutral Dark:** #1E1E1E (Text)

### Typography
- **Headings:** Poppins (from Google Fonts)
- **Body:** Inter (from Google Fonts)

### Key Components
- Header with sticky navigation
- Hero section with gradient background
- Card grid system (auto-fit, minmax 300px)
- Form styles with 2px borders and focus states
- Button variants (primary, accent, outline)
- Alert boxes (success, warning, error)
- Demo badges (warning color)
- Responsive breakpoint: 768px

## Business Rules Demonstrated
- Quote expiry: 14 days from approval
- Cancellation window: 24 hours before appointment
- Cancellation fee: $50 (if within 24 hours)
- Service call fee range: $79-$109
- Scheduling hours: Mon-Sat 8am-6pm
- Premium maintenance members: 24/7 emergency availability
- Maintenance plan discounts: 10%-15% on service calls

## Known Limitations (Demo Only)
- No real payment processing (Stripe/Square integration in Phase 2)
- No email notifications (SendGrid/Azure Communication Services in Phase 2)
- No user authentication (Entra ID/Auth0 in Phase 2)
- No database persistence (Azure SQL in Phase 2)
- LocalStorage used for quote submissions (development only)
- No calendar integration for scheduling
- No real-time availability checking
- All company contact info is placeholder

## Phase 2 Roadmap
1. Migrate to Blazor Server (.NET 8)
2. Implement Azure SQL database
3. Add Entra ID authentication for admin
4. Integrate Stripe for payment processing
5. Add SendGrid for email notifications
6. Implement real calendar scheduling with technician assignment
7. Add customer portal with login
8. Build mobile app (MAUI)
9. Integrate with accounting system (QuickBooks API)
10. Add reporting and analytics dashboard

## Support & Questions
For questions about this prototype, contact:
- **Developer:** Paul Jackson, CyberVision Information Systems
- **Email:** paul@cybervisionis.com
- **Client:** Anthony Anderson, ASAP HVAC

## License & Copyright
© 2025 ASAP HVAC. All rights reserved.  
Developed by CyberVision Information Systems.

---

**Last Updated:** 2025-01-20  
**Version:** 1.0.0 (MVP Prototype)
