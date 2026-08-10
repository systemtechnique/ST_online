# Phase 0 Environment Readiness

Checked on 2026-08-10 against `CLAUDE.md` section 2.

| Component | Required | Detected | Status |
| --- | --- | --- | --- |
| Node.js | 24 LTS | 25.9.0 | BLOCKED: wrong major version |
| pnpm | Pinned, one lockfile | Not installed | BLOCKED |
| Docker | Required for deployment/environments | Not installed | BLOCKED |
| Docker Compose | Required for local services | Not installed | BLOCKED |
| PostgreSQL client | Compatible with PostgreSQL 18.x | Not installed | BLOCKED |
| Git | Required | 2.54.0.windows.1 | READY |

Do not initialize the TypeScript workspace, install dependencies, or create migrations
under Node.js 25. The next environment task is to install Node.js 24 LTS, select and pin
the project pnpm version, and install Docker plus PostgreSQL client tooling. Version
selection or changes must follow the ADR rule in `CLAUDE.md` section 2.

The Git author identity was auto-detected as `Mohamed Helmy
<nMahmoud@systemtech.loc>`. Confirm that this is the intended company identity before
publishing the repository or creating shared history beyond Phase 0.

