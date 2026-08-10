# ST Online 2.0

ST Online 2.0 is System Technique's field-service and CRM platform for the water-treatment
operation. The repository is currently in Phase 0. No application schema or migration has
been approved yet.

## Read First

Every coding or database session must follow this order:

1. Read [`CLAUDE.md`](CLAUDE.md) in full.
2. Read [`AGENTS.md`](AGENTS.md) for the agent and database-track contract.
3. Read the relevant authoritative specification in [`docs/specifications`](docs/specifications).
4. Check [`docs/rulings/open-questions.md`](docs/rulings/open-questions.md) and any approved
   rulings for the affected area.

Never resolve a specification gap by implementation assumption. Stop the affected task,
record a `FLAG(spec)` question, and continue only independent work.

## Current Status

- Build constitution and Stage 1 specifications committed.
- Codex/database-track contract committed.
- Initial specification and supplied-data questions recorded.
- Direct-supply data profiled outside Git; no production records are committed.
- Local development environment is not ready for the pinned stack.
- ERD and migrations are pending owner rulings and environment preparation.

See [`docs/phase-0/plan.md`](docs/phase-0/plan.md) for the Phase 0 gate.

## Local Toolchain

The project pins Node.js 24.18.1 and pnpm 11.21.0. On this workstation, portable copies
are installed under the ignored `.tools` directory so the system Node.js installation is
not changed. Use the committed wrappers from PowerShell for project commands:

```powershell
.\scripts\node-local.cmd --version
.\scripts\pnpm-local.cmd install --frozen-lockfile
```

The wrappers fail if the exact local versions are absent. The committed
`package.json`, `.node-version`, and `.npmrc` enforce the same baseline for other
workstations and CI.

## Sensitive Data

Client exports, contacts, SOW samples, credentials, generated reports, and reconciled
imports are proprietary operational data. They remain outside Git and must be processed
only through the controlled import path defined in the source profile.
