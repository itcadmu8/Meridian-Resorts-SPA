# Meridian Resorts & Spa

Meridian Resorts & Spa is Team 2's multi-property hospitality operations project.
It supports six resort properties and will provide a unified guest experience
alongside a staff operations console for arrivals, spa activity, and food and
beverage operations.

The project uses React with JavaScript and JSX on the frontend, and FastAPI on the
backend. PostgreSQL stores transactional hotel data and MongoDB stores
semi-structured guest preference documents.

## Current project status

The shared core is available and ready for team development. It includes Docker
services, seeded six-property data, baseline reservation APIs, and a React/Vite
frontend shell.

The following Team 2 features are planned for implementation:

- Staff authentication and protected operations pages.
- Cross-property arrivals, spa, F&B, and dashboard workflows.
- Spa appointments, multi-property inventory, and upsell offers.
- Guest-facing RAG assistant grounded in approved spa and dining documents.
- Spa booking agent with an explicit guest confirmation gate.
- UiPath nightly F&B covers versus expected occupancy reconciliation.
- CI/CD, monitoring, AWS EC2, and Azure App Service deployment.

## Architecture

```text
React + Vite frontend
        |
        v
FastAPI REST API (/api/v1)
        |
        +-- PostgreSQL: guests, properties, reservations, rate plans, folios, orders
        +-- MongoDB: guest preference documents
        +-- Meridian knowledge base: approved spa, dining, and hours documents
```

The dashboard must derive cross-property activity from operational data. It must
not introduce a duplicate dashboard transaction table.

## Repository layout

```text
backend/                    FastAPI application, database models, routers, and tests
frontend/                   React + Vite application written in JavaScript and JSX
meridian_knowledge/         Property spa, dining, hours, and overview source documents
automation/uipath/          F&B reconciliation workflow assets and notes
.env.example                Environment template
```

## Prerequisites

- Node.js 22+ and npm for frontend development
- Python 3.12+ and [uv](https://docs.astral.sh/uv/) (or `pip`) for backend development
- PostgreSQL and MongoDB instances (local services or cloud URIs)

## Clone and start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/itcadmu8/Meridian-Resorts-SPA.git
   cd Meridian-Resorts-SPA
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

3. **Start the Backend:**

   ```bash
   cd backend
   uv sync --group dev
   uv run uvicorn app.main:app --reload --port 8000
   ```

4. **Start the Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open local services:**

   - Frontend: <http://localhost:5173>
   - API documentation: <http://localhost:8000/docs>
   - Health check: <http://localhost:8000/health>


## Seed data

On its first startup, the backend creates tables and seeds six Meridian Resorts
& Spa properties with representative guests, reservations, folios, F&B orders,
and guest preference documents. Seeding is idempotent and controlled by
`SEED_ON_STARTUP`.

To run the seed command in the backend container:

```bash
make seed
```

The command seeds only an empty database. To start from scratch, stop the stack
and explicitly remove volumes before starting it again.

## Development commands

### Backend

The backend uses `uv` and has an in-memory SQLite/fake MongoDB test setup, so
backend tests do not need Docker services running.

```bash
make test
make lint
```

Equivalent commands from `backend/`:

```bash
uv sync --group dev
uv run pytest
uv run ruff check app tests
```

### Frontend

From `frontend/`:

```bash
npm install
npm run dev
npm run lint
npm run build
```

The project does not yet include a frontend test runner. Add one when frontend
feature tests are implemented.

## Current baseline APIs

These implemented endpoints are the shared baseline and should be extended, not
redesigned:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/reservations` | List or filter reservations by property, status, and date range. |
| `GET` | `/api/v1/reservations/{id}` | Get a reservation with guest and folio detail. |
| `POST` | `/api/v1/reservations` | Create a reservation. |
| `GET` | `/api/v1/guests/{id}` | Get a guest profile and preference document. |
| `GET` | `/api/v1/folios/{id}` | Get a folio and its line items. |
| `GET` | `/api/v1/availability` | Check baseline rate-plan availability by property and date range. |

The current availability endpoint uses a flat capacity setting. Team 2 will
replace this with `MultiPropertyInventory` for real room and spa availability.

The baseline APIs currently return direct Pydantic response models. The Team 2
contract requires new feature APIs to adopt the agreed response envelope:

```json
{
  "success": true,
  "data": {},
  "message": null,
  "meta": { "request_id": "uuid" }
}
```

## Team 2 work allocation

| Owner | Sprint 2 scope | Sprint 3 scope |
| --- | --- | --- |
| Member 1 | Arrivals page and reservation integration | Authenticated guest/reservation context and access-control tests |
| Member 2 | Spa schedule and appointment APIs | Spa booking agent, availability, and confirmation gate |
| Member 3 | F&B operations and order APIs | UiPath nightly covers/occupancy variance workflow |
| Member 4 | Operations dashboard and six-property aggregation | Guest RAG assistant, AI API/widget integration, final coordination |

## Shared implementation rules

- Use JavaScript and JSX in the frontend. Do not add TypeScript files.
- Keep JSON fields and API paths in `snake_case` and lowercase plural form.
- Use UUID primary keys and UTC timestamps.
- Use the `/api/v1` prefix for all feature endpoints.
- Pages and components must call domain API modules, not Axios directly.
- Preserve the shared reservation, guest, folio, and availability contracts.
- Coordinate before changing shared files, especially `frontend/src/App.jsx`,
  `frontend/src/api/client.js`, `backend/app/main.py`, `backend/app/config.py`,
  `backend/app/database.py`, `.env.example`, and `docker-compose.yml`.
- Do not include guest PII in prompts to coding assistants.

## Team workflow

Start from the latest integrated branch and create a story branch:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/member2-spa
```

Use the branch that matches your story ownership. Merge backend contract changes
before connecting dependent frontend functionality where possible, and run the
relevant tests, lint checks, and build before opening a pull request.

## Roadmap

### Sprint 2

- Implement staff login and protected routes.
- Build Arrivals, Spa Schedule, F&B Operations, and Operations Dashboard pages.
- Add spa appointments, inventory, offers, and the supporting APIs.
- Connect pages through the shared API client and domain-specific API modules.

### Sprint 3

- Authenticate guest access to the embedded Meridian AI assistant.
- Ground assistant answers in `meridian_knowledge/` spa and dining documents,
  returning supporting source paths.
- Ensure the spa agent checks reservation context and availability, asks for
  explicit confirmation, creates one appointment only after confirmation, and
  stops after success or a definitive failure.
- Build the UiPath nightly F&B reconciliation and variance output.

### Final delivery

- Add CI/CD build, lint, test, and deployment gates. The current GitHub Actions
  workflow is a placeholder.
- Configure logging, monitoring, and at least one alert.
- Deploy to AWS EC2 and Azure App Service Containers.
- Complete integration, regression, security, and live-demo readiness checks.

## Reference documents

- [Team 2 implementation skeleton plan](plan-meridianContractSkeleton.prompt.md)
- [F&B reconciliation notes](automation/uipath/fnb_reconciliation/readme.md)
