# ASAP HVAC Sample API Backend

This folder houses a lightweight Express API that powers the ASAP HVAC demo experience. The service reads and writes to JSON files today and is structured so it can graduate to SQLite or SQL Server with minimal refactoring.

## Quick Start

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:4000` with interactive documentation at `http://localhost:4000/docs`.

## Prerequisites
- Node.js 20 or later
- npm 9 or later

## Installation
```bash
cd backend
npm install
```

## Available Scripts
- `npm run dev` – start the API in watch mode via `ts-node-dev`
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – build and execute the compiled JavaScript
- `npm run lint` – run ESLint across the `src/` directory

## Running the API
```bash
npm run dev
```
The service listens on `http://localhost:4000` by default (override with the `PORT` environment variable).

### Health Check
- `GET /healthz`

### API Routes (v0.2)
All routes are namespaced under `/api`.

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/customers` | Paginated list of customers |
| GET | `/api/customers/{id}` | Retrieve a single customer |
| POST | `/api/customers` | Create a new customer |
| PUT/PATCH | `/api/customers/{id}` | Update customer fields |
| DELETE | `/api/customers/{id}` | Remove a customer |
| GET | `/api/service-offerings` | Paginated list of service offerings |
| CRUD | `/api/service-offerings/{id}` | Manage service offerings |
| GET | `/api/maintenance-plans` | Paginated list of maintenance plans |
| CRUD | `/api/maintenance-plans/{id}` | Manage maintenance plans |
| GET | `/api/quote-requests` | Paginated list of quote requests |
| CRUD | `/api/quote-requests/{id}` | Manage quote requests |
| GET | `/api/appointments` | Paginated list of appointments |
| CRUD | `/api/appointments/{id}` | Manage appointments |
| GET | `/api/inspections` | Paginated list of inspections |
| CRUD | `/api/inspections/{id}` | Manage inspections |
| GET | `/api/final-quotes` | Paginated list of final quotes |
| CRUD | `/api/final-quotes/{id}` | Manage final quotes |
| GET | `/api/invoices` | Paginated list of invoices |
| CRUD | `/api/invoices/{id}` | Manage invoices |
| GET | `/api/payments` | Paginated list of payments |
| CRUD | `/api/payments/{id}` | Manage payments |
| GET | `/api/parts-orders` | Paginated list of parts orders |
| CRUD | `/api/parts-orders/{id}` | Manage parts orders |

### API Documentation
- Swagger UI is served at `http://localhost:4000/docs`.
- The underlying spec is maintained in `swagger/swagger.yaml` to keep documentation versioned with code.

## Sample Payloads
Use these examples to sanity-check requests and responses. Values align with the seeded JSON store bundled in `data/data-store.json`.

### Customers
**Request:**
```json
{
	"name": "Casey Lee",
	"primaryAddress": "789 Market St, Houston, TX",
	"email": "casey@example.com",
	"phone": "281-555-0145",
	"planTier": "Plus"
}
```

**Response:**
```json
{
	"id": "cust-001",
	"name": "Jane Smith",
	"primaryAddress": "123 Houston Ave, Houston, TX",
	"email": "jane@example.com",
	"phone": "281-555-0110",
	"planTier": "Premium"
}
```

### Service Offerings
```json
{
	"id": "svc-diagnostic",
	"name": "Diagnostic / Service Call",
	"category": "repair",
	"basePriceRange": "$79-$109",
	"description": "On-site troubleshooting; fee applied to approved repair."
}
```

### Maintenance Plans
```json
{
	"id": "plan-plus",
	"planTier": "Plus",
	"annualFee": 249,
	"includedServices": [
		"2 tune-ups",
		"Condenser clean",
		"Light duct check"
	],
	"partsDiscountPct": 10,
	"extras": [
		"Next-day priority"
	]
}
```

### Quote Requests
**Request:**
```json
{
	"customerName": "Alex Johnson",
	"contactPhone": "281-555-0200",
	"email": "alex@example.com",
	"address": "2200 Loop N, Houston, TX",
	"serviceType": "repair",
	"urgency": "high",
	"requestedDate": "2025-12-01",
	"symptoms": ["No cooling"],
	"notes": "Unit freezes overnight"
}
```

**Response:**
```json
{
	"id": "qr-1001",
	"customerName": "Jane Smith",
	"contactPhone": "281-555-0110",
	"email": "jane@example.com",
	"address": "123 Houston Ave, Houston, TX",
	"serviceType": "repair",
	"urgency": "normal",
	"requestedDate": "2025-11-26",
	"unitAgeYears": 8,
	"symptoms": [
		"No cooling",
		"High energy bill"
	],
	"notes": "System struggles afternoons.",
	"status": "awaiting-scheduling"
}
```

### Appointments
```json
{
	"id": "appt-5001",
	"quoteRequestId": "qr-1001",
	"scheduledDate": "2025-11-27",
	"window": "9am-11am",
	"technician": "Anthony Anderson",
	"status": "scheduled"
}
```

### Inspections
```json
{
	"id": "insp-7001",
	"quoteRequestId": "qr-1001",
	"technician": "Anthony Anderson",
	"findings": [
		{
			"code": "low-refrigerant",
			"description": "Low refrigerant level",
			"severity": "moderate"
		},
		{
			"code": "cap-worn",
			"description": "Worn blower capacitor",
			"severity": "high"
		}
	],
	"adjustments": [
		{
			"description": "Recharge refrigerant",
			"cost": 180
		},
		{
			"description": "Replace capacitor",
			"cost": 120
		}
	],
	"recommendedServices": ["Seasonal tune-up"]
}
```

### Final Quotes
```json
{
	"id": "fq-9001",
	"quoteRequestId": "qr-1001",
	"baseEstimate": 250,
	"adjustmentsTotal": 300,
	"finalTotal": 550,
	"expiresOn": "2025-12-05",
	"status": "awaiting-approval"
}
```

### Invoices
```json
{
	"id": "inv-3001",
	"finalQuoteId": "fq-9001",
	"amountDue": 550,
	"createdOn": "2025-11-24",
	"dueDate": "2025-12-04",
	"paid": false,
	"paymentRef": null
}
```

### Payments
```json
{
	"id": "pay-4001",
	"invoiceId": "inv-3001",
	"amount": 550,
	"paidOn": "2025-11-28",
	"method": "credit-card",
	"reference": "CH_123456",
	"notes": "Charged via virtual terminal"
}
```

### Parts Orders
```json
{
	"id": "po-8001",
	"finalQuoteId": "fq-9001",
	"items": [
		{
			"partId": "prt-01",
			"description": "Blower Capacitor",
			"qty": 1,
			"costEach": 85
		},
		{
			"partId": "prt-02",
			"description": "Refrigerant (R-410A) recharge kit",
			"qty": 1,
			"costEach": 120
		}
	],
	"totalCost": 205,
	"status": "ordered",
	"etaDate": "2025-11-30",
	"notes": "Standard shipping; tech to confirm install window when received."
}
```

## Data Store
- Seed data lives in `data/data-store.json` (mirrors `/Docs/data_models_sample.json`).
- The `src/data/store.ts` helper centralizes read/write logic and keeps mutation isolated for future database adapters.

## Project Structure
```
backend/
├── src/
│   ├── app.ts
│   ├── data/
│   │   └── store.ts
│   ├── middleware/
│   │   └── error-handlers.ts
│   ├── models/
│   │   └── customer.ts
│   ├── routes/
│   │   ├── customers.ts
│   │   └── index.ts
│   ├── services/
│   │   └── customer-service.ts
│   ├── swagger/
│   │   └── swagger.ts
│   ├── types/
│   │   └── domain.ts
│   └── utils/
│       └── errors.ts
├── data/
│   └── data-store.json
├── swagger/
│   └── swagger.yaml
└── dist/ (build output)
```

## Roadmap for Database Migration
1. Replace `data/store.js` with a repository layer that targets SQLite/SQL Server.
2. Introduce Prisma or Knex to handle migrations and schema management.
3. Add integration tests that validate the service against both the JSON store and the SQL engine.
4. Layer in authentication/authorization once the front-end user journeys are finalized.

## Next Steps & Enhancements
- Extend service coverage to additional entities (quote requests, appointments, final quotes, etc.).
- Add request logging (e.g., Morgan) and structured logging for production.
- Containerize the backend for consistent deployment.
- Integrate with the front-end prototype and create shared TypeScript types if adopting a JS/TS stack end-to-end.
