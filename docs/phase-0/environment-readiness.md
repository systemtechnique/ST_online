# Phase 0 Environment Readiness

Checked on 2026-08-10 against `CLAUDE.md` section 2.

| Component | Required | Detected | Status |
| --- | --- | --- | --- |
| Node.js | 24 LTS | 24.18.1 portable; system default remains 25.9.0 | READY through local command wrapper |
| pnpm | Pinned, one lockfile | 11.21.0 portable | READY through local command wrapper |
| TypeScript | 6.x baseline | 6.0.3 in `pnpm-lock.yaml` | READY |
| Docker | Required for deployment/environments | Not installed | BLOCKED |
| Docker Compose | Required for local services | Not installed | BLOCKED |
| PostgreSQL client | Compatible with PostgreSQL 18.x | Not installed | BLOCKED |
| Git | Required | 2.54.0.windows.1 | READY |

Do not run project commands under the system Node.js 25 installation. Use
`.\scripts\node-local.cmd` and `.\scripts\pnpm-local.cmd`. The remaining environment tasks
are Docker and PostgreSQL 18 client/server tooling. Version selection or changes must
follow the ADR rule in `CLAUDE.md` section 2.

The Git author identity was auto-detected as `Mohamed Helmy
<nMahmoud@systemtech.loc>`. Confirm that this is the intended company identity before
publishing the repository or creating shared history beyond Phase 0.
