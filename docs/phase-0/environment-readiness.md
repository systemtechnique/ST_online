# Phase 0 Environment Readiness

Checked on 2026-08-10 against `CLAUDE.md` section 2.

| Component | Required | Detected | Status |
| --- | --- | --- | --- |
| Node.js | 24 LTS | 24.18.1 portable; system default remains 25.9.0 | READY through local command wrapper |
| pnpm | Pinned, one lockfile | 11.21.0 portable | READY through local command wrapper |
| TypeScript | 6.x baseline | 6.0.3 in `pnpm-lock.yaml` | READY |
| Docker | Required for deployment/environments | Docker Desktop 29.6.2; Linux engine 29.6.2 | READY |
| Docker Compose | Required for local services | 5.3.1 | READY |
| WSL2 | Required by the Windows container setup | Version 2; `docker-desktop` default distribution | READY |
| PostgreSQL | 18.x | Official 18.4 container, healthy on `127.0.0.1:5433`, UTC | READY for local development |
| PostgreSQL client | Required for administration and verification | PostgreSQL 18 `psql.exe` installed; container client also verified | READY |
| Git | Required | 2.54.0.windows.1 | READY |
| GitHub remote | Private company repository | `systemtechnique/ST_online`; `main` published | READY |
| GitHub CI | Required quality checks | `quality` passed on pull request `#1` | READY |
| GitHub branch protection | Required on `main` | Private-repository protection rejected by current plan | BLOCKED: GitHub plan upgrade required |

Do not run project commands under the system Node.js 25 installation. Use
`.\scripts\node-local.cmd` and `.\scripts\pnpm-local.cmd`. Version selection or changes
must follow the ADR rule in `CLAUDE.md` section 2.

The project PostgreSQL environment was verified on 10 August 2026 using image
`postgres:18.4`, digest
`sha256:a02db8cac496f15b094798a38254f14d6e00741f709360e5e00bb6668ea31636`.
It reported PostgreSQL `18.4`, timezone `UTC`, database `st_online_dev`, and user
`st_online_dev`. A separate native PostgreSQL process already uses port `5432`, so the
project's uncommitted `.env` maps Docker PostgreSQL to host port `5433`.

The repository-local Git identity is `systemtechnique <ai@systemtechnique.com>`. The
published history was rewritten before its first push so all commits use this identity.
The private remote is `https://github.com/systemtechnique/ST_online.git`. See
`it-handoff.md` for the remaining repository and workstation acceptance checks.
