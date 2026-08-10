# Local PostgreSQL 18 Environment

**Status: READY - verified on 10 August 2026.**

The local environment uses the official `postgres:18.4` image. PostgreSQL recommends
running the current minor release for the selected supported major version. Production
remains managed PostgreSQL and is configured separately.

## Security Defaults

- The database port binds to `127.0.0.1`, not every network interface.
- The password is required from the local environment and is never committed.
- Database and log timestamps use UTC; Egypt-local business dates are application/domain
  rules.
- PostgreSQL data is stored in a named Docker volume outside the repository.
- The healthcheck waits for the configured database and user.

## Local Setup And Start

1. Create an uncommitted `.env` from the variable names in `.env.example`.
2. Set a unique local-only `POSTGRES_PASSWORD`.
3. Use `POSTGRES_PORT=5433` on this workstation because native PostgreSQL already uses
   `5432`.
4. Start and verify the service:

```powershell
docker compose up -d --wait postgres
docker compose ps
docker compose exec postgres psql -U st_online_dev -d st_online_dev -c "select version();"
```

The verified container is `st_online-postgres-1`, bound only to
`127.0.0.1:5433`, with PostgreSQL `18.4`, UTC database time, and a healthy readiness
check. The local `.env` contains a generated development-only password and is ignored by
Git.

Do not create tables by hand. The empty database remains empty until the database
tooling ADR and first ERD slice are approved, after which migrations create the schema.

## Image Pinning Gate

The patch tag is pinned to `18.4`. The first verified pull resolved to digest
`sha256:a02db8cac496f15b094798a38254f14d6e00741f709360e5e00bb6668ea31636`.
Pin this digest in `compose.yaml` only as part of accepting the database-tooling ADR so
CI and local environments use the same reviewed image content.

Primary references:

- <https://www.postgresql.org/support/versioning/>
- <https://hub.docker.com/_/postgres>

