# Phase 0 Environment Readiness

Checked on 2026-08-10 against `CLAUDE.md` section 2.

| Component | Required | Detected | Status |
| --- | --- | --- | --- |
| Node.js | 24 LTS | 24.18.1 portable; system default remains 25.9.0 | READY through local command wrapper |
| pnpm | Pinned, one lockfile | 11.21.0 portable | READY through local command wrapper |
| TypeScript | 6.x baseline | 6.0.3 in `pnpm-lock.yaml` | READY |
| Docker | Required for deployment/environments | Not installed | BLOCKED |
| Docker Compose | Required for local services | Not installed | BLOCKED |
| WSL2 | Required by the proposed Windows container setup | Not installed | BLOCKED: IT/admin action and restart likely required |
| PostgreSQL | 18.x | Compose configured for official 18.4 image; Docker unavailable | BLOCKED until Docker installation and first verified pull |
| Git | Required | 2.54.0.windows.1 | READY |
| GitHub remote | Private company repository | `systemtechnique/ST_online`; `main` published | READY |
| GitHub CI | Required quality checks | `quality` passed on pull request `#1` | READY |
| GitHub branch protection | Required on `main` | Private-repository protection rejected by current plan | BLOCKED: GitHub plan upgrade required |

Do not run project commands under the system Node.js 25 installation. Use
`.\scripts\node-local.cmd` and `.\scripts\pnpm-local.cmd`. The remaining environment tasks
are Docker and PostgreSQL 18 client/server tooling. Version selection or changes must
follow the ADR rule in `CLAUDE.md` section 2.

The repository-local Git identity is `systemtechnique <ai@systemtechnique.com>`. The
published history was rewritten before its first push so all commits use this identity.
The private remote is `https://github.com/systemtechnique/ST_online.git`. See
`it-handoff.md` for the remaining repository and workstation acceptance checks.
