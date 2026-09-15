## Plan: Meridian Contract Skeleton

Create the complete Team 2 Sprint 2 and Sprint 3 directory/file skeleton around the existing mentor baseline and the already-created Vite React frontend. This is structure-only: add import-safe/empty placeholders and project directories, but do not implement routes, models, auth, UI, automation logic, or change existing API contracts.

**Steps**
1. Inspect the working tree before changes and preserve all existing mentor baseline and Vite-generated files. The existing backend is the authority for centralized `app/models.py`, `app/schemas.py`, `app/crud.py`, router registration in `app/main.py`, and tests in `backend/tests/`.
2. Create the frontend contract directories under `/home/LabsKraft/TEAM2/adm-starter/frontend/src/`: `api/`, `hooks/`, `pages/guest/`, `pages/auth/`, `pages/staff/`, `components/ai/`, `components/auth/`, `components/staff/arrivals/`, `components/staff/spa/`, `components/staff/fnb/`, `utils/`, and `tests/`. Use `.gitkeep` only for documented optional component/utils directories that otherwise have no specified file name.
3. Add the named frontend skeleton files without wiring them into `App.jsx`: `api/client.js`, `api/authApi.js`, `api/reservationsApi.js`, `api/spaApi.js`, `api/ordersApi.js`, `api/dashboardApi.js`, `api/aiApi.js`; `hooks/useAuth.js`, `hooks/useArrivals.js`, `hooks/useSpaAppointments.js`, `hooks/useOrders.js`, `hooks/useOperationsDashboard.js`, `hooks/useAiChat.js`; pages `MeridianGuestHome.jsx`, `GuestLogin.jsx`, `StaffLogin.jsx`, `OperationsDashboard.jsx`, `Arrivals.jsx`, `SpaSchedule.jsx`, `FnbOperations.jsx`; auth components `LoginForm.jsx`, `ProtectedRoute.jsx`; AI components `AiLauncher.jsx`, `AiChatWidget.jsx`, `ChatMessage.jsx`, `ChatInput.jsx`; and named frontend test placeholders `Arrivals.test.jsx`, `SpaSchedule.test.jsx`, `FnbOperations.test.jsx`, `OperationsDashboard.test.jsx`, `AiChatWidget.test.jsx`. *Depends on 2.*
4. Create backend support package directories with `__init__.py`: `/home/LabsKraft/TEAM2/adm-starter/backend/app/dependencies/`, `services/`, `ai/`, `ai/rag/`, and `ai/agent/`. Add contract-named placeholder modules: `dependencies/auth.py`; routers `auth.py`, `arrivals.py`, `spa.py`, `orders.py`, `inventory.py`, `offers.py`, `dashboard.py`, `ai.py`; services `arrival_service.py`, `spa_service.py`, `order_service.py`, `dashboard_service.py`, `ai_service.py`; RAG modules `ingestion.py`, `embeddings.py`, `retriever.py`, `prompts.py`; and spa-agent modules `spa_agent.py`, `tools.py`, `confirmation.py`. Do not register new routers in `app/main.py` yet. *Can run in parallel with 2-3.*
5. Preserve `/home/LabsKraft/TEAM2/adm-starter/backend/app/schemas.py` as the one schema module. Do not create `backend/app/schemas/` or domain schema files: the design document permits those only when schemas are split by domain, and a package with this name would conflict with the mentor baseline module. Future Team 2 schemas will be added to the centralized module unless the team explicitly approves a migration. *Decision gate for future implementation.*
6. Add backend test placeholders beside the existing test convention under `/home/LabsKraft/TEAM2/adm-starter/backend/tests/`: `test_arrivals.py`, `test_spa.py`, `test_spa_agent.py`, `test_orders.py`, `test_dashboard.py`, `test_ai.py`, `test_auth.py`, and `test_auth_context.py`. This intentionally corrects the design document's generic `backend/app/tests/` references to the starter's actual `backend/tests/` source-of-truth path. *Depends on 4.*
7. Add the non-code contract structure: `/home/LabsKraft/TEAM2/adm-starter/automation/uipath/fnb_reconciliation/readme.md` plus retained empty workflow/test folders, `/home/LabsKraft/TEAM2/adm-starter/meridian_knowledge/property-01/` through `property-06/`, each with `overview.md`, `spa-services.md`, `dining.md`, and `hours.md`; and `/home/LabsKraft/TEAM2/adm-starter/.github/workflows/ci-cd.yml`. Keep UiPath project file naming deferred because the contract expressly leaves it to the team's UiPath convention. *Can run in parallel with 2-6.*
8. Verify structure and safety after creation: check every design-contract path exists, ensure no `backend/app/schemas/` directory was introduced, run the current backend test and Ruff commands, and run the existing frontend lint and build commands. Since this is skeleton-only, tests should retain their baseline behavior; no frontend test runner is added until test implementation begins.

**Relevant files**
- `/home/LabsKraft/TEAM2/adm-starter/backend/app/main.py` — existing router-registration authority; deliberately unchanged during skeleton creation.
- `/home/LabsKraft/TEAM2/adm-starter/backend/app/models.py` — centralized baseline and future Team 2 entity contract; deliberately unchanged during skeleton creation.
- `/home/LabsKraft/TEAM2/adm-starter/backend/app/schemas.py` — must remain a module; do not create a same-named package.
- `/home/LabsKraft/TEAM2/adm-starter/backend/tests/conftest.py` — establishes the correct test location and dependency-override pattern.
- `/home/LabsKraft/TEAM2/adm-starter/frontend/package.json` — existing Vite React tooling; preserve it without adding test dependencies in this structure-only phase.
- `/home/LabsKraft/TEAM2/adm-starter/frontend/src/App.jsx` — existing generated shell; deliberately not replaced or connected to placeholders in this phase.

**Verification**
1. Compare the resulting directory tree against the Sprint 2/Sprint 3 paths and ownership maps in the submitted design document.
2. Confirm the starter baseline files and existing Vite configuration remain unchanged except for explicitly agreed future integration work.
3. From `/home/LabsKraft/TEAM2/adm-starter`, run `make test` and `make lint` to retain backend baseline behavior.
4. From `/home/LabsKraft/TEAM2/adm-starter/frontend`, run `npm run lint` and `npm run build` to verify the Vite skeleton remains valid.

**Decisions**
- Include both Sprint 2 and Sprint 3 structure now.
- Create only skeleton paths and placeholders; do not add runtime implementation or route/app wiring.
- Include the planned shared-path placeholders (`dependencies/auth.py`, auth router, CI workflow), as requested.
- Keep Vite-generated files, dependencies, and the mentor Docker setup intact.
- Use `backend/tests/`, not `backend/app/tests/`, because the mentor baseline is authoritative.
- Exclude a `backend/app/schemas/` package to avoid a Python import collision with `backend/app/schemas.py`.
- Exclude concrete UiPath project files until the team's UiPath workspace/naming convention is chosen.
- Exclude frontend test tooling configuration and dependencies; empty test placeholders do not need a runner yet.
