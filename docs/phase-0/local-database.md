# Local PostgreSQL 18 Environment

**Status: CONFIGURED, NOT RUN - Docker is not installed on this workstation.**

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

## Start After Docker Is Approved And Installed

1. Create an uncommitted `.env` from the variable names in `.env.example`.
2. Set a unique local-only `POSTGRES_PASSWORD`.
3. Start and verify the service:

```powershell
docker compose up -d postgres
docker compose ps
docker compose exec postgres psql -U st_online_dev -d st_online_dev -c "select version();"
```

Do not create tables by hand. The empty database remains empty until the database
tooling ADR and first ERD slice are approved, after which migrations create the schema.

## Image Pinning Gate

The patch tag is pinned to `18.4`. After the first approved pull, record and pin the
official image digest as part of accepting the database-tooling ADR so CI and local
environments use the same image content.

Primary references:

- <https://www.postgresql.org/support/versioning/>
- <https://hub.docker.com/_/postgres>

