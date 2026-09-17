# Meridian Resorts & Spa

Meridian Resorts & Spa is an enterprise multi-property hospitality operations platform. It supports six luxury resort properties with a unified guest experience alongside a comprehensive staff operations console for guest arrivals, spa appointments, food and beverage (F&B) operations, cross-property analytics, and an AI-powered concierge grounded in resort knowledge documents.

---

## Architecture Overview

```text
React + Vite Frontend (Port 5173 / 3000)
        │
        ▼
FastAPI REST API (/api/v1, Port 8000)
        ├── PostgreSQL (Port 5432): Guests, Properties, Reservations, Rate Plans, Folios, Orders, Spa Appointments
        ├── MongoDB (Port 27017): Guest Preference Documents & Semi-Structured Data
        └── Meridian Knowledge Base: Property Spa, Dining, Hours, and Overview Source Documents
```

---

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose (v2.20+)
- Git

---

## Quick Start (Docker - Recommended)

The entire application stack (PostgreSQL, MongoDB, FastAPI Backend, and React Frontend) runs out of the box with Docker.

### 1. Clone the Repository
```bash
git clone https://github.com/itcadmu8/Meridian-Resorts-SPA.git
cd Meridian-Resorts-SPA
```

### 2. Configure Environment
```bash
cp .env.example .env
```

*(Optional: Add your `OPENAI_API_KEY` or `GEMINI_API_KEY` to `.env` to enable the AI concierge chatbot)*

### 3. Build and Start Services with Docker
```bash
docker compose up --build -d
```

### 4. Access Services
- **Frontend Portal**: [http://localhost:5173](http://localhost:5173)
- **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### 5. Stop Services
```bash
docker compose down
```
*(To reset databases and restart clean, run `docker compose down -v`)*

---

## Production Deployment (Docker Compose Prod)

For production staging with integrated health checks:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Automatic Database Seeding

On first startup, the backend automatically seeds all six Meridian Resorts & Spa properties with realistic guests, reservations, folios, F&B orders, spa appointments, and MongoDB guest preference documents.

To trigger seeding manually inside the Docker container:
```bash
docker compose exec backend python run_seed.py
```

---

## Repository Structure

```text
Meridian-Resorts-SPA/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI: Automated linting, type checks & pytest suite
│       └── cd.yml                 # CD: Container image builds & deployment automation
├── automation/
│   └── uipath/                    # Nightly F&B occupancy reconciliation workflow
├── backend/                       # FastAPI REST API application
│   ├── app/
│   │   ├── ai/                    # RAG assistant grounded in knowledge base & spa booking agent
│   │   ├── database/              # SQLAlchemy session & DB engine setup
│   │   ├── dependencies/          # Shared FastAPI route dependencies & auth context
│   │   ├── models/                # PostgreSQL SQLAlchemy ORM models
│   │   ├── routers/ & routes/     # Clean API endpoints (/guests, /reservations, /spa, /dashboard)
│   │   ├── schemas/               # Pydantic request/response schemas & validation
│   │   ├── seed/                  # 6-property seed dataset loaders
│   │   ├── services/              # Business logic (inventory, folios, offers, orders)
│   │   ├── config.py              # Central settings loaded from environment
│   │   ├── main.py                # FastAPI app initialization & middleware
│   │   └── mongo.py               # MongoDB client & collection helpers
│   ├── tests/                     # Automated Pytest suite
│   ├── .dockerignore              # Backend container exclusion rules
│   ├── Dockerfile                 # Python 3.12 slim FastAPI container
│   ├── pyproject.toml             # Python dependencies & Ruff/Pytest configuration
│   └── requirements.txt           # Standard pip requirements
├── frontend/                      # React 19 + TypeScript + Vite application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── api/                   # API client layer for backend endpoints
│   │   ├── components/            # Reusable UI components & AI chat widget
│   │   ├── guest-experience/      # Guest-facing portal & booking flows
│   │   ├── pages/                 # Operations dashboard, Arrivals, Spa, F&B
│   │   ├── App.tsx                # Main frontend application router & layout
│   │   └── main.tsx               # React DOM root entry point
│   ├── .dockerignore              # Frontend container exclusion rules
│   ├── Dockerfile                 # Node 20 Alpine container
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tsconfig.json              # TypeScript configuration
│   └── vite.config.ts             # Vite + TailwindCSS build configuration
├── meridian_knowledge/            # Approved spa, dining, hours, & resort documents for RAG
│   ├── property-01/ to 06/        # Per-property knowledge markdown files
│   └── property_index.json        # Knowledge metadata index
├── .dockerignore                  # Root container ignore rules
├── .env.example                   # Clean template for environment variables
├── .gitignore                     # Git exclusion rules
├── CI_CD.md                       # Comprehensive CI/CD & Deployment guide
├── docker-compose.yml             # Development Docker Compose orchestration
├── docker-compose.prod.yml        # Production Docker Compose orchestration
├── Makefile                       # Developer shortcuts (up, down, logs, test)
└── README.md                      # Primary project documentation
```

---

## CI/CD Pipeline & Quality Gates

This repository includes a multi-stage GitHub Actions CI/CD setup:
1. **Continuous Integration (`ci.yml`)**:
   - Backend: Ruff linting & 20+ automated tests executed with pytest across models, routers, and AI services.
   - Frontend: TypeScript type verification (`tsc --noEmit`) and Vite production bundle compilation.
2. **Continuous Delivery (`cd.yml`)**:
   - Automated multi-arch Docker image builds for Backend and Frontend.
   - Publishing to GitHub Container Registry (`ghcr.io`).
   - Healthcheck validation and deployment gates.

For detailed deployment architecture and secrets configuration, refer to [CI_CD.md](CI_CD.md).
