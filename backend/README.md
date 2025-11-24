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
- `npm run dev` – start the API in watch mode with Nodemon
- `npm start` – start the API without file watching
- `npm run lint` – run ESLint using the Standard style guide

## Running the API
```bash
npm run dev
```
The service listens on `http://localhost:4000` by default (override with the `PORT` environment variable).

### Health Check
- `GET /healthz`

### API Routes (v0.1)
All routes are namespaced under `/api`.

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/{id}` | Retrieve a single customer |
| POST | `/api/customers` | Create a new customer |
| PUT | `/api/customers/{id}` | Replace a customer |
| PATCH | `/api/customers/{id}` | Partially update a customer |
| DELETE | `/api/customers/{id}` | Remove a customer |

### API Documentation
- Swagger UI is served at `http://localhost:4000/docs`.
- The underlying spec is maintained in `swagger/swagger.yaml` to keep documentation versioned with code.

## Data Store
- Seed data lives in `data/data-store.json` (mirrors `/Docs/data_models_sample.json`).
- The `data/store.js` helper centralizes read/write logic and keeps mutation isolated for future database adapters.

## Project Structure
```
backend/
├── app.js
├── data/
│   ├── data-store.json
│   └── store.js
├── middleware/
│   └── error-handlers.js
├── models/
│   └── customer.js
├── routes/
│   ├── customers.js
│   └── index.js
├── services/
│   └── customer-service.js
├── swagger/
│   ├── swagger.js
│   └── swagger.yaml
└── utils/
    └── errors.js
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
